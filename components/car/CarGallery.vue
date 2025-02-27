<template>
  <div class="container">
    <div class="car_page_tabs_2">
      <div class="car_page_tab_2 car_tab_main_info_2 active">Фотогалерея</div>
    </div>
    <div class="car_photos">
      <div v-for="(photoArr, index) in chunkedPhotos" :key="index" class="car_wrap_photos_block">
        <div v-for="photo in photoArr" :key="photo.id" class="car_photo_image" @click="() => showImg(index, photoArr)">
          <nuxt-img :src="`/img/cars/${photo.image}`" :alt="photo.alt" />
        </div>
      </div>

      <VueEasyLightbox
        :visible="visibleRef"
        :imgs="images"
        :index="indexRef"
        @hide="onHide"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import VueEasyLightbox from 'vue-easy-lightbox';

const visibleRef = ref(false);
const indexRef = ref(0);
const images = ref([]);

const showImg = (index, photoArr) => {
  images.value = photoArr.map(photo => `/img/cars/${photo.image}`);
  indexRef.value = index;
  visibleRef.value = true; 
};

const onHide = () => {
  visibleRef.value = false; 
};

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
