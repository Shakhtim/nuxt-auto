<template>
    <div v-if="car.rutube_id" class="rutube-car" :data-id="car.rutube_id">
      <div class="container">
        <div class="car_page_tabs_2">
          <div class="car_page_tab_2 car_tab_main_info_2 active youtube-title">Видеообзор</div>
        </div>
        <div class="youtube-video rutube-video">
          <iframe width="100%" height="500" :src="`https://rutube.ru/play/embed/${car.rutube_id}/`" frameborder="0" allow="clipboard-write; autoplay" allowfullscreen></iframe>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    car: {
      type: Object,
      required: true,
    },
  });
  </script>
  