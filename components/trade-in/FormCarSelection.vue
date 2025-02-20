<template>
  <form @submit.prevent="submitForm" @keydown.enter.prevent="submitForm" class="sendform">
    <div class="wrap_credit_form">
      <div class="wrapper_credit_form_main">
        <div class="form_credit_inputs_title">Ваш автомобиль</div>
        <div class="wrap_input">
          <input type="text" name="user_brand" v-model="state.userBrand" placeholder="Марка" required>
        </div>
        <div class="wrap_input">
          <input type="text" name="user_model" v-model="state.userModel" placeholder="Модель" required>
        </div>
        <div class="wrap_input">
          <input type="text" name="year" v-model="state.userYear" placeholder="Год выпуска" required>
        </div>
        <div class="wrap_input">
          <input type="text" name="mileage" v-model="state.userMileage" placeholder="Пробег" required>
        </div>
        <div class="form_credit_inputs_title">Выберите автомобиль</div>
        <div class="top_credit_form">
          <CarSelection @update-model-details="updateModel" />
          <input type="hidden" name="utm" value="credit_form">
          <input name="ip" type="hidden" :value="state.userIp">
          <input type="hidden" name="_token" :value="state.csrfToken">
          <input type="hidden" name="utm_source" :value="state.utmSource">
          <input type="hidden" name="utm_medium" :value="state.utmMedium">
          <input type="hidden" name="utm_term" :value="state.utmTerm">
          <input type="hidden" name="utm_campaign" :value="state.utmCampaign">
          <input type="hidden" name="roistat" value="">
          <input type="hidden" name="client_id" value="">
          <input type="hidden" name="url" :value="state.currentUrl">
        </div>
        <div class="form_credit_inputs_title">Ваши данные</div>
        <div class="wrap_input input_credit divider">
          <input type="text" name="name" v-model="formData.name" placeholder="Ваше имя" required>
        </div>
        <div class="wrap_input input_credit">
          <input type="tel" name="phone" v-model="formData.phone" @input="formatPhone" placeholder="+7 (___) ___-__-__" required>
        </div>
        <label class="form_legacy_credit_page">
          <p><input type="checkbox" v-model="formData.acceptPolicy" required></p>
          <p>Я принимаю условия <nuxt-link :to="policyUrl" class="privacy_but">"Пользовательского соглашения"</nuxt-link></p>
        </label>
        <div class="wrap_input credit_form_button">
          <button type="submit">Отправить заявку</button>
        </div>
      </div>
      <CarInfo 
        :imageUrl="state.imageUrl" 
        :modelName="state.modelName" 
        :modelPriceOld="state.modelPriceOld" 
        :modelPriceNew="state.modelPriceNew" 
        :modelPriceMonth="state.modelPriceMonth" 
        :policyUrl="policyUrl" 
      />
      <TermsAndConditions />
    </div>
  </form>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import axios from 'axios';
import CarSelection from '../components/trade-in/CarSelection.vue';
import TermsAndConditions from '../components/trade-in/TermsAndConditions.vue';
import CarInfo from '../components/trade-in/CarInfo.vue';
import { useRouter } from 'vue-router';
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();
const router = useRouter();
const policyUrl = '/policy';
const state = reactive({
  userIp: '',
  csrfToken: '',
  currentUrl: '',
  utmSource: '',
  utmMedium: '',
  utmCampaign: '',
  utmTerm: '',
  userBrand: '',
  userModel: '',
  userYear: '',
  userMileage: '',
  imageUrl: '/img/not-found.png',
  modelName: 'Выберите автомобиль',
  modelPriceOld: 'от ... ₽',
  modelPriceNew: 'от ... ₽',
  modelPriceMonth: 'в кредит от ... /мес.',
});

const formData = reactive({
  name: '',
  phone: '',
  acceptPolicy: false,
});

const updateModel = (details) => {
  state.imageUrl = details.img;
  state.modelName = details.name;
  state.modelPriceOld = details.priceOld;
  state.modelPriceNew = details.priceNew;
  state.modelPriceMonth = details.priceMonth;
};

const getParameterByName = (name) => {
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

const fetchUserIp = async () => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    state.userIp = response.data.ip;
  } catch (error) {
    console.error('Ошибка при получении IP:', error);
  }
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    state.currentUrl = window.location.href;
    state.utmSource = getParameterByName('utm_source');
    state.utmMedium = getParameterByName('utm_medium');
    state.utmCampaign = getParameterByName('utm_campaign');
    state.utmTerm = getParameterByName('utm_term');
  }
  fetchUserIp();
});

const submitForm = async () => {
  // Получение CSRF-токена
  const metaCsrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  state.csrfToken = metaCsrfToken || '';

  // Подготовка данных для отправки
  const formDataObj = new URLSearchParams();
  Object.entries({ ...state, ...formData }).forEach(([key, value]) => {
    formDataObj.append(key, value);
  });

  try {
    await axios.post(`${config.public.baseUrl}/api/sendform`, formDataObj, {
      headers: { 'X-CSRF-TOKEN': state.csrfToken, 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      withCredentials: true,
    });
    router.push('/thanks');
  } catch (error) {
    console.error('Ошибка при отправке формы:', error.response?.data || error.message);
  }
};

const formatPhone = (event) => {
  let input = event.target.value.replace(/\D/g, '');
  const length = input.length;
  let formatted = '';

  if (length > 0) {
    formatted = '+7 ';
    if (length > 1) formatted += `(${input.slice(1, 4)}`;
    if (length > 4) formatted += `) ${input.slice(4, 7)}`;
    if (length > 6) formatted += `-${input.slice(7, 9)}`;
    if (length > 8) formatted += `-${input.slice(9, 11)}`;
  }

  formData.phone = formatted;
};
</script>