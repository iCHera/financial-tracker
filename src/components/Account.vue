<script setup>
    import { useTransactionsStore } from '@/stores/transactions'
    import {ref, computed} from 'vue'

    const store = useTransactionsStore()
</script>

<template>
    <section class="account">
        <h1 class="account-balance">Общий баланс: <span class="balance" 
            :class="{'plus': store.totalBalance > 0}, {'minus': store.totalBalance < 0}">
            {{ store.totalBalance }}</span></h1>

        <div class="account-div">
            
        </div>

    </section>
</template>

<style scoped>

</style>