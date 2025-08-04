import { createRouter, createWebHistory } from 'vue-router';

import Account from '../components/Account.vue';
import Expenses from '../components/Expenses.vue';
import Income from '../components/Income.vue';

const routes = [
  {
    path: '/',          
    name: 'Account',    
    component: Account  
  },
  {
    path: '/expenses',
    name: 'Expenses',
    component: Expenses
  },
  {
    path: '/income',
    name: 'Income',
    component: Income
  }
];

const router = createRouter({
  history: createWebHistory(), 
  routes: routes
});

export default router;