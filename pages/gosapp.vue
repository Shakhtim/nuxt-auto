<template>
    <div class="container">
      <div class="page_title">
        Госпрограммы
      </div>
      <div class="gossapp">
        <div v-for="item in gosapps" :key="item.id" class="gossapp_block">
          <div class="wrap_goss_image">
            <img :src="`/img/${item.image}`" alt="">
          </div>
          <div class="goss_form">
            <div class="wrap_goss_descr">
              <div class="big_goss" v-html="item.title"></div>
            </div>
            <ul v-html="item.content"></ul>
          </div>
        </div>
      </div>
      <div class="gossapp_form">
        <FormGosapp />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import FormGosapp from '~/components/gosapp/FormGosapp.vue';
  import { useRuntimeConfig } from '#app';

  const config = useRuntimeConfig();
  const gosapps = ref([]);
  
  const fetchGosapps = async() => {
    try {
        const response = await axios.get(`${config.public.baseUrl}/api/page/get-gosapp`);
        gosapps.value = response.data;
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        throw new Error('Не удалось загрузить данные');
    }
  }
  
  onMounted(() => {
    fetchGosapps();
  });

    useHead({
        title: 'Госпрограммы на новый автомобиль в Москве',
        meta: [
            { name: 'description', content: 'Купить новый автомобиль с возможностью использования госпрограммы в Москве.' },
            { property: 'og:title', content: 'Госпрограммы на новый автомобиль в Москве' },
            { property: 'og:description', content: 'Купить новый автомобиль с возможностью использования госпрограммы в Москве.' }
        ]
    });
</script>

  