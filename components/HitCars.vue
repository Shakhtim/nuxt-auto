<template>
  <div>
    <section class="bg" style="padding-top: 40px;">
      <div class="container" style="background: url('/img/new-year.webp') no-repeat center/contain; height: 465px;"></div>
    </section>
    <div class="container page_title">
      Популярные модели
    </div>
    <div class="container all_cars">
      <div class="wrap_cars">
        <div class="car" v-for="car in popularCars" :key="car.id">
          <nuxt-link :href="getCarLink(car)" :title="car.title">{{ car.title }}</nuxt-link>
          <div class="car_title">
            {{ car.brand.title }} {{ car.title }} <span>В кредит от 6.2%</span>
          </div>
          <div class="car_image">
            <nuxt-img 
              v-if="getColorImage(car)" 
              :src="`/img/cars/${getColorImage(car).image}`" 
              :alt="getColorImage(car).alt || car.title" 
              loading="lazy" 
            />
            <nuxt-img  
              v-else
              :src="`/img/cars/${defaultImage}`"
              :alt="car.title" 
            />
          </div>
          <div class="car_price_rrc"> от {{ formatPrice(car.complectations[0].price) }} ₽</div>
          <div class="car_price_new">от {{ formatPrice(car.complectations[0].price_new) }} ₽<span style="color: #8080803d; padding:0;">*</span></div>
          <div class="car_credit">кредит от {{ formatPrice(calculateMonthlyPayment(car.complectations[0].price_new, 6.2, 84)) }} ₽</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  popularCars: {
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
  getColorImage: {
    type: Function,
    required: true,
  },
});

const defaultImage = ref('/1634564349-3.png');

</script>

