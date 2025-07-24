<script setup>
    import { computed, ref } from 'vue'    
    import { useTransactionsStore } from '@/stores/transactions';

    const store = useTransactionsStore()

    // для добавления записи
    const transactionText = ref('')
    const transactionAmount = ref('')

    // для изменения записи
    const editText = ref('')
    const editAmount = ref('')
    const editingId = ref(null);
    
    // фильтрация переменных 
    const transactions = computed(() => { 
        return store.transactions.filter(t => t.amount < 0)
    })

    //функция добавления значений
    function addExpenses() {
        const potentialNumber = parseFloat(transactionAmount.value);

        if (!transactionText.value.trim() || isNaN(potentialNumber)) { 
            alert("Пожалуйста, убедитесь, что описание заполнено, а сумма является корректным числом.")
            return;
        }

        const transactionData = { 
            text: transactionText.value,
            amount: -potentialNumber 
        }
        
        store.addTransaction(transactionData)

        transactionText.value = ''
        transactionAmount.value = ''
    }

    //функция начала изменения
    function startEditing(transaction) { 
        editingId.value = transaction.id 
        editText.value = transaction.text;
        editAmount.value = transaction.amount;
    }

    // функция изменения значений
    function EditValue(ExpensesID) { 
        const potentialNumber = parseFloat(editAmount.value);

        if (!editText.value.trim() || isNaN(potentialNumber)) {
            alert("Пожалуйста, убедитесь, что описание заполнено, а сумма является корректным числом.")
            return;
        };

        const updateData = { 
            text: editText.value,
            amount: -Math.abs(parseFloat(potentialNumber))
        };

        store.updateTransaction(ExpensesID, updateData)
        editingId.value = null;
    }

    //функция конец изменения
    function cancelEditing() {
        editingId.value = null;
    }

    //функция удаления
    function deleteExpenses(ExpensesID) { 
        store.deleteTransaction(ExpensesID)
    }

</script> 

<template>
    <section class="expenses">
        <h1 class="expenses-sum"> Общая суммая расходов: {{ store.totalExpense }} </h1>

            <div class="expenses-table">
                <input type="number"
                placeholder="Введите сумму"
                class="expenses-price-input"
                v-model="transactionAmount"
                @keyup.enter="addExpenses"
                >

                <input type="text"
                placeholder="Введите текст"
                class="expenses-text-input"
                v-model="transactionText"
                @keyup.enter="addExpenses"
                >
                <button
                class="expenses-button"
                :class="{'is-activ': transactionText.trim() && transactionAmount}"
                @click="addExpenses"
                >✓</button>
            </div>

            <div class="transactions-div">
                <h1 class="transactions-text">Транзакции: </h1>
                    <ul class="transactions-content-ul">
                        <li v-for="transaction in transactions" :key="transaction.id" class="transactions-content-li"> 

                            <div v-if="editingId === transaction.id" class="edit-form">
                                
                                <input type="number"
                                v-model="editAmount"
                                class="edit-amount"
                                placeholder="Введите сумму">

                                <input type="text"
                                v-model="editText"
                                class="edit-text"
                                placeholder="Введите текст">
                                
                                <button @click="EditValue(transaction.id)" class="edit-button-aplya">✓</button>
                                <button @click="cancelEditing" class="edit-button-cancellation">X</button>

                            </div>

                            <div v-else class="display-view">

                                <div class="transactions-content-dev-text">
                                    <h1 class="transactions-amount-div"> {{ transaction.amount }}</h1>
                                    <h1 class="transactions-text-div">{{ transaction.text }}</h1>
                                </div>

                                <div class="transactions-button-div">
                                    <button class="button-new-value" @click="startEditing(transaction)">✏️</button>
                                    <button class="button-delete" @click="deleteExpenses(transaction.id)">X</button>
                                </div>

                            </div>

                        </li>
                    </ul>
            </div>
    </section>
</template>

<style scoped>
.expenses {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 600px;
    width: 100%;
    margin: 50px auto;
    padding: 30px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.expenses-sum {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 30px;
}

.expenses-table {
    display: flex;
    gap: 10px;
    width: 100%;
    margin-bottom: 20px;
}

.expenses-price-input,
.expenses-text-input {
    flex: 1;
    padding: 10px 14px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.3s ease;
}

.expenses-price-input:focus,
.expenses-text-input:focus {
    border-color: #4CAF50;
}

.expenses-button {
    padding: 10px 16px;
    font-size: 20px;
    background-color: #e0e0e0;
    color: #333;
    border: none;
    border-radius: 8px;
    cursor:not-allowed;
    transition: all 0.3s ease;
}

.expenses-button.is-activ {
    background-color: #4CAF50;
    color: #fff;
    cursor: pointer;
}

.expenses-button.is-activ:hover {
    background-color: #45a049;
    color: #fff;

}

.transactions-div {
    width: 100%;
    margin-top: 20px;
}

.transactions-text {
    font-size: 20px;
    font-weight: bold;
    color: #444;
    margin-bottom: 10px;
}

.transactions-content-ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.transactions-content-li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f7f7f7;
    padding: 12px 16px;
    margin-bottom: 10px;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.edit-form {
    display: flex;
    gap: 10px;
    width: 100%;
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
    align-items: center;
    flex-wrap: wrap;
}

.edit-amount,
.edit-text {
    flex: 1;
    padding: 10px 14px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.3s ease;
    min-width: 120px;
}

.edit-amount:focus,
.edit-text:focus {
    border-color: #4CAF50;
}

.edit-button-aplya {
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 5px 10px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.edit-button-aplya:hover {
    background-color: #45a049;
}

.edit-button-cancellation {
    background-color: #ff5252;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 6px 11px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.edit-button-cancellation:hover {
    background-color: #d32f2f;
}

.display-view {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.transactions-content-dev-text {
    display: flex;
    gap: 20px;
    align-items: center;
}

.transactions-text-div {
    font-size: 16px;
    color: #333;
}

.transactions-amount-div {
    font-size: 16px;
    font-weight: bold;
    color: #e53935;
}

.button-new-value {
    background-color: #2196f3;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 5px 7px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.button-new-value:hover {
    background-color: #1976d2;
}

.transactions-button-div {
    display: flex;
    gap: 10px;
    align-items: center;
}

.button-delete {
    background-color: #ff5252;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.button-delete:hover {
    background-color: #d32f2f;
}

input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type=number] {
    -moz-appearance: textfield;
}
</style>
