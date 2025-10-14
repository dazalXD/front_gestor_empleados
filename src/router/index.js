import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import UsersView from '../views/UsersView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import DocsView from '../views/DocumentsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: LoginView },
    { path: '/users', name: 'users', component: UsersView },
    { path: '/docs', name: 'docs', component: DocsView },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView }
  ],
})

// Protección básica: solo deja ir a /home si hay token
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  // Si NO hay token y quiere ir a algo distinto de login → redirigir a login
  if (!token && to.name !== 'login') {
    next({ name: 'login' })
  }
  // Si SÍ hay token y quiere ir al login → redirigir al home
  else if (token && to.name === 'login') {
    next({ name: 'users' })
  }
  // En cualquier otro caso → dejar pasar
  else {
    next()
  }
})

export default router
