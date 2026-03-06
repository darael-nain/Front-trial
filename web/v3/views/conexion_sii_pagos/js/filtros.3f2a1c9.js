(() => {
    const ready = (fn) => {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", fn);
      } else {
        fn();
      }
    };
  
    /* ---------------------------
       Config
    --------------------------- */
    const PILL_ROOT_SEL = "#mov_filter_pills";
    const HIDE_CLASS = "hidden-by-mov";
  
    let movFilter = "all";
    let raf = null;
    let observer = null;
    let isApplying = false;
  
    const schedule = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(runAll);
    };
  
    /* ---------------------------
       Helpers
    --------------------------- */
    const fmtCLP = (n) =>
      "$ " + new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 }).format(Math.round(n || 0));
  
    const normalize = (txt) =>
      (txt || "")
        .toUpperCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim();
  
    const estadoToKey = (estadoTxt) => {
      const t = normalize(estadoTxt);
      if (t.includes("SIN COINCIDEN")) return "sin";
      if (t.includes("CONCILIAD")) return "conciliado";
      if (t.includes("COINCIDEN")) return "coincidencia";
      return "unknown";
    };
  
    const normalizeTipo = (txt) => {
      const t = (txt || "").trim().toLowerCase();
      const m = t.match(/\b(cargo|abono)\b/);
      return m ? m[1] : t;
    };
  
    const getAllItems = () => {
      return Array.from(document.querySelectorAll(".accordion-item.mov"));
    };
  
    const getTipo = (item) => {
      const badge = item.querySelector(".accordion-button strong.badge, .accordion-button .badge");
      return normalizeTipo(badge?.textContent);
    };
  
    const getEstadoKey = (item) => {
      const estadoTxt = item.querySelector(".estado span")?.textContent || "";
      return estadoToKey(estadoTxt);
    };
  
    const getMonto = (item) => {
      const raw = item.getAttribute("data-total");
      const n = Number(raw);
      if (!Number.isFinite(n)) return 0;
      return Math.abs(n);
    };
  
    const setActivePill = (value) => {
      const root = document.querySelector(PILL_ROOT_SEL);
      if (!root) return;
  
      root.querySelectorAll(".pill").forEach(b => b.classList.remove("is-active"));
      (root.querySelector(`.pill[data-value="${value}"]`) || root.querySelector(`.pill[data-value="all"]`))
        ?.classList.add("is-active");
    };
  
    const getActivePillValue = () => {
      const root = document.querySelector(PILL_ROOT_SEL);
      const active = root?.querySelector(".pill.is-active[data-value]");
      return active?.dataset.value || "all";
    };
  
    const setPillCounts = ({ all = 0, cargo = 0, abono = 0 }) => {
      const root = document.querySelector(PILL_ROOT_SEL);
      if (!root) return;
  
      const put = (key, val) => {
        const el = root.querySelector(`.pill-count[data-count="${key}"]`);
        if (el) el.textContent = String(val);
      };
  
      put("all", all);
      put("cargo", cargo);
      put("abono", abono);
    };
  
    /* ---------------------------
       1) Filtrado por pastillas + contadores
    --------------------------- */
    const applyMovFilter = (allItems) => {
      allItems.forEach(item => item.classList.remove(HIDE_CLASS));
  
      const visibleNow = allItems.filter(item => window.getComputedStyle(item).display !== "none");
  
      let cargoCount = 0;
      let abonoCount = 0;
  
      visibleNow.forEach(item => {
        const tipo = getTipo(item);
        if (tipo === "cargo") cargoCount++;
        else if (tipo === "abono") abonoCount++;
      });
  
      setPillCounts({
        all: visibleNow.length,
        cargo: cargoCount,
        abono: abonoCount
      });
  
      // aplicar filtro
      if (!movFilter || movFilter === "all") return;
  
      visibleNow.forEach(item => {
        const tipo = getTipo(item);
        if (tipo !== movFilter) item.classList.add(HIDE_CLASS);
      });
    };
  
    /* ---------------------------
       2) Totales por estado (arriba)
    --------------------------- */
    const paintTopTotals = (allItems) => {
      const sums = {
        all: { abono: 0, cargo: 0 },
        sin: { abono: 0, cargo: 0 },
        coincidencia: { abono: 0, cargo: 0 },
        conciliado: { abono: 0, cargo: 0 }
      };
  
      for (const item of allItems) {
        const monto = getMonto(item);
        const tipo = getTipo(item);
        const estado = getEstadoKey(item);
  
        if (tipo !== "cargo" && tipo !== "abono") continue;
  
        sums.all[tipo] += monto;
        if (sums[estado]) sums[estado][tipo] += monto;
      }
  
      document.querySelectorAll(".estado-resumen[data-res-key]").forEach(block => {
        const key = block.getAttribute("data-res-key");
        const data = sums[key] || { abono: 0, cargo: 0 };
  
        const ab = block.querySelector(".abonos-res");
        const ca = block.querySelector(".cargos-res");
  
        if (ab) {
          const v = ab.querySelector(".resume-value--abono"); // el span verde
          if (v) v.textContent = fmtCLP(data.abono);
        }
        
        if (ca) {
          const v = ca.querySelector(".resume-value--cargo"); // el span rojo
          if (v) v.textContent = fmtCLP(data.cargo);
        }
        
  
      });
    };
  
    /* ---------------------------
       Run everything once
    --------------------------- */
    const runAll = () => {
      if (isApplying) return;
      isApplying = true;
      try {
        const allItems = getAllItems();
        if (!allItems.length) return;
  
        paintTopTotals(allItems);
  
        applyMovFilter(allItems);
  
      } finally {
        isApplying = false;
      }
    };
  
    ready(() => {
      movFilter = getActivePillValue();
      setActivePill(movFilter);
  
      document.addEventListener("click", (e) => {
        const btn = e.target.closest(`${PILL_ROOT_SEL} .pill[data-value]`);
        if (!btn) return;
  
        movFilter = btn.dataset.value || "all";
        setActivePill(movFilter);
        schedule();
      });
  
      document.addEventListener("click", (e) => {
        if (e.target.closest(".colorSelector")) schedule();
      });
  
      observer = new MutationObserver(() => {
        if (isApplying) return;
        schedule();
      });
  
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
  
      schedule();
    });
  })();
  