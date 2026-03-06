

// ======================= Descarga helper =======================
function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// ======================= Fetch helpers =======================
async function fetchJson(url) {
    const r = await fetch(url, { credentials: "include" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
}

async function fetchBlob(url) {
    
    const r = await fetch(url, { credentials: "include" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const blob = await r.blob();
    const contentType = r.headers.get("content-type") || "";
    const cd = r.headers.get("content-disposition") || "";
    return { blob, contentType, contentDisposition: cd };
}

// ======================= OC helpers =======================
// Ajusta aquí el campo real que viene en resp.rows
function extractOcIds(resp) {
    const rows = (resp && resp.rows) ? resp.rows : [];

    const ids = rows
        .map(r => r.id ?? r.id_oc ?? r.id_oc_cliente ?? r.oc_id)
        .filter(v => v !== null && v !== undefined && v !== "")
        .map(v => String(v).trim());


    return [...new Set(ids)];
}

function extractOcNumbers(resp) {
    const rows = (resp && resp.rows) ? resp.rows : [];
  
    const map = {}; 
  
    for (const r of rows) {
      const ocId = (r && r.id !== null && r.id !== undefined) ? String(r.id).trim() : "";
      const folio = (r && r.folio !== null && r.folio !== undefined) ? String(r.folio).trim() : "";
  
      if (!ocId || !folio) continue;
  
      map[ocId] = folio;
    }
  
    return map;
  }
  

function guessExt(contentType, contentDisposition) {
    const cd = (contentDisposition || "").toLowerCase();
    const ct = (contentType || "").toLowerCase();

    if (cd.includes(".zip") || ct.includes("zip")) return "zip";
    if (cd.includes(".pdf") || ct.includes("pdf")) return "pdf";
    return "bin";
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function sanitizeFileName(name) {
    return String(name || "archivo")
        .replace(/[\\/:*?"<>|]+/g, "_")
        .replace(/\s+/g, "_");
}

function guessExt(contentType, contentDisposition) {
    if ((contentType || "").includes("pdf")) return "pdf";
    return "bin";
}

function getFilenameFromCD(contentDisposition) {
    if (!contentDisposition) return "";

    let m = contentDisposition.match(/filename\*\s*=\s*([^;]+)/i);
    if (m) {
        let v = m[1].trim().replace(/^UTF-8''/i, "").replace(/^"(.*)"$/, "$1");
        try { v = decodeURIComponent(v); } catch { }
        return v;
    }

    m = contentDisposition.match(/filename\s*=\s*([^;]+)/i);
    if (m) {
        return m[1].trim().replace(/^"(.*)"$/, "$1");
    }

    return "";
}

async function downloadOcZipFront(ocIds, ocNumbers, negocioNum, rowId) {
    const idx = `OC_NV|${ocIds.join("|")}`;
    const infoUrl = `/4DACTION/_V3_getUploadsInfo?index=${encodeURIComponent(idx)}`;

    const info = await fetchJson(infoUrl);
    if (!info.success) {
        toastr.error(info.message || "No se pudo obtener info de adjuntos.");
        return;
    }

    const zip = new JSZip();

    for (const item of info.items) {
        if (item.files.length===0) continue;
        
        const ocId = (item.index.split("|")[1]) || "OC";
        const ocNum = ocNumbers[parseInt(ocId)]
        const folder = zip.folder(`OC_${sanitizeFileName(ocId)}`);
        for (const f of item.files) {
            const { blob, contentType, contentDisposition } = await fetchBlob(f.download_url);

            const ext = guessExt(contentType, contentDisposition);
            const base = sanitizeFileName(f.filename || `OC_${ocNum}`);
            const finalName = base.toLowerCase().endsWith(`.${ext}`) ? base : `${base}.${ext}`;

            folder.file(finalName, blob);
        }
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    downloadBlob(zipBlob, `NEGOCIO_${sanitizeFileName(negocioNum)}.zip`);
}


// ======================= Click handler =======================
$(document).on("click", ".btn-clip", async function (e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();


    const $btn = $(this);
    const $tr = $btn.closest("tr");
    const rowId = $tr.data("id");
    const negocioNum = $tr.data("index");

    if (!rowId) {
        toastr.error("No se encontró data-id en la fila.");
        return;
    }

    // evitar doble click
    if ($btn.data("busy")) return;
    $btn.data("busy", true).prop("disabled", true);

    try {
        // 1) Llamada para obtener OCs asociados a la fila
        const ocUrl =
            `/4DACTION/_V3_getOcclientes?id=${encodeURIComponent(rowId)}`;

        const resp = await fetchJson(ocUrl);
        const ocIds = extractOcIds(resp);
        const ocNumbers = extractOcNumbers(resp);

        if (!ocIds.length) {
            toastr.error("No se encontraron OCs para este registro.");
            return;
        }

        if (ocIds.length === 1) {
            const ocId = ocIds[0];
            const ocNumber = ocNumbers[parseInt(ocId)]
            const url = `/4DACTION/_V3_getUpload?index=${encodeURIComponent("OC_NV|" + ocId)}`;

            const { blob, contentType, contentDisposition } = await fetchBlob(url);

            const serverName = getFilenameFromCD(contentDisposition);

            if (serverName) {
                downloadBlob(blob, serverName);
            } else {
                const ext = guessExt(contentType, contentDisposition);
                downloadBlob(blob, `OC_${ocNumber}.${ext}`);
            }
            return;
        }


        // Formato requerido: ?index=OC_NV|ID1&index=OC_NV|ID2...
        // 3) Varias OCs -> ZIP en el FRONT
        await downloadOcZipFront(ocIds, ocNumbers, negocioNum, rowId);


    } catch (err) {
        console.error(err);
        toastr.error("Error al obtener/descargar adjuntos de OC.");
    } finally {
        $btn.data("busy", false).prop("disabled", false);
    }
});
