import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from "firebase";
import Znaki from "./components/Znaki";
import Upload from "./components/Upload";
import Edit from "./components/Edit";
import Login from "./components/Login";
import Test from "./components/Test";
import NotFound from "./components/NotFound";


Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'znaki',
    component: Znaki
  },
  {
    path: '/upload',
    name: 'upload',
    component: Upload,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/edit/:id",
    // path: '/edit/',
    name: 'edit',
    props: true,
    component: Edit
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/test',
    name: 'test',
    component: Test
  },
  {
    path: '/404',
    name: '404',
    component: NotFound,
  }, {
    path: '*',
    redirect: '/404'
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  console.log('requiresAuth=', requiresAuth)
  console.log('await firebase.getCurrentUser()=', await firebase.getCurrentUser())

  if (requiresAuth && !await firebase.getCurrentUser()) {
    next('/login')
  } else {
    next()
  }
})

export default router
