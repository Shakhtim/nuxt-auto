<template>
  <section class="grey">
    <div class="container grey_full">
      <div class="brands" style="flex-wrap: wrap;">
        <div
          class="wrap_brand"
          v-for="brand in brands"
          :key="brand.id"
          style="margin: 0px 30px; padding-top: 10px;"
        >
          <nuxt-link :to="'/catalog/' + brand.slug">
            <nuxt-img :src="`/img/${brand.logotype}`" :alt="brand.title" />
          </nuxt-link>
          <div class="brand_title">{{ brand.title }}</div>
        </div>
      </div>
    </div>

    <div class="container grey_mobile">
      <Swiper
        :slides-per-view="slidesPerView"
        :space-between="30"
        class="brands"
      >
        <SwiperSlide
          v-for="(chunk, index) in brandChunks"
          :key="index"
        >
          <div class="wrap_brand" v-for="brand in chunk" :key="brand.id">
            <nuxt-link :to="'/catalog/' + brand.slug">
              <nuxt-img :src="`/img/${brand.logotype}`" :alt="brand.title" />
            </nuxt-link>
            <div class="brand_title">{{ brand.title }}</div>
            <div class="brand_count">{{ getRandomCount() }} авто</div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRuntimeConfig } from '#app';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';

const config = useRuntimeConfig();
const brands = ref([]);

// Функция для получения брендов
const fetchBrands = async () => {
  try {
    const response = await axios.get(`${config.public.baseUrl}/api/brands/get-public-brands`);
    brands.value = response.data;
  } catch (error) {
    console.error('Ошибка при получении брендов:', error);
  }
};

// Функция для получения случайного числа между 8 и 20
const getRandomCount = () => {
  return Math.floor(Math.random() * (20 - 8 + 1)) + 8;
};

// Вычисляемое свойство для разбиения брендов на чанки
const brandChunks = computed(() => {
  const chunkSize = 6;
  const chunks = [];
  for (let i = 0; i < brands.value.length; i += chunkSize) {
    chunks.push(brands.value.slice(i, i + chunkSize));
  }
  return chunks;
});

// Вычисляемое свойство для определения количества слайдов на экране
const slidesPerView = computed(() => {
  return window.innerWidth < 768 ? 1 : 6; // 1 слайд для мобильных, 6 для десктопа
});


onMounted(() => {
  fetchBrands();
});
</script>

<style scoped>
.grey_mobile .swiper-slide {
  display: grid !important;
  grid-template-columns: 1fr 1fr 1fr;
}

</style>
