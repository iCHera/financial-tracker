import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const useTransactionsStore = defineStore('transactions', () => {

  const STORAGE_KEY = 'financial-tracker-state';
  const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY));

  const transactions = ref(savedState?.transactions || [])
  const accounts = ref(savedState?.accounts || [])
  const activeAccountId = ref(savedState?.activeAccountId || null)

  // посчитанный баланс на всех счетах 
  const accountsWithBalance = computed(() => {
    return accounts.value.map((account) => { 
      const balance = transactions.value
      .filter(t => t.accountID === account.id)
      .reduce((acc, t) => acc + t.amount, 0)

      return {...account, balance: balance}
    })
  })

  // активный аккаунт
  const activeAccountData = computed(() => {
    return accountsWithBalance.value.find(account => account.id === activeAccountId.value)
  })
  
  // активный аккаунт для транзакций
  const activeAccountTransactions = computed(() => { 
    if(!activeAccountId.value) return []
    return transactions.value.filter(t => t.accountID === activeAccountId.value)
  })

  // общий баланс у активного аккаунта
  const activeAccountBalance = computed(() => { 
    return activeAccountTransactions.value.reduce((acc, transactions) => acc + transactions.amount, 0)
  }) 

  // общий доход у активного аккаунта
  const activeAccountIncome = computed(() => { 
    return activeAccountTransactions.value
    .filter(t => t.amount > 0)
    .reduce((acc, transactions) => acc + transactions.amount, 0)
  })

  // общий расход у активного аккаунта
  const activeAccountExpense = computed(() => { 
    return activeAccountTransactions.value
    .filter(t => t.amount < 0)
    .reduce((acc, transactions) => acc + transactions.amount, 0)
  })

  // общий расход
  const totalBalance = computed(() => { 
    return accountsWithBalance.value.reduce((acc, t) => acc + t.balance, 0)
  })

  // создание нового аккаунта
  function addAccount(name, currency) { 
    accounts.value.push({
      id: Date.now(), 
      name: name, 
      currency: currency,
    })
  }

  // изменение выбраного счета
  function setActiveAccount (accountID) { 
    activeAccountId.value = accountID
  }

  // функция добавление транзакции
  function addTransaction(transactionData) { 
    transactions.value.push({ 
      id: Date.now(),
      text: transactionData.text, 
      amount: transactionData.amount,
      date: new Date().toISOString().split('T')[0], 
      accountID: transactionData.accountID,
    })
  }

  // функция для изменения транзакции
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

  // удаление аккаунта
  function deleteAccount() { 
    const accountIdToDelete = activeAccountId.value
    if (!accountIdToDelete) return;

    accounts.value = accounts.value.filter(t => t.id !== accountIdToDelete)
    transactions.value = transactions.value.filter(t => t.accountID !== accountIdToDelete)

    activeAccountId.value = accounts.value.length > 0 ? accounts.value[0].id : null;
  }

  // обновление аккаунта 
  function updateAccount(updatedData) {
    
    const accountIdToUpdate = activeAccountId.value;
    if (!accountIdToUpdate) return;

    const accountIndex = accounts.value.findIndex(acc => acc.id === accountIdToUpdate)

    if (accountIndex !== -1) { 
      accounts.value[accountIndex].name = updatedData.name;
      accounts.value[accountIndex].currency = updatedData.currency 
    }
  }

  // localStorege
  const entireState = computed(() => ({
      transactions: transactions.value,
      accounts: accounts.value,
      activeAccountId: activeAccountId.value
  }));

  watch(entireState, (newState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }, { deep: true });

  return {
    // State 
    transactions,
    accounts,
    activeAccountId,

    // Getters 
    totalBalance,
    accountsWithBalance,
    activeAccountBalance,
    activeAccountIncome,
    activeAccountExpense,
    activeAccountData,
    activeAccountTransactions,

    addTransaction,
    deleteTransaction,
    updateTransaction,
    addAccount,
    setActiveAccount, 
    deleteAccount,
    updateAccount,
   }
})
