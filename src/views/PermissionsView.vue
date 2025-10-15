<template>
    <div class="view-layout">
        <sidebar />
        <div class="page-container">
            <h1 class="main-page-title">Configuración de Permisos</h1>
            <p class="subtitle">Asigna o revoca permisos a usuarios o roles específicos.</p>

            <div class="content-wrapper-center">

                <div class="card selector-card">
                    <h2 class="card-title">Seleccionar Usuario</h2>
                    <div class="form-group">
                        <select v-model="selectedEntity" class="select-dropdown" @change="onUserChange">
                            <option value="" disabled>Seleccionar...</option>
                            <option v-for="entity in entities" :key="entity.id" :value="entity.id">
                                {{ entity.username }}
                            </option>
                        </select>
                    </div>

                </div>

                <div class="card permissions-card">
                    <h2 class="card-title">Permisos del Sistema</h2>

                    <div v-for="permission in permissions" :key="permission.id" class="permission-item">
                        <label class="permission-label">
                            <input type="checkbox" v-model="permission.enabled" @change="updatePermissions(permission)">
                            <span class="permission-title">{{ permission.name }}</span>
                            <!-- <p class="permission-description">{{ permission.description }}</p> -->
                        </label>
                    </div>

                </div>

                <div class="action-footer">
                    <button @click="cancelChanges" class="btn-secondary">Cancelar</button>
                    <button @click="saveChanges" class="btn-primary" :disabled="!selectedEntity">Guardar
                        Cambios</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import api from '../services/api.js'
import Sidebar from '../components/Sidebar.vue'
export default {
    components: { Sidebar },
    data() {
        return {
            permissions: [],
            selectedEntity: '',
            entities: [],
            //     // Lista completa de Permisos
            //     permissionsList: [
            //         {
            //             id: 'users_access',
            //             name: 'Acceso al Módulo de Usuarios',
            //             description: 'Permite ver y gestionar la lista de usuarios.',
            //             enabled: true
            //         },
            //         {
            //             id: 'docs_access',
            //             title: 'Acceso al Módulo de Documentos',
            //             description: 'Permite ver y gestionar los documentos de la empresa.',
            //             enabled: true
            //         },
            //         {
            //             id: 'create_users',
            //             title: 'Crear Nuevos Usuarios',
            //             description: 'Permite crear nuevas cuentas de usuario.',
            //             enabled: false
            //         },
            //         {
            //             id: 'delete_docs',
            //             title: 'Eliminar Documentos',
            //             description: 'Permite eliminar documentos permanentemente.',
            //             enabled: false
            //         },
            //         {
            //             id: 'modify_perms',
            //             title: 'Modificar Permisos',
            //             description: 'Permite editar los permisos asignados a cada usuario o rol.',
            //             enabled: false
            //         },
            //     ]
            // }
        }
    },
    mounted() {
        this.getPermissions();
        this.fetchUsers();
    },
    methods: {
        async fetchUsers() {
            try {
                const response = await api.get('/users');
                this.entities = response.data;
            } catch (error) {
                console.error('Error al cargar usuarios:', error);
            }
        },

        async getPermissions() {
            try {
                const response = await api.get('/permissions');
                // inicializa enabled en false por defecto
                this.permissions = response.data.map(p => ({ ...p, enabled: false }));
            } catch (error) {
                console.error('Error al cargar permisos:', error);
            }
        },

        onUserChange() {
            const id = Number(this.selectedEntity);
            if (!id) return;
            console.log('Usuario seleccionado ->', id);
            this.getPermissionsByUserId(id);
        },

        async getPermissionsByUserId(id) {
            try {
                const response = await api.get(`/permissions/${id}`);
                const userPermissions = response.data;
                console.log('Permisos del usuario ->', userPermissions);

                // Mapear: marcar enabled true en los permisos que coincidan
                const permissionIds = userPermissions.map(p => p.permissionId);

                // Si ya tienes la lista completa en this.permissions, sincroniza enabled:
                this.permissions = this.permissions.map(p => ({
                    ...p,
                    enabled: permissionIds.includes(p.id)
                }));
            } catch (error) {
                console.error('Error al cargar permisos del usuario:', error);
                this.permissions = this.permissions.map(p => ({ ...p, enabled: false }));
            }
        },

        updatePermissions(permission) {
            console.log(`Permiso ${permission.id} cambiado a: ${permission.enabled}`);
        },

        // ...saveChanges, cancelChanges...
    }
}
</script>
<style scoped>
/* 1. LAYOUT Y ESTRUCTURA GENERAL */
.page-container {
    padding: 20px 40px;
    background-color: #f0f3f6;
    /* Fondo gris claro */
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* Centrar el contenido horizontalmente */
}

.content-wrapper-center {
    width: 100%;
    max-width: 700px;
    /* Ancho máximo para el contenido de las tarjetas */
    margin-top: 20px;
}

.main-page-title {
    color: #333;
    font-size: 1.8rem;
    margin-bottom: 5px;
    font-weight: 600;
    width: 100%;
    max-width: 700px;
}

.subtitle {
    color: #666;
    font-size: 1rem;
    margin-bottom: 30px;
    width: 100%;
    max-width: 700px;
}

/* Estilo de la "tarjeta" general */
.card {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    padding: 20px;
    margin-bottom: 25px;
}

.card-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    margin-top: 0;
    margin-bottom: 15px;
}

/* 2. SELECTOR DE USUARIO/ROL */
.selector-card {
    /* Estilo de la tarjeta de selección */
}

.form-group {
    margin-bottom: 0;
}

.select-dropdown {
    width: 100%;
    padding: 10px 12px;
    border-radius: 4px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    font-size: 1rem;
    color: #333;
    background-color: white;
    appearance: none;
    /* Quitar el estilo nativo en algunos navegadores */
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 16px;
    cursor: pointer;
}

/* 3. PERMISOS DEL SISTEMA (CHECKBOXES) */
.permissions-card {
    /* Estilo de la tarjeta de permisos */
}

.permission-item {
    margin-bottom: 20px;
}

.permission-label {
    display: block;
    cursor: pointer;
    padding-left: 30px;
    /* Espacio para el checkbox */
    position: relative;
}

.permission-label input[type="checkbox"] {
    position: absolute;
    left: 0;
    top: 3px;
    /* Ajuste vertical */
    transform: scale(1.3);
    /* Hace el checkbox visiblemente más grande */
    margin: 0;
}

.permission-title {
    font-weight: 600;
    color: #333;
    display: block;
    font-size: 1rem;
    margin-bottom: 3px;
}

.permission-description {
    color: #666;
    font-size: 0.9rem;
    margin: 0;
}


/* 4. FOOTER DE ACCIONES */
.action-footer {
    width: 100%;
    max-width: 700px;
    display: flex;
    justify-content: flex-end;
    /* Alinear botones a la derecha */
    padding: 10px 0;
}

.btn-primary {
    padding: 10px 15px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    margin-left: 10px;
    transition: background-color 0.2s;
}

.btn-primary:hover:not(:disabled) {
    background: #0056b3;
}

.btn-primary:disabled {
    background: #a0c3e6;
    cursor: not-allowed;
}

.btn-secondary {
    padding: 10px 15px;
    background: transparent;
    color: #007bff;
    border: 1px solid #007bff;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: background-color 0.2s, color 0.2s;
}

.btn-secondary:hover {
    background: #e9f2ff;
    /* Fondo muy claro al pasar el mouse */
}
</style>