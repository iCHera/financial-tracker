import { ref, watch } from 'vue';
import { defineStore } from 'pinia';

export const useCurrencyStore = defineStore('currency', () => {

  const mainCurrency = ref(localStorage.getItem('mainCurrency') || 'USD');

  const rates = ref({});

async function fetchRates() {
    const API_KEY = '0b7638b25dec2aa598f68521'; 

    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${mainCurrency.value}`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();

        if (data.result === 'success') {
            rates.value = data.conversion_rates;
        } else {
            throw new Error(data['error-type']);
        }

    } catch (error) {
        console.error("Не удалось загрузить курсы валют:", error);
    }
}

  function setMainCurrency(currency) {
    mainCurrency.value = currency;
    fetchRates(); 
  }

  watch(mainCurrency, (newCurrency) => {
    localStorage.setItem('mainCurrency', newCurrency);
  });

  fetchRates();

  return {
    mainCurrency,
    rates,
    setMainCurrency,
    fetchRates
  };
});