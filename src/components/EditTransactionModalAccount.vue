<script setup>

    import { ref } from 'vue'
    import { useTransactionsStore } from '@/stores/transactions';

    const store = useTransactionsStore()

    const props = defineProps({ 
        transaction: {
            type: Object,
            required: true,
        }
    })

    const emit = defineEmits(['close', 'save', 'delete'])

    const editName = ref(props.transaction.name)
    const currencies = ref(['BYN', 'RUB', 'USD', 'EUR']);
    const selectedCurrency = ref(props.transaction.currency); 

    function onSave() { 
        emit('save', { 
            name: editName.value,
            currency: selectedCurrency.value
        })
    }

    function onDelete() { 
        emit('delete')
    }

</script>

<template>
    <div class="modal-overlay" @click.self="emit('close')">

    <div class ="modal-content">
      
      <h2 class="modal-text">Редактировать счет</h2>

      <form @submit.prevent="onSave" class="modal-form">
        
        <div class="form-group">
          <label for="account-name" class="name-account">Название счета</label>
          <input 
            type="text" 
            v-model="editName" 
            id="account-name" 
            placeholder="Например, Карта"
            class="input-name"
          />
        </div>

        <div class="form-group">
            <label for="account-currency">Валюта</label>
            <select v-model="selectedCurrency" id="account-currency">
                <option v-for="currency in currencies" :key="currency" :value="currency">
                    {{ currency }}
                </option>
            </select>
        </div>

        <div class="form-group">
            <label class="now-balance">Текущий баланс (нередактируемый)</label>
            <p class="current-balance">{{ props.transaction.balance.toFixed(2) }} {{ props.transaction.currency }}</p>
        </div>

        <div class="modal-actions">
          <button type="button" @click="onDelete" class="btn-delete">Удалить</button>
          <div class="main-actions">
            <button type="button" @click="emit('close')" class="btn-cancel">X</button>
            <button type="submit" class="btn-save">✏️</button>
          </div>
        </div>

      </form>
    </div>
  </div>
</template>

<style scoped>

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: #ffffff;
  padding: 30px 24px;
  border-radius: 16px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.modal-text {
  font-size: 22px;
  font-weight: 500;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 18px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

.input-name,
select {
  width: 100%;
  padding: 10px 14px;
  font-size: 16px;
  border-radius: 10px;
  border: 1px solid #ccc;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  outline: none;
}

.input-name:focus,
select:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 4px rgba(76, 175, 80, 0.5);
}

.current-balance {
  margin-top: 6px;
  font-size: 16px;
  color: #333;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  align-items: center;
}

.btn-delete {
  background-color: #e53935;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 2px 6px rgba(229, 57, 53, 0.3);
}

.btn-delete:hover {
  background-color: #c62828;
  transform: scale(1.03);
}

.main-actions {
  display: flex;
  gap: 10px;
}

.btn-cancel,
.btn-save {
  padding: 10px 16px;
  font-size: 15px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: white;
}

.btn-cancel {
  background-color: #f44336;
}

.btn-cancel:hover {
  background-color: #d32f2f;
}

.btn-save {
  background-color: #4CAF50;
}

.btn-save:hover {
  background-color: #45a049;
}



</style>