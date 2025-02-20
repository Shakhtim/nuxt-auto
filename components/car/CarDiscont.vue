<template>
    <div class="car_page_discount">Выгода до {{ formatPrice(car.getDiscount) }} ₽</div>
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
});

const formatPrice = (price) => {
  return props.setting.numberFormat(price);
};
</script>
  