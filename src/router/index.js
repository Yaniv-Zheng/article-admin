import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/views/login'
import home from '@/views/Home'
import layout from '@/views/layout'
import article from '@/views/article'
import publish from '@/views/Publish'
import images from '@/views/images'
import comment from '@/views/comment'
import fans from '@/views/fans'
import install from '@/views/install'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/home',
    component: layout,
    children:[
      {
        path: '',
        name: 'home',
        component: home
      },
      {
        path: '/article',
        name: 'article',
        component: article
      },
      {
        path: '/publish',
        name: 'publish',
        component: publish
      },
      {
        path: '/images',
        name: 'images',
        component: images
      },
      {
        path: '/comment',
        name: 'comment',
        component: comment
      },
      {
        path: '/fans',
        name: 'fans',
        component: fans
      },
      {
        path: '/install',
        name: 'instll',
        component: install
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next) => {
  const user = JSON.parse(window.localStorage.getItem('user'))
  if(to.path !== '/login'){
    if(user){
      next()
    }else{
      next('/login')
    }
  }else{
    next()
  }
})

export default router