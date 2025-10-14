<template>
  <div class="not-found">
    <h1>404 - Página no encontrada 😕</h1>
    <p>La ruta <strong>{{ $route.path }}</strong> no existe.</p>
    <router-link to="/users" class="btn">Volver al inicio</router-link>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}
.btn {
  margin-top: 16px;
  padding: 10px 18px;
  background: #007bff;
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.2s ease;
}
.btn:hover {
  background: #0056b3;
}
</style>
