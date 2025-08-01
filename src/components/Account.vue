<script setup>
    import { useTransactionsStore } from '@/stores/transactions'
    import {ref, computed} from 'vue'

    const store = useTransactionsStore()
    const name = ref('')
    const button = ref(false)
    const currencies = ref(['BYN', 'RUB', 'USD', 'EUR']);
    const selectedCurrency = ref('BYN'); 

    const otherAccounts  = computed(() => { 
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

</script>

<template>
    <section class="account">
        <h1 class="account-balance">Общий баланс счетов: <span class="balance" 
            :class="{'plus': store.totalBalance > 0}, {'minus': store.totalBalance < 0}">
            {{ store.totalBalance.toFixed(2) }}</span>
        </h1>

        <div class="select-accont">
            <h1 class="selecte-balance-name">Название выбранного счета: {{ store.activeAccountData?.name }}</h1>

            <h1 class="balance-account">Баланс выбраного счета: 
                <span class="selecte-balance"
                :class="{'plus': store.activeAccountBalance > 0}, {'minus': store.activeAccountBalance <0}">
                {{ store.activeAccountData?.balance.toFixed(2) }}
                </span> 
            <span class="selecte-currency">{{ store.activeAccountData?.currency }}</span>
            </h1>
        </div>
        
        <div class="accounts-div">
            <h1 class="other-account-text">Отсальные счета:</h1>

            <ul class="other-account-ul">
                <li class="other-account-li"
                v-for="account in otherAccounts"
                :key="account.id"
                @click="store.setActiveAccount(account.id)"
                >

                    <h1 class="other-account-name">{{ account.name }}</h1>
                    <h1 class="other-account-balance">{{ account.balance.toFixed(2) }}</h1>

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

                <select v-model="selectedCurrency">
                    <option v-for="currency in currencies" :key="currency" :value="currency"> {{ currency }} </option>
                 </select>

                 <div class="create-buttons">
                    <button type="button" class="cancellation-button" @click="hideCreateForm">Отменить</button>
                    <button type="submit" class="create-button">Сохранить</button>
                 </div>

                </form>

            </div>

        </div>

    </section>

</template>

<style scoped>
.account {
  max-width: 600px;
  margin: 0 auto;   
  padding: 30px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.account-balance {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.balance {
  font-weight: bold;
  margin-left: 10px;
}

.plus {
  color: #4CAF50;
}

.minus {
  color: #f44336;
}

.select-accont {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
}

.selecte-balance-name,
.balance-account {
  font-size: 16px;
  margin-bottom: 10px;
  color: #444;
}

.selecte-balance {
  font-weight: bold;
  margin-left: 8px;
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
  font-weight: 600;
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
  font-weight: bold;
  font-size: 16px;
  color: #4CAF50;
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
  font-weight: 600;
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

</style>