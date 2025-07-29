<script setup>
    import { computed, ref } from 'vue'    
    import { useTransactionsStore } from '@/stores/transactions';
    import EditTransactionModal from './EditTransactionModal.vue';

    const store = useTransactionsStore()

    // для добавления записи
    const transactionText = ref('')
    const transactionAmount = ref('')

    // для изменения записи
    const transactionToEdit  = ref(null);

    // фильтрация переменных 
    const expensesTransactions = computed(() => { 
        return store.transactions.filter(t => t.amount < 0)
    })

    // для даты
    const groupedTransactions = computed(() => { 
        return expensesTransactions.value.reduce((group, transaction) => {
            const date = transaction.date

            if (!group[date]) { 
                group[date] = []
            }

            group[date].push(transaction)

            return group

        }, {}) 
    })

    // форматер даты
    function formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${day}.${month}.${year}`;
    }

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
    function openEditModal(transaction) { 
        transactionToEdit.value = { ...transaction}
    }

    // закрытие окна
    function closeEditModal() {
        transactionToEdit.value = null;
    }

    // функция изменения 
    function handleUpdateTransaction(updatedData) { 

        const expenseAmount = -Math.abs(updatedData.amount);

        if (!updatedData.text.trim() || isNaN(expenseAmount)) {
            alert("Пожалуйста, убедитесь, что описание заполнено, а сумма является корректным числом.")
            return;
        };

        store.updateTransaction(updatedData.id, { 
            text: updatedData.text,
            amount: expenseAmount
        })
        closeEditModal();
    }

</script> 

<template>
    <section class="expenses">
        <h1 class="expenses-sum"> Общая суммая расходов: <span class="expenses-sum-spend">{{ store.totalExpense }}</span> BYN</h1>

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

                <ul class="transactions-content-ul-date">
                    <li class="transactions-content-li-date" v-for="(transactionsInGroup, date) in groupedTransactions" :key="date">

                        <h1 class="expenses-transion-date">{{ formatDate(date) }}</h1>

                             <ul class="transactions-content-ul">
                                <li v-for="transaction in transactionsInGroup" 
                                :key="transaction.id"
                                class="transactions-content-li"
                                @click="openEditModal(transaction)"> 

                                    <div class="display-view">

                                        <div class="transactions-content-div-text">
                                            <h1 class="transactions-amount-div"> {{ transaction.amount }} BYN</h1>
                                            <h1 class="transactions-text-div">{{ transaction.text }}</h1>
                                        </div>

                                    </div>

                                    </li>
                                </ul>

                    </li>
                </ul>
            </div>
    </section>

    <EditTransactionModal
    v-if="transactionToEdit"
    :transaction="transactionToEdit"
    @close="closeEditModal"
    @save="handleUpdateTransaction"
    />
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

.expenses-sum-spend{ 
    color: red;
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

.transactions-content-ul-date {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
}

.transactions-content-li-date {
    margin-bottom: 30px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 20px;
    background-color: #fdfdfd;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
    cursor: pointer;
}

.expenses-transion-date {
    font-size: 18px;
    font-weight: 600;
    color: #666;
    margin-bottom: 15px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 6px;
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
    align-items: flex-start;
    justify-content: space-between;    
    gap: 20px;
    width: 100%;
}

.transactions-content-div-text {
    display: flex;
    gap: 20px;
}

.transactions-text-div {
    word-break: break-word;
    white-space: normal;
    overflow-wrap: break-word;
    font-size: 16px;
    color: #333;
}

.transactions-amount-div {
    font-size: 16px;
    white-space: nowrap;
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

@media (max-width: 600px) {
    .expenses-table {
        flex-direction: column;
        gap: 12px;
    }

    .transactions-content-li {
        flex-direction: column;
        align-items: flex-start;
    }

    .display-view {
        align-items: flex-start;
        gap: 10px;
    }

    .transactions-content-div-text {
        align-items: flex-start;
        gap: 20px;
    }

    .transactions-button-div {
        justify-content: flex-start;
        gap: 5px;
    }

    .edit-form {
        flex-direction: column;
        align-items: flex-start;
        align-items: stretch;
    }

    .edit-amount,
    .edit-text {
        width: 100%;
    }

    .transactions-text-div,
    .transactions-amount-div {
        font-size: 12px;
    }
}

@media (max-width: 400px) {
    .expenses {
        padding: 20px;
    }

    .expenses-sum {
        font-size: 18px;
        text-align: center;
    }

    .expenses-price-input,
    .expenses-text-input {
        font-size: 14px;
        padding: 8px 12px;
    }

    .edit-button-aplya,
    .edit-button-cancellation,
    .button-delete,
    .button-new-value {
        font-size: 12px;
    }
}

</style>
