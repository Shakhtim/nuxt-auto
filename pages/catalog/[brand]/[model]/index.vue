<template>
      <div class="car_page">
        <CarDetails 
            :car="model" 
            :setting="setting" 
            :formatPrice="formatPrice" 
            :calculateMonthlyPayment="calculateMonthlyPayment" 
            :getColorImage="getColorImage" 
            :getLiveImage="getLiveImage" 
            :selectedColorImage="selectedColorImage"
            v-if="model" 
        />
        <CarForm v-if="model" 
        :car="model" 
        :setting="setting" 
        :getColorImage="getColorImage" 
        @color-selected="updateSelectedColor" 
        />
      </div>
        <CarSpecifications 
          v-if="model" 
          :car="model" 
          :setting="setting" 
          :formatPrice="formatPrice" 
          :calculateMonthlyPayment="calculateMonthlyPayment" 
        />
        <CarGallery v-if="model" :photos="filteredImages" />
      <CheaperForm />
      <VideoReview v-if="model" :rutubeId="model.rutube_id" />
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import CarDetails from '~/components/car/CarDetails.vue';
  import CheaperForm from '~/components/CheaperForm.vue';
  import axios from 'axios'; 
  import { useRuntimeConfig } from '#app';

  const config = useRuntimeConfig();
  const route = useRoute();
  const model = ref(null);
  const loading = ref(true);
  const error = ref(null);
  
  // Функция для получения данных о модели
  async function fetchModelData() {
    const { brand, model: modelSlug } = route.params;
    try {
      const response = await axios.get(`${config.public.baseUrl}/api/cars/get-by-slug/${brand}/${modelSlug}`);
      model.value = response.data;
    } catch (error) {
      console.error('Ошибка при получении популярных автомобилей:', error);
    }
  }
  
  onMounted(() => {
    fetchModelData();

    const brandSlug = capitalizeFirstLetter(route.params.brand);
    const modelSlug = capitalizeFirstLetter(route.params.model);

    useHead({
      title: `Купить новый ${brandSlug} ${modelSlug} в Москве - комплектации, цены`,
      meta: [
        { name: 'description', content: `Новые автомобили ${brandSlug} ${modelSlug} в Москве - комплектации, цены.` },
      ]
    });
  });
  
  const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  // Дополнительные данные и методы
  const popularCars = ref([]);
  const liveCars = ref([]);
  const apiSetting = ref({});
  const setting = {
    credit_rate: 6.2,
    numberFormat: (value) => new Intl.NumberFormat('ru-RU').format(value),
  };
  const selectedColorImage = ref(null);

  // Методы
  const formatPrice = (price) => {
    return setting.numberFormat(price);
  };
  
  const calculateMonthlyPayment = (price, annualRate, months) => {
    const monthlyRate = annualRate / 100 / 12; 
    const monthlyPayment = (monthlyRate * price) / (1 - Math.pow(1 + monthlyRate, -months));
    return Math.round(monthlyPayment); 
  };
  
  const getColorImage = (car) => {
    if (car.images && Array.isArray(car.images)) {
      const colorImage = car.images.find(image => image.type === 'colors');
      return colorImage || null; 
    }
    return null;
  };
  
  const getLiveImage = (car) => {
    if (car.images && Array.isArray(car.images)) {
      const liveImage = car.images.find(image => image.type === 'live');
      return liveImage || null; 
    }
    return null;
  };
  
  // Вызов дополнительных функций при монтировании
  const fetchPopularCars = async () => {
    try {
      const response = await axios.get(`${config.public.baseUrl}/api/cars/get-popular-models`); 
      popularCars.value = response.data;
    } catch (error) {
      console.error('Ошибка при получении популярных автомобилей:', error);
    }
  };
  
  const fetchLiveCars = async () => {
    try {
      const response = await axios.get(`${config.public.baseUrl}/api/cars/get-live-models`); 
      liveCars.value = response.data;
    } catch (error) {
      console.error('Ошибка при получении популярных автомобилей:', error);
    }
  };
  
  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${config.public.baseUrl}/api/settings/get-all-settings`);
      apiSetting.value = response.data[0];
    } catch (error) {
      console.error('Ошибка при получении настроек:', error);
    }
  };
  
  const updateSelectedColor = (image) => {
    selectedColorImage.value = image; 
  };

  const filteredImages = computed(() => {
    if (model.value && model.value.images) {
      return model.value.images.filter(image => image.type === 'exterior' || image.type === 'interior');
    }
    return [];
  });
  
  // Вызов дополнительных функций при монтировании
  onMounted(() => {
    fetchPopularCars();
    fetchLiveCars();
    fetchSettings();
  });

  </script>
