<template>
  <div v-if="isModalVisible" class="wrap_callback_popup" style="display: block">
    <div class="callback_main_form_title">Обратный звонок</div>
    <form @submit.prevent="submitForm" @keydown.enter="submitForm" class="sendform">
      <input type="hidden" name="utm" value="credit_form">
      <input name="ip" type="hidden" :value="userIp">
      <input type="hidden" name="_token" :value="csrfToken">
      <input type="hidden" name="utm_source" :value="utmSource">
      <input type="hidden" name="utm_medium" :value="utmMedium">
      <input type="hidden" name="utm_term" :value="utmTerm">
      <input type="hidden" name="utm_campaign" :value="utmCampaign">
      <input type="hidden" name="roistat" value="">
      <input type="hidden" name="client_id" value="">
      <input type="hidden" name="url" :value="currentUrl">
      <div class="wrap_input">
        <input type="text" v-model="formData.name" placeholder="ФИО" required>
      </div>
      <div class="wrap_input">
        <input type="tel" v-model="formData.phone" @input="formatPhone" required placeholder="+7 (___) ___-__-__">
      </div>
      <label class="form_legacy_credit_page">
        <p><input type="checkbox" v-model="formData.accepted" required checked></p>
        <p>Я принимаю условия <nuxt-link :to="policyUrl" class="privacy_but">"Пользовательского соглашения"</nuxt-link></p>
      </label>
      <div class="wrap_input">
        <button type="submit">Отправить</button>
      </div>
    </form>
    <div class="close" @click="closeForm">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M13 12l5-5-1-1-5 5-5-5-1 1 5 5-5 5 1 1 5-5 5 5 1-1z"></path>
      </svg>
    </div>
  </div>
  <div class="dark" v-if="isModalVisible" @click="closeForm" style="display: block"></div>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();
const props = defineProps({
  isModalVisible: Boolean,
  close: Function
});
const router = useRouter();
const formData = ref({ name: '', phone: ''});
const userIp = ref('');
const csrfToken = ref('');
const policyUrl = '/policy';
const currentUrl = ref(''); 
const utmSource = ref('');
const utmMedium = ref('');
const utmCampaign = ref('');
const utmTerm = ref('');

const fetchUserIp = async () => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    userIp.value = response.data.ip;
  } catch (error) {
    console.error('Ошибка при получении IP:', error);
  }
};

const getParameterByName = (name) =>  {
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    currentUrl.value = window.location.href;
    utmSource.value = getParameterByName("utm_source");
    utmMedium.value = getParameterByName("utm_medium");
    utmCampaign.value = getParameterByName("utm_campaign");
    utmTerm.value = getParameterByName("utm_term");
  }
  fetchUserIp();
});

const submitForm = async () => {
  const metaCsrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  csrfToken.value = metaCsrfToken || '';

  const formDataObj = new URLSearchParams();
  Object.entries({ ...formData.value, _token: csrfToken.value, utm: 'credit_form', ip: userIp.value, url: currentUrl.value}).forEach(([key, value]) => {
    formDataObj.append(key, value);
  });

  try {
    const response = await axios.post(`${config.public.baseUrl}/api/sendform`, formDataObj, {
      headers: { 'X-CSRF-TOKEN': csrfToken.value, 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      withCredentials: true
    });
    closeForm();
    router.push('/thanks');
  } catch (error) {
    console.error('Ошибка при отправке формы:', error.response?.data || error.message);
  }
};

const closeForm = () => {
  props.close();
};

const formatPhone = (event) => {
  const input = event.target.value.replace(/\D/g, '');
  const length = input.length;
  let formatted = '';

  if (length > 0) {
    formatted = '+7 ';
    if (length > 1) formatted += `(${input.slice(1, 4)}`;
    if (length > 4) formatted += `) ${input.slice(4, 7)}`;
    if (length > 6) formatted += `-${input.slice(7, 9)}`;
    if (length > 8) formatted += `-${input.slice(9, 11)}`;
  }

  formData.value.phone = formatted;
};



</script>