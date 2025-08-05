<script setup>
    import { useTransactionsStore } from '@/stores/transactions'
    import {ref, computed} from 'vue'
    import EditTransactionModalAccount from './EditTransactionModalAccount.vue'
    import { useCurrencyStore } from '@/stores/currency';

    const store = useTransactionsStore()
    const currencyStore = useCurrencyStore();
    const name = ref('')
    const button = ref(false)
    const currencies = ref(['BYN', 'RUB', 'USD', 'EUR']);
    const selectedCurrency = ref('BYN'); 

    const transactionToEdit  = ref(null);

    const otherAccounts = computed(() => { 
        return store.accountsWithBalance
        .filter(t => t.id !== store.activeAccountId)
    })

    function showCreateForm() { 
        button.value = true;
    }

    function hideCreateForm() {
        button.value = false;
    }

    function handleAddNewAccount() { 
        if (!name.value.trim()) { 
            alert(`Укадите название вашего счета!`)
            return 
        }

        store.addAccount(name.value, selectedCurrency.value) 
        name.value = ''
        selectedCurrency.value = 'BYN';
        hideCreateForm()
    }

    function openModalWindow() { 
      if (store.activeAccountData) {
        transactionToEdit.value = {...store.activeAccountData}
      }

      console.log(`все передалось`)
    }

    // закрытие модального окна
    function closeModalWindow() { 
      transactionToEdit.value = null
    }

    // сохранение изменений
    function saveEditModal(updateData) { 

        if (!updateData.name.trim()) {
            alert("Название счета не может быть пустым.");
            return;
        }

        store.updateAccount({ 
          name: updateData.name,
          currency: updateData.currency,
        })

        closeModalWindow()
    }

    //удаление аккаунта 
    function deleteAccount() { 
      store.deleteAccount()
      closeModalWindow()
    }

</script>

<template>
    <section class="account">

        <div class="currency-selector">
          <div class="balance-info">
            <span class="account-balance">
              Общий баланс:
              <span class="balance" 
                :class="{'plus': store.totalBalance > 0, 'minus': store.totalBalance < 0}">
                {{ store.totalBalance.toFixed(2) }}
              </span>
            </span>
          </div>

          <div class="custom-select-wrapper">
            <select 
              id="main-currency"
              :value="currencyStore.mainCurrency"
              @change="currencyStore.setMainCurrency($event.target.value)"
              class="currency-select">

              <option v-for="c in currencies" :key="c" :value="c" class="currency-select-text">{{ c }}</option>

          </select>
          </div>

        </div>

        <h1 class="select-account-text">Выбранный счет:</h1>
        <div class="select-accont" @click="openModalWindow">
            <h1 class="selecte-balance-name">Название: {{ store.activeAccountData?.name }}</h1>

            <h1 class="balance-account">Баланс: 
                <span class="selecte-balance"
                :class="{'plus': store.activeAccountBalance > 0}, {'minus': store.activeAccountBalance <0}">
                {{ store.activeAccountData?.balance.toFixed(2) }}
                </span> 
            <span class="selecte-currency">{{ store.activeAccountData?.currency }}</span>
            </h1>
        </div>
        
        <div class="accounts-div">
            <h1 class="other-account-text">Остальные счета:</h1>

            <ul class="other-account-ul">
                <li class="other-account-li"
                v-for="account in otherAccounts"
                :key="account.id"
                @click="store.setActiveAccount(account.id)"
                >

                    <h1 class="other-account-name">{{ account.name }}</h1>
                    <h1 class="other-account-balance" 
                    :class="{'other-account-balance-plus': account.balance > 0}, 
                    {'other-account-balance-minus': account.balance <0 }">{{ account.balance.toFixed(2) }} {{ account.currency }} </h1>

                </li>
            </ul>
        </div>

        <div class="create-account">
            <div class="create">
                <h1 class="create-account-text">Создать новый счет</h1>
                <button class="button-create" @click="showCreateForm">+</button>
            </div>

            <div class="create-input" v-if="button"> 

                <form @submit.prevent="handleAddNewAccount">

                <input type="text" placeholder="Введите название счета" v-model="name">

                <div class="custom-select-wrapper2">
                  <select v-model="selectedCurrency" class="currency-select2">
                    <option v-for="currency in currencies" :key="currency" :value="currency" class="currency-select-text"> {{ currency }} </option>
                 </select>

                </div>

                 <div class="create-buttons">
                    <button type="button" class="cancellation-button" @click="hideCreateForm">Отменить</button>
                    <button type="submit" class="create-button">Сохранить</button>
                 </div>

                </form>

            </div>

        </div>

    </section>

    <EditTransactionModalAccount
    v-if="transactionToEdit"
    :transaction="transactionToEdit"
    @close="closeModalWindow"
    @save="saveEditModal"
    @delete="deleteAccount"
    />

</template>

<style scoped>
.account {
  max-width: 600px;
  margin: 0 auto;   
  padding: 30px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.account-balance {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 20px;
  color: #333;
  white-space: nowrap;
}

.currency-selector {
  background-color: #f9f9f9;
  padding: 18px 20px;
  border-radius: 14px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

.balance-info {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.custom-select-wrapper {
  position: relative;
  display: inline-block;
}

.custom-select-wrapper2{ 
  position: relative;
}

.currency-select {
  -webkit-appearance: none; 
  -moz-appearance: none;    
  appearance: none;
  color: black;
  padding: 8px 30px 8px 7px; 
  border: 0px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-size: 16px;
  cursor: pointer;
  font-family: 'Segoe UI Light', 'Helvetica Neue Light', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 500;
}

.currency-select2{ 
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  color: black;
  padding: 8px 30px 8px 12px;
  border: 0px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-size: 16px;
  cursor: pointer;
  font-family: 'Segoe UI Light', 'Helvetica Neue Light', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 500;
}

.currency-select:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 4px rgba(76, 175, 80, 0.4);
}


.balance {
  font-weight: 500;
}

.plus {
  color: #4CAF50;
}

.minus {
  color: #f44336;
}

.select-account-text{ 
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 15px;
  color: #333;
}

.select-accont {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
  cursor: pointer;
}

.selecte-balance-name,
.balance-account {
  font-size: 16px;
  font-weight: 500;
  color: #444;
}

.selecte-balance {
  font-weight: 500;
}

.selecte-currency {
  font-size: 14px;
  color: #666;
  margin-left: 6px;
}

.accounts-div {
  margin-bottom: 30px;
}

.other-account-text {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 15px;
  color: #333;
}

.other-account-ul {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.other-account-li {
  padding: 14px 18px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease;
}

.other-account-li:hover {
  background-color: #f0f0f0;
}

.other-account-name {
  font-weight: 500;
  font-size: 16px;
  color: #333;
}

.other-account-balance {
  font-weight: 500;
  font-size: 16px;
}

.other-account-balance-plus{
    color: #4CAF50;
}

.other-account-balance-minus  {
    color: #f44336;
}

.create-account {
  margin-top: 30px;
}

.create {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.create-account-text {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.button-create {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button-create:hover {
  background-color: #45a049;
}

.create-input {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.create-input input,
.create-input select {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-bottom: 12px;
  font-size: 15px;
  transition: border-color 0.3s ease;
}

.create-input input:focus,
.create-input select:focus {
  outline: none;
  border-color: #4CAF50;
}

.create-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.create-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.create-button:hover {
  background-color: #45a049;
}

.cancellation-button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cancellation-button:hover {
  background-color: #d32f2f;
}

@media (max-width: 600px) { 
  .account-balance { 
    font-size: 16px;
  }

  .currency-select{ 
    padding: 5px 5px;
  }
}

</style>