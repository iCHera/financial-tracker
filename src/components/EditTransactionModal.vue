<script setup>
import { ref } from 'vue';
import { useTransactionsStore } from '@/stores/transactions';

const store = useTransactionsStore()

const props = defineProps({
  transaction: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'save']);

const editText = ref(props.transaction.text);
const editAmount = ref(props.transaction.amount);
const deleteObject = props.transaction.id

function onSave() {
  emit('save', {
    ...props.transaction, 
    text: editText.value,
    amount: parseFloat(editAmount.value)
  });
}

function onDelete() { 
    store.deleteTransaction(deleteObject)
}
</script>

<template>
    <div class="modal-overlay" @click.self="emit('close')">
        <div class="modal-content">
        <h2>Редактировать транзакцию</h2>

        <form @submit.prevent="onSave">
            <div class="form-group">
            <label for="amount">Сумма</label>
            <input type="number" v-model="editAmount" id="amount" placeholder="Введите сумму"/>
            </div>
            <div class="form-group">
            <label for="text">Описание</label>
            <input type="text" v-model="editText" id="text" placeholder="Введите текст"/>
            </div>

         <div class="modal-actions">
            <button @click="onDelete" class="delete-object"> Удалить </button>
            <div class="div-button">
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

.modal-content h2 {
  font-size: 22px;
  font-weight: bold;
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

input {
  width: 100%;
  padding: 10px 14px;
  font-size: 16px;
  border-radius: 10px;
  border: 1px solid #ccc;
  transition: border-color 0.3s ease;
  outline: none;
}

input:focus {
  border-color: #4CAF50;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
}

.delete-object {
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

.btn-cancel { 
  padding: 10px 16px;
  font-size: 15px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.div-button{ 
    display: flex;
    gap: 10px;
}

.btn-save {
  padding: 10px 10px;
  font-size: 15px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background-color: #f44336;
  color: white;
}

.btn-cancel:hover {
  background-color: #d32f2f;
}

.btn-save {
  background-color: #4CAF50;
  color: white;
}

.btn-save:hover {
  background-color: #45a049;
}

input[type=number] {
    -moz-appearance: textfield;
}

</style>
