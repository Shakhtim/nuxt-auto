<template>
    <div>
      <div class="container page_title">
        Спецпредложения
      </div>
        <swiper :slides-per-view="4" :space-between="30" class="container popular live cars_container"
        :breakpoints="{
          1024: { slidesPerView: 4 },
          768: { slidesPerView: 2 },
          640: { slidesPerView: 1 }
        }">
        <swiper-slide v-for="car in liveCars" :key="car.slug" class="car">
          <nuxt-link :href="getCarLink(car)" :title="car.title"></nuxt-link>
          <div class="car_title">
            {{ car.brand.title }} {{ car.title }} 
            <span>В кредит от {{ credit_rate }}%</span>
          </div>
          <div class="car_image">
            <nuxt-img 
                v-if="getLiveImage(car)" 
                :src="`/img/cars/${getLiveImage(car).image}`" 
                :alt="getLiveImage(car).alt || car.title" 
              />
          </div>
          <div class="car_price_rrc">
            от {{ formatPrice(car.complectations[0].price) }} ₽
          </div>
          <div class="car_price_new">
            от {{ formatPrice(car.complectations[0].price_new) }} ₽
            <span style="color: #8080803d; padding: 0;">*</span>
          </div>
          <div class="car_credit">
            кредит от {{ formatPrice(calculateMonthlyPayment(car.complectations[0].price_new, 6.2, 84)) }} ₽
          </div>
        </swiper-slide >
      </swiper >
    </div>
  </template>
  
  <script setup>
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import 'swiper/swiper-bundle.css';
  
  const props = defineProps({
    liveCars: {
      type: Array,
      required: true,
    },
    formatPrice: {
      type: Function,
      required: true,
    },
    calculateMonthlyPayment: {
      type: Function,
      required: true,
    },
    credit_rate: {
      type: Number,
      required: true,
    },
    getCarLink: {
      type: Function,
      required: true,
    },
    getLiveImage: {
      type: Function,
      required: true,
    },
  });
  </script>


  