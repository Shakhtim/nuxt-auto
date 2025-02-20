<template>
  <Header :setting="setting" :menuItems="menuItems" />
  <NuxtPage />
  <ReviewBlock :reviews="reviews" v-if="!isReviewsPage" />
  <Footer :setting="setting" />
  <Modal :isModalVisible="isModalVisible" :close="closeModal"/>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import Header from '~/components/Header.vue';
import Footer from '~/components/Footer.vue';
import ReviewBlock from '~/components/ReviewBlock.vue';
import Modal from '~/components/Modal.vue';
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();
const setting = ref({});
const reviews = ref([]);
const route = useRoute();
const isReviewsPage = ref(false);
const isModalVisible = ref(false);
const csrfToken = ref('');

const menuItems = ref([
  { title: 'Главная', link: '/' },
  { title: 'Автокредит', link: '/credit' },
  { title: 'Trade-in', link: '/trade-in' },
  { title: 'Госпрограммы', link: '/gosapp' },
  { title: 'Акции', link: '/actions' },
  { title: 'Отзывы', link: '/reviews' }, 
  { title: 'Контакты', link: '/contacts' }
]);

async function fetchSettings() {
  try {
    const response = await axios.get(`${config.public.baseUrl}/api/settings/get-all-settings`);
    setting.value = response.data[0]; 
  } catch (error) {
    console.error('Ошибка при получении настроек:', error);
  }
}

async function fetchReviews() {
  try {
    const response = await axios.get(`${config.public.baseUrl}/api/review/get-reviews`);
    reviews.value = response.data; 
  } catch (error) {
    console.error('Ошибка при получении отзывов:', error);
  }
}

const openModal = () => {
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

onMounted(() => {
  fetchSettings();
  fetchCsrfToken();
  fetchReviews();
  isReviewsPage.value = route.path === '/reviews';
  const callElements = document.querySelectorAll('.call');
  callElements.forEach(element => {
    element.addEventListener('click', openModal);
  });
});

// Отслеживаем изменения маршрута
watch(route, (newRoute) => {
  isReviewsPage.value = newRoute.path === '/reviews';
});

const fetchCsrfToken = async () => {
  try {
    const response = await axios.get(`${config.public.baseUrl}/sanctum/csrf-cookie`);    
    csrfToken.value = response.data.csrf_token;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
};

useHead({
  title: 'Новые автомобили в Москве',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'Купить новый автомобиль в Москве.' },
    { name: 'csrf-token', content: csrfToken }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/img/favicon.ico' }
  ]
});
</script>

