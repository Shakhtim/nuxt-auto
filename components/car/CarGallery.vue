<template>
    <div class="container">
      <div class="car_page_tabs_2">
        <div class="car_page_tab_2 car_tab_main_info_2 active">Фотогалерея</div>
      </div>
      <div class="car_photos">
        <div v-for="(photoArr, index) in chunkedPhotos" :key="index" class="car_wrap_photos_block">
          <div v-for="photo in photoArr" :key="photo.id" class="car_photo_image" :data-mfp-src="`/img/cars/${photo.image}`">
            <nuxt-img :src="`/img/cars/${photo.image}`" alt="" />
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  photos: {
    type: Array,
    required: true,
  },
});

const chunkedPhotos = computed(() => {
  const chunkSize = 3;
  const chunks = [];
  for (let i = 0; i < props.photos.length; i += chunkSize) {
    chunks.push(props.photos.slice(i, i + chunkSize));
  }
  return chunks;
});
</script>
