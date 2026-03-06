/**
 * Sistema de Importación de Comprobantes Contables
 * Versión mejorada con JavaScript Vanilla (sin jQuery)
 * @version 2.1 - Sin onclick handlers, sin DOMContentLoaded
 * @author Sistema Contable
 */

console.log('🚀 importar_comprobantes.js cargado - v2.1');

// ============================================================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ============================================================================

const AppState = {
    isProcessing: false,
    validationInProgress: false,
    currentFile: null,
    currentValidationErrors: null,
    pendingImport: null,
    nodeUrl: window.nodeUrl || '',
    sheetId: null
};

// ============================================================================
// UTILIDADES
// ============================================================================

const Utils = {
    formatExcelDate(value) {
        if (!value) return '';

        if (value instanceof Date && !isNaN(value.getTime())) {
            return this.formatDateObject(value);
        }

        if (typeof value === 'number' && value > 0) {
            const date = this.excelSerialToDate(value);
            if (!isNaN(date.getTime())) {
                return this.formatDateObject(date);
            }
        }

        const s = String(value).trim();
        if (/^\d+$/.test(s)) {
            const num = parseInt(s);
            if (num > 1000 && num < 100000) {
                const date = this.excelSerialToDate(num);
                if (!isNaN(date.getTime())) {
                    return this.formatDateObject(date);
                }
            }
        }

        return s;
    },

    excelSerialToDate(serial) {
        const excelEpoch = new Date(1900, 0, 1);
        return new Date(excelEpoch.getTime() + (serial - 2) * 24 * 60 * 60 * 1000);
    },

    formatDateObject(date) {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
    },

    formatNumber(value) {
        if (!value || isNaN(parseFloat(value))) return '';
        return parseFloat(value).toLocaleString('es-CL');
    },

    slideUp(element) {
        element.style.maxHeight = element.scrollHeight + 'px';
        element.offsetHeight;
        element.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
        element.style.maxHeight = '0';
        element.style.opacity = '0';
        setTimeout(() => {
            element.style.display = 'none';
        }, 300);
    },

    slideDown(element) {
        element.style.display = 'block';
        element.style.maxHeight = '0';
        element.style.opacity = '0';
        element.offsetHeight;
        element.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
        element.style.maxHeight = element.scrollHeight + 'px';
        element.style.opacity = '1';
        setTimeout(() => {
            element.style.maxHeight = '';
        }, 300);
    },

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    },

    getSid() {
        let sid = '';
        document.cookie.split(';').forEach(cookie => {
            sid += cookie.trim() + ' ';
        });
        return sid.trim();
    },

    showToast(message, type = 'info') {
        if (typeof toastr !== 'undefined') {
            toastr[type](message);
        } else {
            alert(message);
        }
    },

    blockUI() {
        if (typeof unaBase !== 'undefined' && unaBase.ui) {
            unaBase.ui.block();
        }
    },

    unblockUI() {
        if (typeof unaBase !== 'undefined' && unaBase.ui) {
            unaBase.ui.unblock();
        }
    }
};

// ============================================================================
// GESTIÓN DE MODALES
// ============================================================================

const Modal = {
    show(modalElement) {
        modalElement.classList.add('show');
    },

    hide(modalElement) {
        modalElement.classList.remove('show');
        setTimeout(() => {
            modalElement.style.display = 'none';
        }, 300);
    },

    showErrors(errors) {
        const modalHTML = `
            <div class="custom-modal show" id="errorsModal">
                <div class="modal-content">
                    <div class="modal-header warning">
                        <h5>
                            <i class="fa fa-exclamation-triangle"></i> 
                            Errores de Validación (${errors.length})
                        </h5>
                        <button class="modal-close" data-modal-close="errorsModal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-warning">
                            <strong>Instrucciones:</strong> Revisa los errores en las filas indicadas 
                            y corrige los datos en tu archivo Excel antes de importar.
                        </div>
                        <div style="max-height: 400px; overflow-y: auto;">
                            <table class="modal-table">
                                <thead>
                                    <tr>
                                        <th style="width: 80px;">Fila</th>
                                        <th>Error</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${this._renderErrorRows(errors)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-modal-close="errorsModal">Cerrar</button>
                    </div>
                </div>
            </div>
        `;

        this._removeExistingModal('errorsModal');
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Agregar listener al botón de cerrar
        this._attachCloseListeners('errorsModal');
    },

    _renderErrorRows(errors) {
        return errors.map((error) => {
            const filaMatch = error.match(/fila (\d+)/i);
            const filaNum = filaMatch ? filaMatch[1] : 'N/A';
            const errorText = error.replace(/fila \d+:\s*/i, '');

            return `
                <tr>
                    <td style="font-weight: bold;">${Utils.escapeHtml(filaNum)}</td>
                    <td>${Utils.escapeHtml(errorText)}</td>
                </tr>
            `;
        }).join('');
    },

    showImportedSeats(seats) {
        const modalHTML = `
            <div class="custom-modal show" id="importedSeatsModal">
                <div class="modal-content">
                    <div class="modal-header success">
                        <h5>
                            <i class="fa fa-check-circle"></i> 
                            Asientos Importados Exitosamente (${seats.length})
                        </h5>
                        <button class="modal-close" data-modal-close="importedSeatsModal" style="color: white;">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info">
                            <strong>¡Importación exitosa!</strong> Se han importado ${seats.length} 
                            asientos contables únicos. Haz clic en cualquier asiento para abrirlo 
                            en una nueva pestaña y verificar su contenido.
                        </div>
                        <div style="max-height: 400px; overflow-y: auto;">
                            <table class="modal-table">
                                <thead>
                                    <tr>
                                        <th style="width: 60px;">ID</th>
                                        <th style="width: 80px;">Fecha</th>
                                        <th style="width: 100px;">Tipo</th>
                                        <th style="width: 120px;">Cuenta</th>
                                        <th style="width: 100px; text-align: right;">Debe</th>
                                        <th style="width: 100px; text-align: right;">Haber</th>
                                        <th>Referencia</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${this._renderSeatRows(seats)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" data-modal-close="importedSeatsModal">
                            <i class="fa fa-check"></i> Finalizar Revisión
                        </button>
                    </div>
                </div>
            </div>
        `;

        this._removeExistingModal('importedSeatsModal');
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Agregar listeners
        this._attachCloseListeners('importedSeatsModal');
        this._attachSeatClickListeners();
    },

    _renderSeatRows(seats) {
        return seats.map((seat) => {
            const debeFormatted = Utils.formatNumber(seat.debe || 0);
            const haberFormatted = Utils.formatNumber(seat.haber || 0);

            return `
                <tr data-seat-id="${seat.id}" class="seat-row" title="Hacer clic para abrir en nueva pestaña">
                    <td style="font-weight: bold; color: #007bff;">
                        ${seat.id} 
                        <i class="fa fa-external-link" 
                           style="font-size: 10px; margin-left: 5px; opacity: 0.7;"></i>
                    </td>
                    <td>${Utils.escapeHtml(seat.fecha || '-')}</td>
                    <td>${Utils.escapeHtml(seat.tipo || '-')}</td>
                    <td>${Utils.escapeHtml(seat.cuenta || '-')}</td>
                    <td style="text-align: right;">${debeFormatted}</td>
                    <td style="text-align: right;">${haberFormatted}</td>
                    <td>${Utils.escapeHtml(seat.ref || '-')}</td>
                </tr>
            `;
        }).join('');
    },

    _attachCloseListeners(modalId) {
        // Listener para botones con data-modal-close
        document.querySelectorAll(`[data-modal-close="${modalId}"]`).forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.remove('show');
                    setTimeout(() => modal.remove(), 300);
                }
            });
        });
    },

    _attachSeatClickListeners() {
        document.querySelectorAll('.seat-row').forEach(row => {
            row.addEventListener('click', () => {
                const seatId = row.dataset.seatId;
                const baseUrl = window.location.origin;
                const seatUrl = `${baseUrl}/4DACTION/wbienvenidos#comprobantes/content.shtml?id=${seatId}`;
                const newTab = window.open(seatUrl, '_blank');
                if (newTab) {
                    newTab.focus();
                } else {
                    alert('Por favor, permite las ventanas emergentes para abrir los asientos en nuevas pestañas.');
                }
            });
        });
    },

    _removeExistingModal(modalId) {
        const existingModal = document.getElementById(modalId);
        if (existingModal) {
            existingModal.remove();
        }
    }
};

// ============================================================================
// PROCESAMIENTO DE DATOS EXCEL (mismo código que antes)
// ============================================================================

const ExcelProcessor = {
    processExcelData(jsonData) {
        if (!jsonData || jsonData.length < 2) {
            return { headers: [], rows: [] };
        }

        const headers = jsonData[0] || [];
        const dataRows = jsonData.slice(1);
        const indices = this.findColumnIndices(headers, dataRows);

        if (indices.debeIndex === -1 || indices.haberIndex === -1) {
            return this._processWithoutGrouping(dataRows, headers);
        }

        const grupos = this.groupByAsiento(dataRows, indices);

        if (Object.keys(grupos).length === 0) {
            return this.processSingleGroup(dataRows, indices, headers);
        }

        return this.processMultipleGroups(grupos, indices, headers);
    },

    findColumnIndices(headers, dataRows) {
        let debeIndex = -1;
        let haberIndex = -1;
        let asientoIndex = -1;
        let fechaIndex = -1;

        headers.forEach((header, index) => {
            const headerStr = String(header || '').toLowerCase().trim();

            if (headerStr.includes('debe') && debeIndex === -1) debeIndex = index;
            if (headerStr.includes('haber') && haberIndex === -1) haberIndex = index;
            if (headerStr.includes('fecha')) fechaIndex = index;
            if (headerStr.includes('asiento')) asientoIndex = index;
        });

        if (asientoIndex === -1) {
            for (let i = headers.length - 1; i >= 0; i--) {
                const headerStr = String(headers[i] || '').toLowerCase().trim();
                if (headerStr.includes('nro') && !headerStr.includes('doc')) {
                    asientoIndex = i;
                    break;
                }
            }
        }

        if (debeIndex === -1 || haberIndex === -1) {
            const numericColumns = this._findNumericColumns(dataRows, headers.length);
            if (numericColumns.length >= 2 && debeIndex === -1) debeIndex = numericColumns[0].index;
            if (numericColumns.length >= 2 && haberIndex === -1) haberIndex = numericColumns[1].index;
        }

        return { debeIndex, haberIndex, asientoIndex, fechaIndex };
    },

    _findNumericColumns(dataRows, totalColumns) {
        const sampleRows = dataRows.slice(0, 10);
        const columnStats = [];

        for (let col = 0; col < totalColumns; col++) {
            let numericCount = 0;
            let totalCount = 0;
            let hasLargeNumbers = false;

            sampleRows.forEach(row => {
                if (row && row[col] !== '' && row[col] !== null && row[col] !== undefined) {
                    totalCount++;
                    const value = parseFloat(String(row[col]).replace(/[^\d.-]/g, ''));
                    if (!isNaN(value)) {
                        numericCount++;
                        if (Math.abs(value) > 1000) hasLargeNumbers = true;
                    }
                }
            });

            const numericPercent = totalCount > 0 ? (numericCount / totalCount) * 100 : 0;
            columnStats.push({ index: col, numericPercent, hasLargeNumbers, totalCount, numericCount });
        }

        return columnStats
            .filter(stat => stat.numericPercent > 50 && stat.hasLargeNumbers)
            .sort((a, b) => b.numericPercent - a.numericPercent);
    },

    groupByAsiento(dataRows, indices) {
        const grupos = {};

        dataRows.forEach((row, index) => {
            if (!this.hasValidData(row, indices)) return;

            let asientoNum = this._getAsientoNumber(row, indices.asientoIndex);

            if (!grupos[asientoNum]) grupos[asientoNum] = [];
            grupos[asientoNum].push({ data: row, originalRow: index + 2 });
        });

        return grupos;
    },

    _getAsientoNumber(row, asientoIndex) {
        if (asientoIndex === -1) return 1;

        const asiento = row[asientoIndex];
        if (asiento !== undefined && asiento !== null && asiento !== '') {
            const parsed = parseInt(String(asiento).trim());
            if (!isNaN(parsed) && parsed > 0) return parsed;
        }

        return 1;
    },

    hasValidData(row, indices) {
        const cuentaContable = row && row[0] && String(row[0]).trim() !== '';
        const tieneDebe = row && row[indices.debeIndex] !== null &&
            row[indices.debeIndex] !== undefined &&
            String(row[indices.debeIndex]).trim() !== '';
        const tieneHaber = row && row[indices.haberIndex] !== null &&
            row[indices.haberIndex] !== undefined &&
            String(row[indices.haberIndex]).trim() !== '';

        return cuentaContable || tieneDebe || tieneHaber;
    },

    _processWithoutGrouping(dataRows, headers) {
        return {
            headers,
            rows: dataRows.map((row, index) => ({
                values: row.map(cell => cell !== null && cell !== undefined ? cell : ''),
                isTotal: false,
                originalRow: index + 2
            }))
        };
    },

    processSingleGroup(dataRows, indices, headers) {
        const result = [];

        dataRows.forEach((row, index) => {
            if (!this.hasValidData(row, indices)) return;
            const formattedRow = this.formatRow(row, indices);
            result.push({ values: formattedRow, isTotal: false, originalRow: index + 2 });
        });

        if (result.length > 0) {
            const totalRow = this.calculateTotalRow(
                dataRows.filter(row => this.hasValidData(row, indices)),
                indices.debeIndex,
                indices.haberIndex,
                headers.length
            );
            result.push({ values: totalRow, isTotal: true });
        }

        return { headers, rows: result };
    },

    processMultipleGroups(grupos, indices, headers) {
        const asientosOrdenados = Object.keys(grupos)
            .map(key => parseInt(key))
            .filter(num => !isNaN(num))
            .sort((a, b) => a - b);

        const result = [];

        asientosOrdenados.forEach((asientoOriginal, secuencialIndex) => {
            const filas = grupos[asientoOriginal];
            const asientoSecuencial = secuencialIndex + 1;

            filas.forEach(fila => {
                const formattedRow = this.formatRow(fila.data, indices);
                if (indices.asientoIndex !== -1) formattedRow[indices.asientoIndex] = asientoSecuencial;
                result.push({ values: formattedRow, isTotal: false, originalRow: fila.originalRow });
            });

            const totalRow = this.calculateTotalRow(
                filas.map(f => f.data),
                indices.debeIndex,
                indices.haberIndex,
                headers.length
            );

            if (indices.asientoIndex !== -1) totalRow[indices.asientoIndex] = asientoSecuencial;
            result.push({ values: totalRow, isTotal: true });
        });

        return { headers, rows: result };
    },

    formatRow(row, indices) {
        return row.map((cell, index) => {
            if (cell === null || cell === undefined) return '';
            if (index === indices.fechaIndex) return Utils.formatExcelDate(cell);
            if (index === indices.debeIndex || index === indices.haberIndex) {
                if (!isNaN(parseFloat(cell))) return Utils.formatNumber(cell);
            }
            return String(cell);
        });
    },

    calculateTotalRow(groupRows, debeIndex, haberIndex, totalHeaderCount) {
        let totalDebe = 0;
        let totalHaber = 0;

        groupRows.forEach(row => {
            const debeStr = row[debeIndex] || '';
            const haberStr = row[haberIndex] || '';
            const debeValue = parseFloat(debeStr.toString().replace(/\./g, '').replace(/[^\d.-]/g, '')) || 0;
            const haberValue = parseFloat(haberStr.toString().replace(/\./g, '').replace(/[^\d.-]/g, '')) || 0;
            totalDebe += debeValue;
            totalHaber += haberValue;
        });

        const totalRow = Array(totalHeaderCount).fill('');
        totalRow[0] = 'TOTAL';
        totalRow[debeIndex] = totalDebe > 0 ? Utils.formatNumber(totalDebe) : '';
        totalRow[haberIndex] = totalHaber > 0 ? Utils.formatNumber(totalHaber) : '';
        return totalRow;
    }
};

// ============================================================================
// VISTA PREVIA (continuará en siguiente mensaje por límite de caracteres)
// ============================================================================

const Preview = {
    show(file) {
        console.log('🎯 Preview.show() llamado con archivo:', file.name);

        const previewSection = document.querySelector('.preview-section');
        if (!previewSection) {
            console.error('❌ No se encontró .preview-section en el DOM');
            return;
        }

        console.log('✅ preview-section encontrado, mostrando...');
        previewSection.style.display = 'block';
        previewSection.classList.add('expanded');
        previewSection.innerHTML = `
            <div class="loading-preview">
                <div class="loading-spinner"></div>
                <p>Procesando archivo...</p>
            </div>
        `;

        const reader = new FileReader();
        reader.onload = (e) => {
            console.log('📖 Archivo leído, procesando...');
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                if (!workbook.SheetNames.length) {
                    console.error('❌ El archivo no contiene hojas');
                    previewSection.innerHTML = '<p style="color: red;">Error: El archivo no contiene hojas.</p>';
                    return;
                }

                console.log('📊 Workbook cargado, hojas:', workbook.SheetNames);
                const worksheet = this._findWorksheet(workbook);
                const range = XLSX.utils.decode_range(worksheet['!ref']);
                const jsonDataRaw = XLSX.utils.sheet_to_json(worksheet, {
                    header: 1,
                    raw: true,
                    defval: '',
                    range: range
                });

                if (jsonDataRaw.length === 0) {
                    console.error('❌ El archivo está vacío');
                    previewSection.innerHTML = '<p style="color: red;">Error: El archivo está vacío.</p>';
                    return;
                }

                console.log('✅ Datos extraídos:', jsonDataRaw.length, 'filas');
                const processedData = ExcelProcessor.processExcelData(jsonDataRaw);
                console.log('✅ Datos procesados:', processedData.rows.length, 'filas');
                this.displayTable(processedData);
                console.log('✅ Tabla mostrada');
                Validator.validateWithBackend(jsonDataRaw);

            } catch (error) {
                console.error('❌ Error al procesar Excel:', error);
                previewSection.innerHTML = `<p style="color: red;">Error al procesar el archivo: ${error.message}</p>`;
            }
        };

        reader.onerror = () => {
            console.error('❌ Error al leer el archivo');
            previewSection.innerHTML = '<p style="color: red;">Error al leer el archivo.</p>';
        };

        console.log('📂 Iniciando lectura del archivo...');
        reader.readAsArrayBuffer(file);
    },

    _findWorksheet(workbook) {
        const targetSheet = workbook.SheetNames.find(name =>
            name.toLowerCase().includes('detalle') ||
            name.toLowerCase().includes('comprobante')
        );
        return targetSheet ? workbook.Sheets[targetSheet] : workbook.Sheets[workbook.SheetNames[0]];
    },

    displayTable(data) {
        console.log('📋 displayTable() llamado con:', data.rows.length, 'filas');

        if (!data || !data.rows || data.rows.length === 0) {
            console.warn('⚠️ No hay datos para mostrar');
            document.querySelector('.preview-section').innerHTML = '<p>No se encontraron datos para mostrar.</p>';
            return;
        }

        console.log('🔨 Construyendo HTML de la tabla...');
        const tableHTML = this._buildTableHTML(data);
        const previewSection = document.querySelector('.preview-section');

        if (!previewSection) {
            console.error('❌ No se encontró .preview-section');
            return;
        }

        console.log('✅ Insertando HTML en .preview-section');
        previewSection.innerHTML = tableHTML;
        console.log('🎨 Ajustando estilos del modal...');
        this._adjustModalStyles();
        console.log('✅ Tabla mostrada correctamente');
    },

    _buildTableHTML(data) {
        let html = `
            <div class="preview-header">
                <div style="flex: 1;">
                    <h3 class="preview-title">Vista Previa de Datos</h3>
                    <div class="preview-info">Mostrando ${data.rows.length} filas</div>
                </div>
                <div class="preview-buttons">
                    <button type="button" class="btn btn-secondary btn-cancel-preview">Cancelar</button>
                    <button type="button" class="btn btn-primary btn-import-confirm">Importar Datos</button>
                </div>
            </div>
            <div class="preview-table-container">
                <table class="preview-table">
                    <thead><tr><th style="width: 60px;">Fila</th>`;

        data.headers.forEach(header => {
            html += `<th>${Utils.escapeHtml(String(header))}</th>`;
        });

        html += `</tr></thead><tbody>`;

        data.rows.forEach((row) => {
            const isTotal = row.isTotal;
            const originalRow = row.originalRow || 0;
            const rowClass = isTotal ? 'total-row' : '';
            const dataAttr = isTotal ? '' : `data-original-row="${originalRow}"`;

            html += `<tr class="${rowClass}" ${dataAttr}>`;
            html += `<td>${isTotal ? '-' : originalRow}</td>`;

            const values = row.values || row || [];
            values.forEach(value => {
                const displayValue = value !== undefined && value !== null
                    ? Utils.escapeHtml(String(value))
                    : '';
                html += `<td>${displayValue}</td>`;
            });

            html += `</tr>`;
        });

        html += `</tbody></table></div>`;
        return html;
    },

    _adjustModalStyles() {
        setTimeout(() => {
            const dialog = document.querySelector('.ui-dialog');
            const dialogContent = document.querySelector('.ui-dialog-content');
            const tableContainer = document.querySelector('.preview-table-container');

            if (dialog) {
                dialog.style.maxHeight = 'none';
                dialog.style.height = 'auto';
            }
            if (dialogContent) {
                dialogContent.style.maxHeight = 'none';
                dialogContent.style.overflowY = 'visible';
                dialogContent.style.padding = '10px';
            }
            if (tableContainer) {
                tableContainer.style.maxHeight = '500px';
                tableContainer.style.overflowY = 'auto';
            }
        }, 100);
    },

    hide() {
        const fileInput = document.querySelector('input[name="upload[attachment]"]');
        const fileStatus = document.querySelector('.file-status');
        const previewSection = document.querySelector('.preview-section');
        const stepSection = document.querySelector('.step-section:first-of-type');

        fileInput.value = '';
        fileStatus.textContent = 'Sin archivos seleccionados';
        previewSection.style.display = 'none';
        previewSection.classList.remove('expanded');
        Utils.slideDown(stepSection);
        this._restoreModalStyles();
    },

    _restoreModalStyles() {
        const dialog = document.querySelector('.ui-dialog');
        const dialogContent = document.querySelector('.ui-dialog-content');

        if (dialog) {
            dialog.style.maxHeight = '';
            dialog.style.height = '';
        }
        if (dialogContent) {
            dialogContent.style.maxHeight = '';
            dialogContent.style.overflowY = '';
            dialogContent.style.padding = '';
        }
    }
};

// ============================================================================
// VALIDACIÓN CON BACKEND
// ============================================================================

const Validator = {
    async validateWithBackend(jsonData) {
        const templateType = this._getTemplateType();

        if (templateType === 'apertura') {
            this._showAperturaReadyStatus(jsonData.length - 1);
            return;
        }

        if (AppState.validationInProgress) {
            console.log('⚠️ Validación ya en progreso');
            return;
        }

        AppState.validationInProgress = true;
        this._showValidatingStatus();

        try {
            const response = await this._sendValidationRequest(jsonData);
            this._handleValidationResponse(response, jsonData.length - 1);
        } catch (error) {
            console.error('❌ Error en validación:', error);
            this._handleValidationError(error);
        } finally {
            AppState.validationInProgress = false;
        }
    },

    _getTemplateType() {
        return document.querySelector('input[name="template_type"]:checked')?.value || 'normal';
    },

    _showAperturaReadyStatus(rowCount) {
        const previewInfo = document.querySelector('.preview-info');
        previewInfo.innerHTML = `
            <span style="color: #17a2b8;">
                <i class="fa fa-info-circle"></i> 
                Modo apertura: Listo para importar (${rowCount} filas)
            </span>
        `;

        const importBtn = document.querySelector('.btn-import-confirm');
        importBtn.disabled = false;
        importBtn.textContent = 'Importar Datos';
    },

    _showValidatingStatus() {
        const previewInfo = document.querySelector('.preview-info');
        previewInfo.innerHTML = `
            <span style="color: #007bff;">
                <i class="fa fa-spinner fa-spin"></i> 
                Validando datos con el servidor...
            </span>
        `;

        const importBtn = document.querySelector('.btn-import-confirm');
        importBtn.disabled = true;
        importBtn.textContent = 'Validando...';
    },

    async _sendValidationRequest(jsonData) {
        const fileInput = document.querySelector('input[name="upload[attachment]"]');
        const file = fileInput.files[0];

        if (!file) throw new Error('No se ha seleccionado ningún archivo');

        const formData = new FormData();
        formData.append('upload[attachment]', file);
        formData.append('sid', Utils.getSid());
        formData.append('validate_only', 'true');

        const sheetId = AppState.sheetId || document.querySelector('section.sheet')?.dataset.id || '';
        const url = `${AppState.nodeUrl}/import-seats?hostname=${window.location.origin}&id=${sheetId}&sid=${encodeURIComponent(Utils.getSid())}`;

        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    },

    _handleValidationResponse(response, rowCount) {
        const previewInfo = document.querySelector('.preview-info');
        const importBtn = document.querySelector('.btn-import-confirm');

        if (response.success) {
            if (response.errorMsg && response.errorMsg.trim()) {
                const errors = response.errorMsg.split('SL').filter(e => e.trim());
                this._showValidationErrors(errors);
            } else {
                previewInfo.innerHTML = `
                    <span style="color: #28a745;">
                        <i class="fa fa-check-circle"></i> 
                        Validación exitosa - ${response.validated || rowCount} filas listas para importar
                    </span>
                `;
                importBtn.disabled = false;
                importBtn.textContent = 'Importar Datos';
                const errorBtn = document.querySelector('.btn-view-errors');
                if (errorBtn) errorBtn.remove();
            }
        } else {
            if (response.errorMsg) {
                const errors = response.errorMsg.split('SL').filter(e => e.trim());
                this._showValidationErrors(errors);
            } else {
                this._showGenericValidationError();
            }
        }
    },

    _showValidationErrors(errors) {
        const previewInfo = document.querySelector('.preview-info');
        previewInfo.innerHTML = `
            <span style="color: #dc3545;">
                <i class="fa fa-exclamation-triangle"></i> 
                Se encontraron ${errors.length} errores
            </span>
        `;

        const importBtn = document.querySelector('.btn-import-confirm');
        importBtn.disabled = true;
        importBtn.textContent = 'Corregir Errores';
        this._addViewErrorsButton(errors);
    },

    _showGenericValidationError() {
        const previewInfo = document.querySelector('.preview-info');
        previewInfo.innerHTML = `
            <span style="color: #dc3545;">
                <i class="fa fa-exclamation-triangle"></i> 
                Error en la validación
            </span>
        `;

        const importBtn = document.querySelector('.btn-import-confirm');
        importBtn.disabled = true;
        importBtn.textContent = 'Error de Validación';
    },

    _addViewErrorsButton(errors) {
        const existingBtn = document.querySelector('.btn-view-errors');
        if (existingBtn) existingBtn.remove();

        const buttonHTML = `
            <button type="button" class="btn btn-warning btn-view-errors" style="margin-left: 10px;">
                <i class="fa fa-exclamation-triangle"></i> 
                Visualizar Errores (${errors.length})
            </button>
        `;

        document.querySelector('.preview-buttons').insertAdjacentHTML('beforeend', buttonHTML);
        AppState.currentValidationErrors = { errors };
    },

    _handleValidationError(error) {
        console.error('Error de validación:', error);
        const previewInfo = document.querySelector('.preview-info');
        previewInfo.innerHTML = `
            <span style="color: #dc3545;">
                <i class="fa fa-exclamation-triangle"></i> 
                Error al validar con el servidor: ${error.message}
            </span>
        `;

        const importBtn = document.querySelector('.btn-import-confirm');
        importBtn.disabled = true;
        importBtn.textContent = 'Error de Validación';
    }
};

// ============================================================================
// IMPORTACIÓN
// ============================================================================

const Importer = {
    async execute(element, append = false) {
        if (AppState.isProcessing) {
            console.log('⚠️ Importación ya en progreso');
            return;
        }

        AppState.isProcessing = true;
        const btn = element;
        btn.disabled = true;
        btn.textContent = 'Importando...';
        const templateType = this._getTemplateType();
        
        if (templateType === 'apertura') {
            AppState.pendingImport = { element, append };
            DateModal.open();
            AppState.isProcessing = false;
            btn.disabled = false;
            btn.textContent = 'Importar Datos';
            return;
        }

        await this.performImport(element, append, null);
    },

    async performImport(element, append, aperturaDate) {
        const templateType = this._getTemplateType();
        const fileInput = document.querySelector('input[name="upload[attachment]"]');
        const file = fileInput.files[0];

        if (!file) {
            Utils.showToast('Falta seleccionar archivo excel.', 'error');
            AppState.isProcessing = false;
            return;
        }

        Utils.blockUI();

        try {
            const formData = this._buildFormData(file, aperturaDate);
            const response = await this._sendImportRequest(formData, templateType);
            this._handleImportResponse(response, templateType, element);
        } catch (error) {
            console.error('❌ Error en importación:', error);
            this._handleImportError(error, element);
        } finally {
            Utils.unblockUI();
            AppState.isProcessing = false;
        }
    },

    _getTemplateType() {
        return document.querySelector('input[name="template_type"]:checked')?.value || 'normal';
    },

    _buildFormData(file, aperturaDate) {
        const formData = new FormData();
        formData.append('upload[attachment]', file);
        formData.append('sid', Utils.getSid());
        if (aperturaDate) formData.append('apertura_date', aperturaDate);
        return formData;
    },

    async _sendImportRequest(formData, templateType) {
        const sheetId = AppState.sheetId || document.querySelector('section.sheet')?.dataset.id || '';
        const url = `${AppState.nodeUrl}/import-seats?hostname=${window.location.origin}&id=${sheetId}&sid=${encodeURIComponent(Utils.getSid())}&tipo=${templateType}`;

        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    },

    _handleImportResponse(response, templateType, element) {
        if (templateType === 'apertura') {
            this._handleAperturaResponse(response);
        } else {
            this._handleNormalResponse(response);
        }

        if (typeof unaBase !== 'undefined' && unaBase.toolbox && unaBase.toolbox.search) {
            setTimeout(() => {
                unaBase.toolbox.search.save();
                unaBase.toolbox.search.restore();
            }, 1000);
        }

        this._cleanupAfterImport(element);
    },

    _handleAperturaResponse(response) {
        if (response.success) {
            let message = 'Asientos de apertura importados exitosamente!';
            if (response.checkApertura !== undefined) {
                message += response.checkApertura ? ' (Apertura cuadrada)' : ' (Verificar cuadre)';
            }
            Utils.showToast(message, 'success');

            if (response.errors && response.errors.length > 0) {
                const errorMsg = response.errors.join('<br>');
                alert(`<span style='font-weight:bold;'>Errores encontrados:</span><br><br>${errorMsg}`);
            }
        } else {
            this._handleImportFailure(response, 'apertura');
        }
    },

    _handleNormalResponse(response) {
        if (response.success) {
            if (response.seats && response.seats.length > 0) {
                Modal.showImportedSeats(response.seats);
            } else {
                Utils.showToast('Comprobantes importados exitosamente!', 'success');
            }
        } else {
            this._handleImportFailure(response, 'normal');
        }
    },

    _handleImportFailure(response, tipo) {
        Utils.showToast('No fue posible importar la información!', 'error');

        let errorMsg = '';
        if (response.errors && response.errors.length > 0) {
            errorMsg = response.errors.join('<br>');
        } else if (response.errorMsg) {
            errorMsg = response.errorMsg.replace(/SL/g, '<br>');
        } else if (response.message) {
            errorMsg = response.message;
        } else {
            errorMsg = 'Error desconocido';
        }

        alert(`<span style='font-weight:bold;'>Error:</span><br><br>${errorMsg}<br><span style='font-weight:bold;'>Verifica tu excel y vuelve a intentar.</span>`);
    },

    _handleImportError(error, element) {
        let errorMessage = 'No fue posible realizar la carga de los datos debido a un problema con el servidor. Por favor intente nuevamente.';
        if (error.message) errorMessage = error.message;

        Utils.showToast(errorMessage + ' <p><small>Si el inconveniente persiste, por favor comuníquese con Soporte@una.cl.</small></p>', 'error');
        element.disabled = false;
        element.textContent = 'Importar Datos';
    },

    _cleanupAfterImport(element) {
        setTimeout(() => {
            Preview.hide();
            element.disabled = false;
            element.textContent = 'Importar Datos';
        }, 2000);
    }
};

// ============================================================================
// MODAL DE FECHA PARA APERTURA
// ============================================================================

const DateModal = {
    open: () => {
        const modal = document.getElementById('dateModal');
        const dateInput = document.getElementById('aperturaDate');
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        modal.classList.add('show');
    },

    close: () => {
        const modal = document.getElementById('dateModal');
        modal.classList.remove('show');
        AppState.pendingImport = null;
    },

    confirmAndImport: () => {
        
        const dateInput = document.getElementById('aperturaDate');
        const selectedDate = dateInput.value; // "YYYY-MM-DD"

        const selectedDateDMY = selectedDate
            ? selectedDate.split('-').reverse().join('-') // "DD-MM-YYYY"
            : "";


        if (!selectedDate) {
            alert('Por favor selecciona una fecha.');
            return;
        }



        if (AppState.pendingImport) {
            const { element, append } = AppState.pendingImport;
            AppState.isProcessing = true;
            element.disabled = true;
            element.textContent = 'Importando...';
            Importer.performImport(element, append, selectedDateDMY);
            AppState.pendingImport = null;
        }

        DateModal.close();
    }
};

// ============================================================================
// GESTOR DE PLANTILLAS
// ============================================================================

const TemplateManager = {
    download: () => {
        const templateType = document.querySelector('input[name="template_type"]:checked')?.value || 'normal';
        const sid = Utils.getSid();
        const url = `${AppState.nodeUrl}/export-template-seats-import/?sid=${encodeURIComponent(sid)}&hostname=${window.location.origin}&tipo=${templateType}`;

        const download = window.open(url);
        if (download) {
            download.blur();
            window.focus();
            setTimeout(() => download.close(), 1000);
        }
    },

    updateInstructions: (templateType) => {
        const instructions = document.querySelector('.instructions');

        if (templateType === 'apertura') {
            instructions.innerHTML = 'Para importar asientos de apertura, descarga la plantilla Excel y completa los datos. El formato es: Cuenta contable, Debe, Haber, RUT/Auxiliar, y campos adicionales. Una vez completada, vuelva aquí y cargue el archivo Excel utilizando el siguiente formulario (paso 2). <strong>Se solicitará la fecha de apertura antes de importar.</strong>';
        } else {
            instructions.innerHTML = 'Una vez descargada la plantilla Excel, puede reemplazar los datos de prueba con los definitivos. Para cargar y crear gastos, vuelva aquí y cargue el archivo Excel utilizando el siguiente formulario (paso 2).';
        }
    }
};

// ============================================================================
// INICIALIZACIÓN - SIN DOMContentLoaded
// ============================================================================

console.log('🚀 Inicializando sistema de importación...');

// Obtener ID de la hoja si existe
const sheetElement = document.querySelector('section.sheet');
if (sheetElement) {
    AppState.sheetId = sheetElement.dataset.id;
}

// Inicializar unaBase si existe
if (typeof unaBase !== 'undefined' && unaBase.toolbox) {
    unaBase.toolbox.init();
}

// ============================================================================
// EVENT LISTENERS - Usando arrow functions y delegación de eventos
// ============================================================================

// Botón de descarga
const downloadBtn = document.querySelector('.btn-download');
if (downloadBtn) {
    downloadBtn.addEventListener('click', () => TemplateManager.download());
}

// Cambio de tipo de plantilla
document.querySelectorAll('input[name="template_type"]').forEach(radio => {
    radio.addEventListener('change', (e) => TemplateManager.updateInstructions(e.target.value));
});

// Selección de archivo
const fileInput = document.querySelector('input[name="upload[attachment]"]');
if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        console.log('📁 Archivo seleccionado, evento change disparado');

        if (AppState.isProcessing) {
            console.log('⚠️ Ya hay un proceso en curso');
            return;
        }

        const file = e.target.files[0];
        const fileStatus = document.querySelector('.file-status');

        if (file) {
            console.log('✅ Archivo válido:', file.name);
            AppState.isProcessing = true;
            fileStatus.textContent = 'Archivo seleccionado: ' + file.name;
            AppState.currentFile = file;

            const stepSection = document.querySelector('.step-section:first-of-type');
            if (stepSection) Utils.slideUp(stepSection);

            console.log('🔄 Iniciando vista previa...');
            Preview.show(file);
            setTimeout(() => { AppState.isProcessing = false; }, 1000);
        } else {
            console.log('❌ No hay archivo seleccionado');
            fileStatus.textContent = 'Sin archivos seleccionados';
            const previewSection = document.querySelector('.preview-section');
            if (previewSection) {
                previewSection.style.display = 'none';
                previewSection.classList.remove('expanded');
            }
        }
    });
} else {
    console.error('❌ No se encontró el input de archivo');
}

// Delegación de eventos para botones dinámicos
document.addEventListener('click', (e) => {
    // Botón cancelar vista previa
    if (e.target.closest('.btn-cancel-preview')) {
        if (AppState.isProcessing) return;
        AppState.isProcessing = true;
        Preview.hide();
        setTimeout(() => { AppState.isProcessing = false; }, 500);
    }

    // Botón importar
    if (e.target.closest('.btn-import-confirm')) {
        const btn = e.target.closest('.btn-import-confirm');
        if (AppState.isProcessing || btn.disabled) return;
        Importer.execute(btn, false);
    }

    // Botón ver errores
    if (e.target.closest('.btn-view-errors')) {
        if (AppState.currentValidationErrors) {
            Modal.showErrors(AppState.currentValidationErrors.errors);
        }
    }
});

// Modal de fecha - event listeners con arrow functions
const dateModal = document.getElementById('dateModal');
const closeDateModalBtn = document.getElementById('closeDateModalBtn');
const cancelDateModalBtn = document.getElementById('cancelDateModalBtn');
const confirmDateBtn = document.getElementById('confirmDateBtn');

if (dateModal) {
    // Cerrar al hacer clic fuera
    dateModal.addEventListener('click', (e) => {
        if (e.target.id === 'dateModal') DateModal.close();
    });
}

if (closeDateModalBtn) {
    closeDateModalBtn.addEventListener('click', () => DateModal.close());
}

if (cancelDateModalBtn) {
    cancelDateModalBtn.addEventListener('click', () => DateModal.close());
}

if (confirmDateBtn) {
    confirmDateBtn.addEventListener('click', () => DateModal.confirmAndImport());
}

console.log('✅ Sistema inicializado correctamente');