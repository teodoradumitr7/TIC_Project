// Composables
import { createRouter, createWebHistory } from 'vue-router'
import store from '../store/store';

const routes = [
  {
    path: '/',
    name: "Home",
    component: () => import('@/views/Home.vue'),

  },
  {
    path:'/login',
    name: "Login",
    component:()=>import("@/views/Login.vue"),

  },
  {
    path:'/register',
     name: "Register",
    component:()=>import("@/views/Register.vue"),

  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component:()=>import("@/views/Dashboard.vue")
},
{
  path: '/rentCar',
  name: 'RentCar',
  component:()=>import("@/views/RentCar.vue")
},
{path:'/editRental',
name:'EditRental',
component:()=>import("@/views/EditRental.vue")}
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})


router.beforeEach((to, from, next) => {
  if (
    to.name === "Home" ||
    to.name === "Dashboard" ||
    to.name === "Login" ||
    to.name === "Register"
  ) {
    next();
  } else if (to.name !== "Login" && !store.state.isAuthenticated) {
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router
