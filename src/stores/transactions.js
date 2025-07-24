import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useTransactionsStore  = defineStore('transactions', () => {

  const transactions = ref([])

  // общий баланс 
  const totalBalance = computed(() => { 
    return transactions.value.reduce((acc, transactions) =>{
      return acc + transactions.amount
    }, 0)
  }) 

  // общий доход 
  const totalIncome = computed(() => { 
    return transactions.value
    .filter(t => t.amount > 0)
    .reduce((acc, transactions) => acc + transactions.amountm, 0)
  })

  // общий расход 
  const totalExpense = computed(() => { 
    return transactions.value
    .filter(t => t.amount < 0)
    .reduce((acc, transactions) => acc + transactions.amount, 0)
  })

  // функция добавление транзакции
  function addTransaction(transactionData) { 
    transactions.value.push({ 
      id: new Date(),
      text: transactionData.text, 
      amount: transactionData.amount
    })
  }

  function updateTransaction(transactionId, updatedData) { 
    const currentTransactions = transactions.value 

    const updatedTransactions = currentTransactions.map((transaction) => {
      if (transaction.id === transactionId) return {... transaction, ... updatedData}
      else return transaction
    })
    transactions.value = updatedTransactions
  }

  //функция удаления транзакции
  function deleteTransaction(transactionID) { 
    transactions.value = transactions.value.filter(t => t.id !== transactionID);
  }

  return {
    transactions,
    totalBalance,
    totalIncome,
    totalExpense,
    addTransaction,
    deleteTransaction,
    updateTransaction,
   }
})
