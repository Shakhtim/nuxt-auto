<template>
    <div class="middle_credit_form">
        <div class="middle_credit_form_left">
            <div class="credit_form_image_wrap">
            <div class="credit_form_image"><nuxt-img class="not_found_img" :src="`${imageUrl}`" :alt="`Китайское авто`"/></div>
            </div>
            <div class="credit_form_sliders">
            <div class="credit_form_sliders_label">Срок кредита месяцев <div class="srok_amount">24</div></div>
            <div class="slider-range-min" id="slider-range-min"></div>
            </div>
            <div class="credit_form_sliders credit_slider2">
            <div class="credit_form_sliders_label">Первоначальный взнос: <div class="vznos_amount_rub"></div> <div class="vznos_amount">30%</div></div>
            <div class="slider-range-min" id="slider-range-min2"></div>
            </div>
        </div>
        <div class="middle_credit_form_right">
        </div>
        </div>
        <div class="credit_form_right">
        <div class="credit_form_image_info">
            <div class="credit_form_image_info_title">{{ modelName }}</div>
            <div class="credit_form_image_info_description">Стоимость автомобиля:</div>
            <div class="credit_form_image_info_price">
            <div class="cred_price_old"><span>{{ modelPriceOld }}</span></div>
            <div class="cred_price_new" :data-price="modelPriceNew">{{ modelPriceNew }}</div>
            <div class="cred_price_month">{{ modelPriceMonth }}</div>
            </div>
        </div>
        </div>
        <div class="credit_offers_block">
        <div class="item">
            <img src="/img/icons/offer-icon-1.svg" alt="">
            <div class="credit_offers_block_title">Отправь заявку</div>
        </div>
        <div class="item">
            <img src="/img/icons/delimetr.svg" alt="">
        </div>
        <div class="item">
            <img src="/img/icons/offer-icon-2.svg" alt="">
            <div class="credit_offers_block_title">Получи одобрение</div>
        </div>
        <div class="item">
            <img src="/img/icons/delimetr.svg" alt="">
        </div>
        <div class="item">
            <img src="/img/icons/offer-icon-3.svg" alt="">
            <div class="credit_offers_block_title">Приезжай за автомобилем</div>
        </div>
        </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  imageUrl: {
    type: String,
    default: '/img/not-found.png',
  },
  modelName: {
    type: String,
    default: 'Выберите автомобиль',
  },
  modelPriceOld: {
    type: String,
    default: 'от ... ₽',
  },
  modelPriceNew: {
    type: String,
    default: 'от ... ₽',
  },
  modelPriceMonth: {
    type: String,
    default: 'в кредит от ... /мес.',
  },
  policyUrl: {
    type: String,
    default: '/policy',
  },
});
</script>