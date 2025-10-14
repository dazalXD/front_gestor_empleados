<template>
    <div class="page-background">
        <div class="login-card-wrapper">
            <h1 class="main-title">LOGIN</h1>
            <p class="subtitle">Ingrese sus credenciales para acceder.</p>

            <form @submit.prevent="login" class="login-form-card">
                <div class="form-group">
                    <label for="username">Usuario</label>
                    <input v-model="username" id="username" type="text" placeholder="su.usuario" required>
                </div>

                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <input v-model="password" id="password" type="password" placeholder="********" required>
                </div>

                <button type="submit" class="btn-primary">Iniciar Sesión</button>

                <a href="#" @click.prevent="goToChangePassword" class="forgot-password-link">
                    Cambiar Contraseña
                </a>
            </form>

            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </div>
    </div>
</template>

<script>
import api from '../services/api.js'


export default {
    name: 'LoginView',
    data() {
        return {
            username: '',
            password: '',
            errorMessage: ''
        }
    },
    methods: {
        async login() {
            try {
                const response = await api.post('/auth/login', {
                    username: this.username,
                    password: this.password
                })
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('user', JSON.stringify(response.data.user))
                console.log(response)
                this.$router.push({ name: 'users' })
            } catch (error) {
                this.errorMessage = error.response?.data?.message
                alert(error.message || 'Error al iniciar sesión')
                console.error(error)
            }
        }
    }
}
</script>

<style scoped>
/* 1. ESTILO GENERAL Y CENTRADO */
.page-background {
    height: 100vh;
    width: 100vw;
    background-color: #f7f9fd;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: auto;
    padding: 20px;
    box-sizing: border-box;
}

.login-card-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 400px;
    width: 100%;
}

/* 2. ENCABEZADO */
.main-title {
    /* LOGIN */
    font-size: 3rem;
    /* Tamaño grande */
    font-weight: 800;
    /* Extra bold */
    color: #333;
    /* Color oscuro */
    margin-bottom: 5px;
    /* Separación del subtítulo */
    /* Asegura el tipo de fuente (ajusta según tu proyecto) */
    font-family: Arial, sans-serif;
}

.subtitle {
    /* Ingrese sus credenciales... */
    color: #666;
    font-size: 1rem;
    margin-top: 0;
    margin-bottom: 30px;
    /* Separación de la tarjeta */
}

/* 3. TARJETA DE LOGIN */
.login-form-card {
    width: 100%;
    padding: 30px;
    background: white;
    /* Fondo blanco */
    border-radius: 10px;
    /* Bordes redondeados */
    /* Sombra sutil como en la imagen */
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
}

/* 4. CAMPOS DEL FORMULARIO */
.form-group {
    margin-bottom: 20px;
}

.login-form-card label {
    display: block;
    /* Para que la etiqueta esté sobre el input */
    margin-bottom: 6px;
    font-weight: bold;
    color: #333;
    font-size: 0.95rem;
}

.login-form-card input {
    width: 100%;
    padding: 12px 15px;
    /* Más padding para que sean más altos */
    border-radius: 6px;
    border: 1px solid #ddd;
    box-sizing: border-box;
    /* Importante para el padding */
    font-size: 1rem;
    transition: border-color 0.2s;
}

.login-form-card input:focus {
    border-color: #007bff;
    /* Borde azul al enfocar */
    outline: none;
}

/* 5. BOTONES Y ENLACES */
.btn-primary {
    /* Iniciar Sesión */
    width: 100%;
    padding: 12px;
    background: #007bff;
    /* Azul primario */
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: bold;
    margin-top: 10px;
    /* Separación del último input */
    margin-bottom: 15px;
    /* Separación del enlace */
    transition: background-color 0.2s;
}

.btn-primary:hover {
    background: #0056b3;
}

.forgot-password-link {
    /* Cambiar Contraseña */
    color: #007bff;
    text-align: center;
    display: block;
    font-size: 0.9rem;
    text-decoration: none;
    transition: color 0.2s;
}

.forgot-password-link:hover {
    color: #0056b3;
}

.error {
    color: red;
    margin-top: 20px;
    text-align: center;
}
</style>
