<script setup>
</script>

<template>
  <div class="app-wrapper">
    <header class="app-header">
      <nav class="main-nav">
        <router-link to="/">Счета</router-link>
        <router-link to="/expenses">Расходы</router-link>
        <router-link to="/income">Доходы</router-link>
      </nav>
    </header>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
</style>

<style scoped>

.app-header {
    background-color: #fff;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    border-radius: 12px;
    margin: 20px; 
  }

  .main-nav {
    display: flex;
    justify-content: center;
    gap: 15px;
  }

  .main-nav a {
    padding: 10px 20px;
    border: none;
    background-color: transparent;
    font-size: 16px;
    font-weight: 500;
    color: #555;
    cursor: pointer;
    border-radius: 8px;
    text-decoration: none; 
    transition: background-color 0.2s, color 0.2s;
  }

  .main-nav a:hover {
    background-color: #e9ecef;
  }

  .main-nav a.router-link-exact-active {
    background-color: #4CAF50;
    color: white;
  }

  .main-content {
    padding: 0 15px;
  }

</style>
