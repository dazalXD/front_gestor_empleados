    <template>
        <div class="view-layout">
            <Sidebar />
            <div class="page-container">
                <h1 class="main-page-title">Documentos PDF</h1>
                <p class="subtitle">Administra y genera documentos PDF para los usuarios.</p>

                <div class="content-wrapper">

                    <div class="left-panel">
                        <div class="card form-card">
                            <h2 class="form-title">Registrar Documento</h2>

                            <form @submit.prevent="registerDocument">

                                <div class="form-group">
                                    <label for="doc-name">Nombre</label>
                                    <input v-model="form.name" id="doc-name" type="text" placeholder="Carlos Ramírez"
                                        required>
                                </div>

                                <div class="form-group">
                                    <label for="doc-contract">Contrato</label>
                                    <select v-model="form.contract" id="doc-contract" required>
                                        <option value="Contrato A">Contrato A</option>
                                        <option value="Contrato B">Contrato B</option>
                                        <option value="Contrato C">Contrato C</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="doc-balance">Saldos ($)</label>
                                    <input v-model.number="form.balance" id="doc-balance" type="number" step="0.01"
                                        placeholder="1500.00" required>
                                </div>

                                <div class="form-group">
                                    <label for="doc-date">Fecha</label>
                                    <input v-model="form.date" id="doc-date" type="date" required>
                                </div>

                                <div class="form-group">
                                    <label for="doc-phone">Teléfono</label>
                                    <input v-model="form.phone" id="doc-phone" type="tel" placeholder="555-123-4567"
                                        required>
                                </div>

                                <button type="submit" class="btn-primary">
                                    <i class="icon-save"></i> Guardar Documento
                                </button>
                            </form>
                        </div>
                    </div>

                    <div class="right-panel">
                        <div class="card table-card">

                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th><input type="checkbox" @change="toggleAllSelection" :checked="allSelected">
                                        </th>
                                        <th>NOMBRE</th>
                                        <th>CONTRATO</th>
                                        <th>SALDOS</th>
                                        <th>FECHA</th>
                                        <th>TELÉFONO</th>
                                        <th>ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="documents.length === 0">
                                        <td colspan="4" style="text-align: center; color: #666;">Cargando registros o no
                                            hay
                                            datos...</td>
                                    </tr>
                                    <tr v-for="(doc, index) in documents" :key="index">
                                        <td><input type="checkbox" v-model="doc.selected"></td>
                                        <td>{{ doc.name }}</td>
                                        <td>{{ doc.contract }}</td>
                                        <td>{{ formatCurrency(doc.balance) }}</td>
                                        <td>{{ formatDate(doc.date) }}</td>
                                        <td>{{ doc.phone }}</td>
                                        <td class="actions-cell">
                                            <a href="#" @click.prevent="editDocument(doc)"
                                                class="action-link edit-link">Editar</a>
                                            <a href="#" @click.prevent="deleteRegister(doc.id)"
                                                class="action-link delete-link">Eliminar</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="table-footer">
                            <p class="results-text">
                                Mostrando 1-{{ documents.length }} de {{ totalResults }} resultados
                            </p>
                            <div>
                                <button class="btn-primary" :disabled="selectedDocumentsCount === 0"
                                    @click="generatePDF">
                                    Generar PDF (seleccionados)
                                </button>
                                <!-- <button class="btn-secondary" @click="downloadZIP">Descargar ZIP</button> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>

<script>
import Sidebar from '../components/Sidebar.vue'
import api from '../services/api.js'

export default {
    components: { Sidebar },
    data() {
        return {
            // 1. Datos del Formulario de Registro
            form: {
                name: '',
                contract: 'Contrato A',
                balance: null,
                date: new Date().toISOString().slice(0, 10), // Fecha actual
                phone: ''
            },
            // 2. Datos de la Tabla (Documentos)
            documents: [],
            totalResults: 10, // Simulación de paginación
            isEditing: false,
            editingIndex: -1
        }
    },
    mounted() {
        this.getDocuments()
    },
    computed: {
        allSelected: {
            get() {
                // True si todos están seleccionados
                return this.documents.every(doc => doc.selected);
            },
            set(value) {
                // Aplica la selección a todos
                this.documents.forEach(doc => doc.selected = value);
            }
        },
        selectedDocumentsCount() {
            return this.documents.filter(doc => doc.selected).length;
        }
    },
    methods: {
        async getDocuments() {
            try {
                const response = await api.get('/documents');
                this.documents = response.data.map(doc => ({ ...doc, selected: false }));

            } catch (error) {
                console.error('Error al obtener documentos:', error);
                this.documents = [];
            }
        },
        async deleteRegister(id) {
            const agree = confirm('¿Estás seguro de que quieres eliminar este documento?');
            try {
                if (!agree) return;
                await api.delete(`/documents/${id}`);
                this.getDocuments(); // Refrescar la lista
            } catch (error) {
                console.error('Error al eliminar documento:', error);
            }
        },
        formatCurrency(value) {
            // Formatea el saldo como $X,XXX
            return '$' + new Intl.NumberFormat('es-MX', {
                minimumFractionDigits: 0
            }).format(value);
        },
        formatDate(dateStr) {
            // Formato YYYY-MM-DD
            if (!dateStr) return '';
            const date = new Date(dateStr);
            return date.toISOString().slice(0, 10);
        },
        toggleAllSelection(event) {
            this.allSelected = event.target.checked;
        },

        async registerDocument() {
            try {
                if (!this.isEditing) {
                    await api.post('/documents', this.form);
                    this.getDocuments();
                } else {
                    await api.put(`/documents/${this.form.id}`, this.form);
                    this.getDocuments();
                }

            } catch (error) {
                alert('Error al registrar documento');
                console.error('Error al registrar documento:', error);
                return;
            }




            // if (this.isEditing) {
            //     // Lógica de edición
            //     this.documents[this.editingIndex] = { ...this.form, selected: false };
            //     console.log('Documento Editado:', this.form);
            // } else {
            //     // Lógica de añadir (simulación)
            //     const newDoc = { ...this.form, selected: false };
            //     this.documents.push(newDoc);
            //     console.log('Documento Registrado:', newDoc);
            // }

            // 2. Resetear Formulario
            this.form = {
                name: '',
                contract: 'Contrato A',
                balance: null,
                date: new Date().toISOString().slice(0, 10),
                phone: ''
            };
            this.isEditing = false;
            this.editingIndex = -1;
        },
        editDocument(doc) {
            // Cargar datos del documento en el formulario para editar
            this.isEditing = true;
            this.editingIndex = this.documents.findIndex(d => d === doc);
            this.form = { ...doc };
        },
        // Aquí irían los métodos para Generar PDF y Descargar ZIP
        async generatePDF() {
            try {
                if (this.selectedDocumentsCount === 0) {
                    alert('Por favor, selecciona al menos un documento para generar el PDF.');
                    return;
                }
                // Lógica para generar PDF con los documentos seleccionados
                const selectedDocs = this.documents.filter(doc => doc.selected);
                const docIds = selectedDocs.map(doc => doc.id);

                if (docIds.length > 1) {
                    const response = await api.post('/documents/pdf', { ids: docIds }, { responseType: 'blob' });
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'documents.zip'); // nombre del archivo
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                } else {
                    const response = await api.get(`/documents/pdf/${docIds}`, { responseType: 'blob' });
                    const disposition = response.headers['content-disposition'];
                    
                    let filename = 'file.pdf'; // fallback
                    if (disposition && disposition.indexOf('filename=') !== -1) {
                        const matches = disposition.match(/filename="?(.*)"?/);
                        if (matches.length > 1) filename = matches[1];
                    }
                    // Crear un enlace temporal
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', filename); // nombre del archivo
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                }

            } catch (error) {
                console.error('Error descargando ZIP:', error);
            }


            const selected = this.documents.filter(doc => doc.selected);
            console.log('Generando PDF para:', selected);
        },
        // downloadZIP() {
        //     console.log('Descargando ZIP...');
        // }
    }
};
</script>

<style scoped>
/* 1. LAYOUT Y ESTRUCTURA GENERAL */
.page-container {
    padding: 20px 40px;
    background-color: #f0f3f6;
    min-height: 100vh;
}

.main-page-title {
    color: #333;
    font-size: 1.8rem;
    margin-bottom: 5px;
    font-weight: 600;
}

.subtitle {
    color: #666;
    font-size: 1rem;
    margin-bottom: 30px;
}

.content-wrapper {
    display: flex;
    gap: 30px;
}

.left-panel {
    flex: 0 0 350px;
    /* Ancho fijo para el formulario */
}

.right-panel {
    flex-grow: 1;
    /* Ocupa el espacio restante (tabla) */
}

/* Estilo de la "tarjeta" general para los paneles */
.card {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    padding: 20px;
}

/* 2. ESTILOS DEL FORMULARIO */
.form-card {
    padding-bottom: 30px;
    /* Más espacio al fondo */
}

.form-card .form-title {
    font-size: 1.4rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 25px 0;
    text-align: center;
}

.form-group {
    margin-bottom: 18px;
}

.form-card label {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
    color: #333;
    font-size: 0.9rem;
}

.form-card input,
.form-card select {
    width: 100%;
    padding: 10px 12px;
    border-radius: 4px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    font-size: 1rem;
    color: #333;
    background-color: white;
}

.form-card input::placeholder {
    color: #aaa;
}

.form-card input:focus,
.form-card select:focus {
    border-color: #007bff;
    outline: none;
}

/* Botón principal del Formulario */
.btn-primary {
    width: 100%;
    padding: 12px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    margin-top: 15px;
    transition: background-color 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
}

.btn-primary:hover:not(:disabled) {
    background: #0056b3;
}

.btn-primary:disabled {
    background: #a0c3e6;
    cursor: not-allowed;
}

/* Icono (Si usas Font Awesome o similar, si no, es un placeholder) */
.icon-save::before {
    content: "💾";
    /* Ejemplo con emoji */
    margin-right: 8px;
    font-size: 1.1em;
}

/* 3. ESTILOS DE LA TABLA */

.table-card {
    padding: 0;
    margin-bottom: 20px;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
}

.data-table thead {
    background-color: transparent;
    border-bottom: 2px solid #eee;
}

.data-table th {
    padding: 15px 12px;
    text-align: left;
    font-size: 0.8rem;
    color: #666;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
}

.data-table td {
    padding: 15px 12px;
    border-bottom: 1px solid #f0f0f0;
    color: #333;
    font-size: 0.95rem;
}

.data-table tr:last-child td {
    border-bottom: none;
}

/* Estilo para los checkboxes */
.data-table td input[type="checkbox"],
.data-table th input[type="checkbox"] {
    transform: scale(1.1);
    /* Hacerlos un poco más grandes */
    cursor: pointer;
    margin: 0;
}

/* 4. ESTILOS DE ACCIONES */
.actions-cell {
    white-space: nowrap;
}

.action-link {
    font-size: 0.95rem;
    text-decoration: none;
    margin-right: 15px;
    cursor: pointer;
    transition: color 0.2s;
}

.edit-link {
    color: #007bff;
}

.delete-link {
    color: #f5222d;
}

.edit-link:hover,
.delete-link:hover {
    text-decoration: underline;
}

/* 5. FOOTER DE LA TABLA (PAGINACIÓN Y BOTONES) */
.table-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
}

.results-text {
    color: #666;
    font-size: 0.9rem;
    margin: 0;
}

.btn-secondary {
    padding: 10px 15px;
    background: #e9ecef;
    /* Color gris claro */
    color: #495057;
    border: 1px solid #ced4da;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    margin-left: 10px;
    transition: background-color 0.2s;
}

.btn-secondary:hover {
    background: #d3d9df;
}

/* Ajuste de color para el botón de Generar PDF en el footer */
.table-footer .btn-primary {
    width: auto;
    margin-top: 0;
}
</style>