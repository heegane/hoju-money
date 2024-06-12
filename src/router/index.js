import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import IncomeView from '../views/come/IncomeView.vue'
import OutcomeView from '../views/come/OutcomeView.vue'
import CategoryChartView from '../views/chart/CategoryChartView.vue'
import ComesChartView from '../views/chart/ComesChartView.vue'
import UserDetailView from '../components/UserDetailComponent.vue'
import SettingView from '../views/user/SettingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/come/income',
      name: 'income',
      component: IncomeView
    },
    {
      path: '/come/outcome',
      name: 'outcome',
      component: OutcomeView
    },
    {
      path: '/chart/category',
      name: 'categorychart',
      component: CategoryChartView
    },
    {
      path: '/chart/comes',
      name: 'comeschart',
      component: ComesChartView
    },
    {
      path: '/user/detail',
      name: 'userdetail',
      component: UserDetailView
    },
    {
      path: '/user/setting',
      name: 'setting',
      component: SettingView
    }
  ]
})

export default router
