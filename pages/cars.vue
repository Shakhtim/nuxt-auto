<template>
  <div>
    <nuxt-link to="/">Главная</nuxt-link>
    <h1>Список автомобилей</h1>
    <ul>
      <li v-for="car in cars" :key="car.id">
        {{ car.title }} 
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();
const cars = ref([]);

const fetchCars = async() => {
  try {
    const response = await axios.get(`${config.public.baseUrl}/api/cars/get-public-models`);
    cars.value = response.data;
  } catch (error) {
    console.error('Ошибка при получении автомобилей:', error);
  }
} 

onMounted(() => {
  fetchCars();
})

</script>

