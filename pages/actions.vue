<template>
    <div class="container">
      <div class="page_title">
        Акции
      </div>
      <div class="action-container">
        <div v-for="item in actions" :key="item.id" class="gossapp_block">
          <div class="wrap_goss_image">
            <img :src="`/img/${item.image}`" alt="">
          </div>
          <div class="goss_form">
            <div class="wrap_goss_descr">
              <div class="big_goss">
                <span v-html="item.title"></span>
              </div>
              <span class="action-desc" v-html="item.content"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRuntimeConfig } from '#app';

  const config = useRuntimeConfig();
  const actions = ref([]);

  const fetchActions = async() => {
    try {
        const response = await axios.get(`${config.public.baseUrl}/api/page/get-actions`);
        actions.value = response.data;
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        throw new Error('Не удалось загрузить данные');
    }
  }
  
  onMounted(() => {
    fetchActions();
  });

  useHead({
        title: 'Акции на новый автомобиль в Москве',
        meta: [
            { name: 'description', content: 'Купить новый автомобиль по акции в Москве.' },
            { property: 'og:title', content: 'Акции на новый автомобиль в Москве' },
            { property: 'og:description', content: 'Купить новый автомобиль по акции в Москве.' }
        ]
    });
  </script>
  
  