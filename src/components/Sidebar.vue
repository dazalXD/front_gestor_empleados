<template>
    <aside :class="['sidebar', { collapsed: isCollapsed }]">
        <div class="brand">
            <h2 class="brand-title">Gestión Interna</h2>
        </div>

        <nav class="nav">
            <router-link to="/home" exact class="nav-item" active-class="active">
                <span class="icon">🏠</span>
                <span class="text">Inicio</span>
            </router-link>

            <router-link to="/docs" class="nav-item" active-class="active">
                <span class="icon">📁</span>
                <span class="text">Documentos</span>
            </router-link>

            <router-link to="/users" class="nav-item" active-class="active">
                <span class="icon">👥</span>
                <span class="text">Usuarios</span>
            </router-link>

            <router-link to="/settings" class="nav-item" active-class="active">
                <span class="icon">⚙️</span>
                <span class="text">Configuración</span>
            </router-link>
        </nav>

        <div class="profile">
            <!-- <img class="avatar" src="https://i.pravatar.cc/40" alt="avatar" /> -->
            <div class="profile-info">
                <div class="name">{{ user?.username }}</div>
                <button class="logout" title="Cerrar sesión" @click="logout">cerrar sesion</button>
            </div>
        </div>
    </aside>
</template>

<script>
// import { name } from '@vue/eslint-config-prettier/skip-formatting';

export default {
    name: 'Sidebar',
    data() {
        return {
            isCollapsed: false,
            user: null
        }
    },
    created() {
        this.loadUser()
        // Escucha cambios en localStorage desde otras pestañas (opcional)
        window.addEventListener('storage', this.onStorage)
    },
    beforeUnmount() {
        window.removeEventListener('storage', this.onStorage)
    },
    methods: {
        toggleCollapse() {
            this.isCollapsed = !this.isCollapsed
            // Emitimos el estado para que el padre (App.vue) lo pueda usar si quiere
            this.$emit('collapsed', this.isCollapsed)
        },
        loadUser() {
            try {
                const raw = localStorage.getItem('user')
                this.user = raw ? JSON.parse(raw) : null
            } catch (e) {
                this.user = null
            }
        },
        onStorage(e) {
            if (e.key === 'user' || e.key === 'token') {
                this.loadUser()
            }
        },
        logout() {
            // limpia todo y redirige al login
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            this.$router.push({ name: 'login' })
        }
    }
}
</script>

<style scoped>
.logout {
    background: #ff4d4f;
    color: #fff;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: background 0.2s ease, transform 0.1s ease;
}

.logout:hover {
    background: #e04547;
    transform: translateY(-1px);
}

.logout:active {
    background: #cc3e40;
    transform: translateY(0);
}

/* NOTA: las variables --sidebar-width y --sidebar-collapsed se definen globalmente en main.css */

/* Sidebar como columna en grid; usamos sticky para que quede pegada al hacer scroll */
.sidebar {
    width: var(--sidebar-width);
    background: var(--sidebar-bg);
    border-right: 1px solid #e6e9ee;
    padding: 18px 12px;
    box-shadow: 2px 0 6px rgba(20, 20, 30, 0.03);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: width .18s ease, min-width .18s ease;
    height: 100vh;
    /* para sticky funcione correctamente */
    position: sticky;
    top: 0;
    overflow: hidden;
}

/* Colapsado */
.sidebar.collapsed {
    width: var(--sidebar-collapsed);
    min-width: var(--sidebar-collapsed);
}

/* Encabezado */
.brand {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding-bottom: 6px;
}

.brand-title {
    font-size: 16px;
    margin: 0;
    font-weight: 600;
    color: #111827;
}

.collapse-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

/* Nav items */
.nav {
    margin-top: 18px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    overflow-y: auto;
    padding-right: 6px;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    border-radius: 8px;
    text-decoration: none;
    color: #374151;
    font-weight: 500;
}

.nav-item .icon {
    width: 28px;
    text-align: center;
    font-size: 18px;
}

.nav-item .text {
    white-space: nowrap;
}

/* activo */
.nav-item.active {
    background: #e6f0ff;
    color: #0b61ff;
    box-shadow: inset 3px 0 0 rgba(11, 97, 255, 0.12);
}

/* Ocultamos textos cuando está colapsado */
.sidebar.collapsed .text,
.sidebar.collapsed .brand-title {
    display: none;
}

/* Perfil abajo */
.profile {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-top: 14px;
    border-top: 1px solid #f0f2f5;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 999px;
    object-fit: cover;
}

.profile-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.name {
    font-size: 13px;
    color: #111827;
}

/* Responsive: en pantallas pequeñas el sidebar no está visible por defecto; controlalo desde App con una clase o botón */
@media (max-width: 768px) {
    .sidebar {
        position: relative;
        height: auto;
        width: 100%;
        min-width: 0;
        box-shadow: none;
        border-right: none;
    }

    .sidebar.collapsed {
        width: 100%;
    }

    .nav {
        flex-direction: row;
        gap: 10px;
        overflow-x: auto;
        padding-right: 0;
    }

    .nav-item {
        padding: 8px 10px;
        border-radius: 6px;
    }
}
</style>
