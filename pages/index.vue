<template>
  <BrandList />
  <HitCars 
    :popularCars="popularCars" 
    :formatPrice="formatPrice" 
    :calculateMonthlyPayment="calculateMonthlyPayment" 
    :credit_rate="setting.credit_rate" 
    :getCarLink="getCarLink" 
    :getColorImage="getColorImage" 
  />
  <CheaperForm />
  <LiveCars 
    :liveCars="liveCars" 
    :formatPrice="formatPrice" 
    :calculateMonthlyPayment="calculateMonthlyPayment" 
    :credit_rate="setting.credit_rate" 
    :getCarLink="getCarLink" 
    :getLiveImage="getLiveImage" 
  />
  <ContactsBlock :apiSetting="apiSetting" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BrandList from '~/components/BrandList.vue';
import HitCars from '~/components/HitCars.vue';
import CheaperForm from '~/components/CheaperForm.vue';
import LiveCars from '~/components/LiveCars.vue';
import ContactsBlock from '~/components/ContactsBlock.vue';
import axios from 'axios';
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();
const popularCars = ref([]);
const liveCars = ref([]);
const apiSetting = ref({});
const setting = {
  credit_rate: 6.2,
  numberFormat: (value) => {
    return new Intl.NumberFormat('ru-RU').format(value);
  },
};

const fetchPopularCars = async () => {
  try {
    const response = await axios.get(`${config.public.baseUrl}/api/cars/get-popular-models`);
    popularCars.value = response.data;
  } catch (error) {
    console.error('Ошибка при получении популярных автомобилей:', error);
  }
}

const fetchLiveCars = async () => {
  try {
    const response = await axios.get(`${config.public.baseUrl}/api/cars/get-live-models`);
    liveCars.value = response.data;
  } catch (error) {
    console.error('Ошибка при получении живых автомобилей:', error);
  }
}

const fetchSettings = async () => {
  try {
    const response = await axios.get(`${config.public.baseUrl}/api/settings/get-all-settings`);
    apiSetting.value = response.data[0];
  } catch (error) {
    console.error('Ошибка при получении настроек:', error);
  }
}

const getCarLink = (car) => {
  return `/catalog/${car.brand.slug}/${car.slug}`;
}

const formatPrice = (price) => {
  return setting.numberFormat(price);
}

const calculateMonthlyPayment = (price, annualRate, months) => {
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPayment = (monthlyRate * price) / (1 - Math.pow(1 + monthlyRate, -months));
  return Math.round(monthlyPayment);
}

const getColorImage = (car) => {
  if (car.images && Array.isArray(car.images)) {
    return car.images.find(image => image.type === 'colors') || null;
  }
  return null;
}

const getLiveImage = (car) => {
  if (car.images && Array.isArray(car.images)) {
    return car.images.find(image => image.type === 'live') || null;
  }
  return null;
}

onMounted(() => {
  fetchPopularCars();
  fetchLiveCars();
  fetchSettings();

  useHead({
    title: `Новые автомобили в Москве`,
    meta: [
      { name: 'description', content: 'Купить новый автомобиль в Москве.' },
    ],
  });
});
</script>

