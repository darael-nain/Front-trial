// Objeto global donde se guardarán los filtros seleccionados
let selectedFilters = {};
let globalClickHandler = null;
let allSelects = [];

// Cerrar todos los dropdowns excepto el actual
const closeAllDropdowns = (currentDropdown) => {
    allSelects.forEach(({ dropdown, select }) => {
        if (dropdown !== currentDropdown) {
            dropdown.style.display = 'none';
            select.classList.remove('filter-select-open');
        }
    });
};

// Manejar clic fuera del dropdown
const setGlobalClickHandler = (dropdown, select) => {
    if (globalClickHandler) {
        document.removeEventListener('click', globalClickHandler);
    }

    globalClickHandler = function (event) {
        if (!select.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.style.display = 'none';
            select.classList.remove('filter-select-open');
        }
    };

    document.addEventListener('click', globalClickHandler);
};

// Mostrar/ocultar dropdown
const setupSelectElement = (selectElement, dropdown) => {
    selectElement.addEventListener('click', (event) => {
        const isOpen = dropdown.style.display === 'block';
        closeAllDropdowns(isOpen ? null : dropdown);
        dropdown.style.display = isOpen ? 'none' : 'block';
        selectElement.classList.toggle('filter-select-open', !isOpen);
        event.stopPropagation();
    });
};

// Poblar dropdown con las opciones
const populateDropdown = (dropdown, rows, name) => {
    dropdown.innerHTML = '';

    const optionDefault = document.createElement('div');
    optionDefault.classList.add('filter-option');
    optionDefault.textContent = 'Sin filtro';
    optionDefault.dataset.value = '';
    optionDefault.dataset.name = name;
    dropdown.appendChild(optionDefault);

    rows.forEach(optionData => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('filter-option');
        optionElement.textContent = optionData.text;
        optionElement.dataset.value = optionData.id;
        optionElement.dataset.name = name;
        dropdown.appendChild(optionElement);
    });
};

// Registrar eventos de cada opción del dropdown
const setupDropdownOptions = (dropdown, selectElement, caption) => {
    dropdown.querySelectorAll('.filter-option').forEach(optionElement => {
        optionElement.addEventListener('click', (event) => {
            const value = event.target.dataset.value;
            const name = event.target.dataset.name;

            if (value === '') {
                selectElement.querySelector('.filter-select-text').innerText = caption;
                delete selectedFilters[name];
            } else {
                selectElement.querySelector('.filter-select-text').innerText = event.target.innerText;
                selectedFilters[name] = value;
            }

            dropdown.style.display = 'none';
            selectElement.classList.remove('filter-select-open');
            //dvancedSearch(); // acción al seleccionar
            renderActiveFilters(); // 💥 aquí
            event.stopPropagation();
        });
    });
};

async function generateHTMLFilter(filters) {
    const container = document.querySelector('.filter-body');
    container.innerHTML = '';
    allSelects = [];
    selectedFilters = {};

    for (const filter of filters) {
        const caption = filter.caption || filter.name;
        const wrapper = document.createElement('div');
        wrapper.className = 'filter-field';

        if (filter.type === 'new_select') {
            let options = [];

            if (Array.isArray(filter.dataObject)) {
                options = filter.dataObject;
            } else if (typeof filter.dataSource === 'string') {
                try {
                    const hasQuery = filter.dataSource.includes('?');
                    const url = '/4DACTION/_V3_' + filter.dataSource + (hasQuery ? '&q=' : '?q=');
                    const response = await $.ajax({ url, method: 'GET' });
                    const parsed = typeof response === 'string' ? JSON.parse(response) : response;
                    options = parsed.rows || parsed;
                } catch (err) {
                    console.error(`Error al obtener datos para ${filter.name}`, err);
                    continue;
                }
            }

            // Estructura del selector con nuevas clases
            const selectWrapper = document.createElement('div');
            selectWrapper.className = 'filter-select-wrapper';

            const selectElement = document.createElement('div');
            selectElement.className = `filter-select filter-select_${filter.name}`;
            selectElement.innerHTML = `
                <div class="filter-select-text">${caption}</div>
                <div class="filter-select-icon"><i class="fa-solid fa-angle-down"></i></div>
            `;

            const dropdown = document.createElement('div');
            dropdown.className = `filter-dropdown filter-dropdown_${filter.name}`;
            dropdown.style.display = 'none';

            populateDropdown(dropdown, options, filter.name);
            setupDropdownOptions(dropdown, selectElement, caption);
            setupSelectElement(selectElement, dropdown);

            selectWrapper.appendChild(selectElement);
            selectWrapper.appendChild(dropdown);
            wrapper.appendChild(selectWrapper);
            container.appendChild(wrapper);

            allSelects.push({ dropdown, select: selectElement });
            setGlobalClickHandler(dropdown, selectElement);
        }
    }
}

function upModalFilter() {
    const panel = document.getElementById("filterPanel");
    const isActive = panel.classList.contains('active');

    if (isActive) {
        panel.classList.remove('active');
        document.body.classList.remove('no-scroll');
    } else {
        panel.classList.add('active');
        document.body.classList.add('no-scroll');
    }
}
function renderActiveFilters() {
    const listContainer = document.getElementById('filterActiveList');
    listContainer.innerHTML = '';

    Object.entries(selectedFilters).forEach(([key, value]) => {
        const chip = document.createElement('div');
        chip.className = 'filter-chip';

        const text = document.createElement('span');
        text.className = 'chip-text';
        text.innerText = getCaptionForFilter(key, value); // Muestra texto legible

        const removeBtn = document.createElement('button');
        removeBtn.className = 'chip-remove';
        removeBtn.innerHTML = '&times;';
        removeBtn.onclick = () => {
            delete selectedFilters[key];
            generateHTMLFilter(currentFilters); // refresca selects
            renderActiveFilters(); // refresca chips
            advancedSearch(); // actualiza resultados
        };

        chip.appendChild(text);
        chip.appendChild(removeBtn);
        listContainer.appendChild(chip);
    });
}
function getCaptionForFilter(key, value) {
    // Puedes expandir con más lógica si necesitas traducir valores
    const matchingSelect = document.querySelector(`.filter-select_${key}`);
    if (matchingSelect) {
        const option = document.querySelector(`.filter-dropdown_${key} .filter-option[data-value="${value}"]`);
        return option ? option.innerText : value;
    }
    return value;
}
