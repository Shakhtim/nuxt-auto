<template>
    <div>
      <div class="container page_title">
        Отзывы наших клиентов
      </div>
      <swiper :slides-per-view="2" :space-between="30" class="container reviews reviews-slider"
      :modules="[Autoplay]"
      :autoplay="{
        delay: 2000,
        disableOnInteraction: false,
      }"
      :breakpoints="{
          '240': {
            slidesPerView: 1,
            spaceBetween: 40,
          },
          '768': {
            slidesPerView: 2,
            spaceBetween: 50,
          },
        }">
        <swiper-slide v-for="(review, index) in reviews" :key="index" class="review">
          <div class="review__img">
            <img :src="`/img/reviews/mini/${review.image}`" alt="">
          </div>
          <div class="review__info">
            <div class="review__info-client">
              <div class="name">{{ review.author }}</div>
              <div class="stars">
                <div>
                  <img 
                    v-for="star in review.stars" 
                    :key="star" 
                    src="/img/icons/review-star.svg" 
                    alt="">
                </div>
                <div class="date">{{ formatDate(review.custom_date) }}</div>
              </div>
              <div class="text">{{ review.content }}</div>
            </div>
            <div class="review__info-more">
              <nuxt-link :to="`/reviews#${index + 1}`">Читать подробнее</nuxt-link>
              <img src="/img/icons/review-more.svg" alt="">
            </div>
          </div>
          <nuxt-link :href="`/reviews#${index + 1}`" class="review-wrap"></nuxt-link>
        </swiper-slide>
      </swiper>
    </div>
  </template>
  
<script setup>
import {  Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

// Определяем props
const props = defineProps({
  reviews: {
    type: Array,
    required: true,
  },
});

// Функция для форматирования даты
const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
};
</script>

  