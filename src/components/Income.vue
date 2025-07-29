<script setup>
    import { ref, computed } from 'vue'
    import { useTransactionsStore } from '@/stores/transactions';
    import EditTransactionModal from './EditTransactionModal.vue';

    const store = useTransactionsStore()

    const transactionAmount = ref('')
    const transactionText = ref('')
        
    // для изменения записи
    const transactionToEdit = ref(null);

    const incomeTransactions = computed(() => { 
        return store.transactions.filter(t => t.amount > 0)
    })

    // для даты
    const groupedTransactions = computed(() => { 
        return incomeTransactions.value.reduce((gpoup, transaction) => { 
            const date = transaction.date
            
            if (!gpoup[date])  {
                gpoup[date] = []
            }

            gpoup[date].push(transaction)
            return gpoup
        }, {}) 
    })

    // форматер даты
    function formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${day}.${month}.${year}`;
    }

    // фукнция для добавления транзакции
    function AddIncome() {
        
        const potentialNumber = parseFloat(transactionAmount.value);

        if (!transactionText.value.trim() || isNaN(potentialNumber)) { 
            alert("Пожалуйста, убедитесь, что описание заполнено, а сумма является корректным числом.")
            return;
         }

        if (potentialNumber < 0) { 
            alert(`Доход не может быть отрицальным`)
            return;
        }

         const transactionData = { 
            text: transactionText.value,
            amount :potentialNumber,
         }

         store.addTransaction(transactionData)

         transactionAmount.value = ''
         transactionText.value = ''
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

        const expenseAmount = Math.abs(updatedData.amount);

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
    <section class="income-section">

        <h1 class="income-sum"> Поступление средств: <span class="income-sum-income">{{ store.totalIncome }}</span> BYN</h1>

        <div class="div-input">

            <input type="number"
            placeholder="Введите сумму"
            v-model="transactionAmount"
            @keyup.enter="AddIncome"
            class="div-input-number">

            <input type="text"
            placeholder="Введите текст"
            v-model="transactionText"
            @keyup.enter="AddIncome"
            class="div-input-text">

            <button class="div-input-button"
            :class="{'is-activ': transactionText.trim() && transactionAmount}"
            @click="AddIncome"
            >✓</button>

        </div>

        <div class="income-transion-div">

            <h1 class="income-transion-text">Транзакции:</h1>

            <ul class="income-transion-ul-date">
                <li class="income-transion-li-date" v-for="(transactionsInGroup, date) in groupedTransactions" :key="date">

                   <h1 class="income-transion-date">{{ formatDate(date) }}</h1>
                    
                    <ul class="income-transion-ul">
                        <li class="income-transion-li"
                        v-for="transaction in transactionsInGroup"
                        @click="openEditModal(transaction)"
                        :key="transaction.id">

                        <div class="income-display-view">

                            <div class="income-display-view-text">
                                <h1 class="income-display-view-text-amount">{{ transaction.amount }} BYN</h1>
                                <h1 class="income-display-view-text-text"> {{ transaction.text }}</h1>
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

.income-section {
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

.income-sum {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 30px;
}

.income-sum-income {
    color: green;
}

.div-input {
    display: flex;
    gap: 10px;
    width: 100%;
    margin-bottom: 20px;
}

.div-input-number,
.div-input-text {
    flex: 1;
    padding: 10px 14px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.3s ease;
}

.div-input-number:focus,
.div-input-text:focus {
    border-color: #4CAF50;
}

.div-input-button {
    padding: 10px 16px;
    font-size: 20px;
    background-color: #e0e0e0;
    color: #333;
    border: none;
    border-radius: 8px;
    cursor: not-allowed;
    transition: all 0.3s ease;
}

.div-input-button.is-activ {
    background-color: #4CAF50;
    color: #fff;
    cursor: pointer;
}

.div-input-button.is-activ:hover {
    background-color: #45a049;
}

.income-transion-div {
    width: 100%;
    margin-top: 20px;
}

.income-transion-text {
    font-size: 20px;
    font-weight: bold;
    color: #444;
    margin-bottom: 10px;
}

.income-transion-ul-date {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
}

.income-transion-li-date {
    margin-bottom: 30px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 16px;
    background-color: #fafafa;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

.income-transion-date {
    font-size: 18px;
    font-weight: 600;
    color: #555;
    margin-bottom: 15px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 8px;
}


.income-transion-ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.income-transion-li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f7f7f7;
    padding: 12px 16px;
    margin-bottom: 10px;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    cursor: pointer;
}

.income-edit-form {
    display: flex;
    gap: 10px;
    width: 100%;
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
    align-items: center;
    flex-wrap: wrap;
}

.income-edit-form-amout,
.income-edit-form-text {
    flex: 1;
    padding: 10px 14px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.3s ease;
    min-width: 120px;
}

.income-edit-form-amout:focus,
.income-edit-form-text:focus {
    border-color: #4CAF50;
}

.income-edit-button-aplya {
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 5px 10px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.income-edit-button-aplya:hover {
    background-color: #45a049;
}

.income-edit-button-cancellation {
    background-color: #ff5252;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 6px 11px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.income-edit-button-cancellation:hover {
    background-color: #d32f2f;
}

.income-display-view {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    width: 100%;
}

.income-display-view-text {
    display: flex;
    gap: 20px;
}

.income-display-view-text-amount {
    font-size: 16px;
    white-space: nowrap;
    font-weight: bold;
    color: green;
}

.income-display-view-text-text {
    font-size: 16px;
    color: #333;
    word-break: break-word;
    white-space: normal;
    overflow-wrap: break-word;
}

.income-display-view-button {
    display: flex;
    gap: 10px;
    align-items: center;
}

.income-display-view-button-change {
    background-color: #2196f3;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 5px 7px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.income-display-view-button-change:hover {
    background-color: #1976d2;
}

.income-display-view-button-remote {
    background-color: #ff5252;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.income-display-view-button-remote:hover {
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
  .div-input {
    flex-direction: column;
    gap: 12px;
  }

  .div-input-number,
  .div-input-text,
  .div-input-button {
    width: 100%;
  }

  .income-transion-li {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .income-edit-form {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .income-edit-form-amout,
  .income-edit-form-text {
    width: 100%;
  }

  .income-display-view {
    align-items: flex-start;
    gap: 8px;
  }

  .income-display-view-text {
    align-items: flex-start;
    gap: 20px;
  }

  .income-display-view-button {
    gap: 5px;
    justify-content: flex-start;
  }

  .income-transion-text {
    font-size: 18px;
    text-align: center;
  }

  .income-sum {
    font-size: 20px;
    text-align: center;
  }

  .income-section {
    padding: 20px;
  }
}

@media (max-width: 400px) {
  .income-sum {
    font-size: 18px;
  }

  .income-sum-income {
    font-size: 16px;
  }

  .div-input-number,
  .div-input-text {
    font-size: 14px;
    padding: 8px 12px;
  }

  .income-display-view-text-amount,
  .income-display-view-text-text {
    font-size: 12px;
  }

  .income-edit-button-aplya,
  .income-edit-button-cancellation,
  .income-display-view-button-change,
  .income-display-view-button-remote {
    font-size: 13px;
  }

  .income-transion-date {
    font-size: 16px;
  }
}

</style>