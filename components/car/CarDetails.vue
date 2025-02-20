<template>
      <div class="container car_grid">
        <div class="car_grid_first">
          <div class="car_page_title">
            <h1>{{ car.custom_h1 || `${car.brand.title} ${car.title}` }}</h1>
          </div>
          <div class="car_page_img car_image">
            <nuxt-img 
              v-if="selectedColorImage" 
              :src="`/img/cars/${selectedColorImage.image}`" 
              :alt="selectedColorImage.alt || car.title" 
            />
            <nuxt-img 
              v-else-if="getColorImage(car)" 
              :src="`/img/cars/${getColorImage(car).image}`" 
              :alt="getColorImage(car).alt || car.title" 
            />
          </div>
          </div>
          <div class="car_grid_third">
            <div class="car_page_price_rrc">
              от {{ formatPrice(car.complectations[0].price) }} ₽
            </div>
            <div class="car_page_price"> от {{ formatPrice(car.complectations[0].price_new) }} ₽</div>
            <div class="car_page_credit">
              В кредит от <span>{{ formatPrice(calculateMonthlyPayment(car.complectations[0].price_new, 6.2, 84)) }}</span> ₽/мес.
            </div>
            <div class="detail_characters_grid">
              <div>
                <div v-if="car.acceleration_time" class="car_tech_item">
                  <img src="/img/icons/model-char-1.svg" alt="" /> Разгон до 100 км/ч {{ car.acceleration_time }} c
                </div>
                <div v-else class="car_tech_item">
                  <img src="/img/icons/model-char-1.svg" alt="" /> Нет данных о разгоне
                </div>
                
                <div v-if="car.specifications_main[0].horse_power" class="car_tech_item">
                  <img src="/img/icons/model-char-2.svg" alt="" /> Мощность {{ car.specifications_main[0].horse_power }} л/c
                </div>
                <div v-else class="car_tech_item">
                  <img src="/img/icons/model-char-2.svg" alt="" /> Нет данных о мощности
                </div>
              </div>
              <div>
                <div v-if="car.specifications_main[0].gas_mileage_city" class="car_tech_item">
                  <img src="/img/icons/model-char-3.svg" alt="" /> Расход на 100 км {{ car.specifications_main[0].gas_mileage_city }} л
                </div>
                <div v-else class="car_tech_item">
                  <img src="/img/icons/model-char-3.svg" alt="" /> Нет данных о расходе
                </div>
                
                <div v-if="car.specifications_main[0].max_speed" class="car_tech_item">
                  <img src="/img/icons/model-char-4.svg" alt="" /> Макс. скорость {{ car.specifications_main[0].max_speed }} км/ч
                </div>
                <div v-else class="car_tech_item">
                  <img src="/img/icons/model-char-4.svg" alt="" /> Нет данных о максимальной скорости
                </div>
              </div>
            </div>
            <div class="car_page_discount">Выгода до {{ formatPrice(car.discount) }} ₽</div>
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
  setting: {
    type: Object,
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
  getColorImage: {
    type: Function,
    required: true,
  },
  selectedColorImage: {
    type: Object,
    default: null,
  },
});
</script>
  