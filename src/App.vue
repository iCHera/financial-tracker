<script setup>
   import Expenses from './components/Expenses.vue'
   import Income from './components/Income.vue';
   import Account from './components/Account.vue';  
</script>

<template>
  <Expenses />
  <Income />
  <Account />
</template>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
</style>
