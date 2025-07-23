<script setup>
    import { ref } from 'vue'    
    import { useTransactionsStore } from '@/stores/transactions';

    const expenses = useTransactionsStore()

    const transactionText = ref('')
    const transactionAmount = ref('')

    function addExpenses() {
        const potentialNumber = parseFloat(transactionAmount.value);

        if (!transactionText.value.trim() && transactionAmount.value) { 
            return;
        }

        if(isNaN(potentialNumber)) { 
            alert("Пожалуйста, введите корректную сумму.");
            return;
        }

        const transactionData = { 
            text: transactionText.value,
            amount: -potentialNumber 
        }
        
        expenses.addTransaction(transactionData)

        transactionText.value = ''
        transactionAmount.value = ''
    }

</script> 

<template>
    <h1> Общая суммая расходов: {{ expenses.totalExpense }} </h1>

    <div class="expenses-table">
        <input type="number"
        placeholder="введите сумму"
        class="expenses-price-input"
        v-model="transactionAmount">

        <input type="text"
        placeholder="введите текст"
        class="expenses-text-input"
        v-model="transactionText"
        >
        <button
        class="expenses-button"
        :class="{'is-activ': transactionText.trim() && transactionAmount}"
        @click="addExpenses()"
        >✓</button>
    </div>
</template>

<style scoped>

</style>