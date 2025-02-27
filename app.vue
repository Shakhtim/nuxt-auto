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
const metrikaScript = computed(() => {
  if (setting.value.IDmetrika) {
    return `
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
      (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
      
      ym(${setting.value.IDmetrika}, "init", {
          clickmap:true,
          trackLinks:true,
          accurateTrackBounce:true,
          webvisor:true
      });
    `;
  }
  return '';
});

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

onMounted(async () => {
  await fetchSettings();
  await fetchCsrfToken();
  await fetchReviews();
  isReviewsPage.value = route.path === '/reviews';
  const callElements = document.querySelectorAll('.call');
  callElements.forEach(element => {
    element.addEventListener('click', openModal);
  });

  useHead({
      title: 'Новые автомобили в Москве',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Купить новый автомобиль в Москве.' },
        { name: 'csrf-token', content: csrfToken.value }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/img/favicon.png' } 
      ],
      script: [
        {
          innerHTML: metrikaScript.value,
          type: 'text/javascript',
          async: true,
          body: true
        },
        {
          src: "https://app.uiscom.ru/static/cs.min.js",
          defer: true
        },
        {
          innerHTML: `var __cs = __cs || [];
          __cs.push(["setCsAccount", "_fNBgFxUoW3QUw4l3aTKYga14xXT7Ybx"]);`,
          type: 'text/javascript',
          async: true,
          body: true
        },
      ]
  });
});

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




provide('isModalVisible', isModalVisible);
provide('openModal', openModal);

</script>

