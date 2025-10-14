    <template>
        <div class="view-layout">
            <sidebar />
            <div class="page-container">
                <h1 class="main-page-title">Gestión de Usuarios</h1>
                <div class="content-wrapper">
                    <div class="left-panel">
                        <div class="card form-card">
                            <h2 class="form-title">Gestionar Usuario</h2>
                            <p class="form-subtitle">Añadir, editar o eliminar usuarios del sistema.</p>

                            <form @submit.prevent="handleFormSubmit">

                                <div class="form-group">
                                    <label for="form-user">Usuario</label>
                                    <input v-model="form.username" id="form-user" type="text"
                                        placeholder="p. ej., juan.perez" required>
                                </div>


                                <div v-if="!isEditing" class="form-group">
                                    <label for="form-password">Contraseña</label>
                                    <input v-model="form.password" id="form-password" type="password"
                                        placeholder="Introduzca una contraseña segura" required>
                                </div>

                                <div class="form-group">
                                    <label for="form-status">Estatus</label>
                                    <select v-model="form.status" id="form-status" required>
                                        <option value="activo">Activo</option>
                                        <option value="baja">Baja</option>
                                        <option value="cambiar_contraseña">Cambiar Contraseña</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="form-work-time">Horario de Trabajo</label>
                                    <label for="form-work-time-start">de: </label>
                                    <input v-model="form.workTimeStart" id="form-work-time-start" type="text"
                                        placeholder="p. ej., 9:00:00" required>
                                    <label for="form-work-time-end"> a: </label>
                                    <input v-model="form.workTimeEnd" id="form-work-time-end" type="text"
                                        placeholder="p. ej., 18:00:00" required>
                                </div>

                                <button type="submit" class="btn-primary" @click="createUser">
                                    <i class="icon-plus"></i> Añadir Usuario
                                </button>
                                <button v-if="isEditing" type="button" class="btn-primary" @click="cancelEdit"
                                    style="background: #6c757d; margin-top: 10px;">
                                    Cancelar Edición
                                </button>
                            </form>
                        </div>
                    </div>

                    <div class="right-panel">
                        <div class="card table-card">
                            <h2 class="table-title">Usuarios Existentes</h2>

                            <table class="users-table">
                                <thead>
                                    <tr>
                                        <th>USUARIO</th>
                                        <th>ESTATUS</th>
                                        <th>HORARIO DE TRABAJO</th>
                                        <th>ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="users.length === 0">
                                        <td colspan="4" style="text-align: center; color: #666;">Cargando usuarios o no
                                            hay
                                            datos...</td>
                                    </tr>

                                    <tr v-for="user in users" :key="user.username">
                                        <td>{{ user.username }}</td>
                                        <td>
                                            <span :class="getStatusBadgeClass(user.status)">
                                                {{ formatStatus(user.status) }}
                                            </span>
                                        </td>
                                        <td>{{ user.start_work }} - {{ user.end_work }}</td>
                                        <td class="actions-cell">
                                            <a href="#" @click.prevent="editUser(user)"
                                                class="action-link edit-link">Editar</a>
                                            <a href="#" @click.prevent="deleteUser(user.id)"
                                                class="action-link delete-link">Eliminar</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </template>

<script>
import api from '../services/api.js'
import Sidebar from '../components/Sidebar.vue'
export default {
    components: {
        Sidebar
    },
    data() {

        return {
            form: {
                username: '',
                status: 'activo', // Valor inicial para el dropdown
                workTimeStart: '',
                workTimeEnd: ''
            },
            users: [],
            isEditing: false,
            editingUserId: -1
        }
    },
    mounted() {
        // Descomenta esta línea para obtener datos reales al montar:
        this.fetchUsers()
    },
    methods: {
        cancelEdit() {
            this.isEditing = false
            this.editingUserId = -1
            this.cleanFormulary()
        },
        cleanFormulary() {
            this.form.username = ''
            this.form.password = ''
            this.form.status = 'activo'
            this.form.workTimeStart = ''
            this.form.workTimeEnd = ''
        },
        async fetchUsers() {
            try {
                const response = await api.get('/users')
                this.users = response.data
            } catch (error) {
                console.error('Error al cargar usuarios:', error)
            }
        },
        formatDate(dateStr) {
            const date = new Date(dateStr)
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
        },
        formatStatus(status) {
            // Capitaliza la primera letra para el display
            if (!status) return ''
            return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
        },
        getStatusBadgeClass(status) {
            // Retorna la clase CSS correcta para el badge
            const lowerStatus = status.toLowerCase()
            if (lowerStatus === 'activo') return 'status-badge status-active'
            if (lowerStatus === 'baja') return 'status-badge status-inactive'
            if (lowerStatus === 'Cambiar_contraseña') return 'status-badge status-pending'
            return 'status-badge'
        },

        async createUser() {
            try {

                if (!this.isEditing) {
                    console.log('creando')
                    const response = await api.post('/users/create', {
                        username: this.form.username,
                        password: this.form.password,
                        status: this.form.status,
                        start_work: this.form.workTimeStart,
                        end_work: this.form.workTimeEnd
                    })
                    alert('Usuario creado con éxito', response.data)
                    this.fetchUsers() // Refresca la lista de usuarios
                    // Limpia el formulario
                    this.cleanFormulary()
                } else {
                    console.log('editando')
                    const response = await api.put(`/users/${this.editingUserId}`, {
                        username: this.form.username,
                        status: this.form.status,
                        start_work: this.form.workTimeStart,
                        end_work: this.form.workTimeEnd
                    })
                    this.fetchUsers() // Refresca la lista de usuarios
                    alert('Usuario actualizado con éxito', response.data)
                    this.cleanFormulary()
                    this.isEditing = false;
                }
            } catch (error) {
                console.error('Error al crear usuario:', error)
            }

            // Siempre limpiamos el formulario y reseteamos el estado de edición
            this.editingIndex = -1;
        },
        async editUser(user) {
            this.isEditing = true
            this.editingUserId = user.id
            this.form = { ...user };
        },
        async deleteUser(userId) {
            const agree = confirm('¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.')
            try {
                if (!agree) return
                const response = await api.delete(`/users/${userId}`)
                alert('Usuario eliminado con éxito', response.data)
                this.fetchUsers() // Refresca la lista de usuarios
            } catch (error) {
                console.error('Error al eliminar usuario:', error)
            }
        }
    }
}
</script>

<style scoped>
/* 1. LAYOUT Y ESTRUCTURA GENERAL (Igual que antes) */
.page-container {
    padding: 20px 40px;
    background-color: #f0f3f6;
    min-height: 100vh;
}

.main-page-title {
    color: #333;
    font-size: 1.8rem;
    margin-bottom: 30px;
    font-weight: 600;
}

.content-wrapper {
    display: flex;
    gap: 30px;
}

.left-panel {
    flex: 0 0 350px;
}

.right-panel {
    flex-grow: 1;
}

/* Estilo de la "tarjeta" general para los paneles */
.card {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    padding: 20px;
}

/* 2. ESTILOS DEL FORMULARIO */
.form-card .form-title {
    font-size: 1.4rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 5px 0;
}

.form-card .form-subtitle {
    color: #666;
    font-size: 0.95rem;
    margin-bottom: 25px;
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

/* Botón Añadir Usuario */
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

.btn-primary:hover {
    background: #0056b3;
}

/* Icono (Si usas Font Awesome o similar, si no, es un placeholder) */
.icon-plus {
    /* Simula un icono de suma */
    content: '+';
    font-style: normal;
    margin-right: 8px;
    font-size: 1.2em;
    line-height: 0;
}


/* 3. ESTILOS DE LA TABLA (Igual que antes) */

.table-card {
    padding: 0;
}

.table-title {
    font-size: 1.4rem;
    font-weight: 600;
    color: #333;
    padding: 20px 20px 10px 20px;
    margin: 0;
}

.users-table {
    width: 100%;
    border-collapse: collapse;
}

.users-table thead {
    background-color: transparent;
    border-bottom: 2px solid #eee;
}

.users-table th {
    padding: 15px 20px;
    text-align: left;
    font-size: 0.8rem;
    color: #666;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
}

.users-table td {
    padding: 15px 20px;
    border-bottom: 1px solid #f0f0f0;
    color: #333;
    font-size: 0.95rem;
}

.users-table tr:last-child td {
    border-bottom: none;
}

/* 4. ESTILOS DE STATUS (BADGES) */
.status-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 600;
    display: inline-block;
    min-width: 60px;
    text-align: center;
}

.status-active {
    background-color: #e6f7ed;
    color: #389e60;
}

.status-inactive {
    background-color: #fff2f0;
    color: #f5222d;
}

.status-pending {
    background-color: #fffbe6;
    color: #faad14;
}

/* 5. ESTILOS DE ACCIONES */
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
</style>