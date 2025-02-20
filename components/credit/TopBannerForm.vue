<template>
    <div class="top_credit">
        <div class="container">
          <div class="top_credit_big">Специальные условия</div>
          <div class="top_credit_middle">на покупку китайских производителей автомобилей в кредит</div>
  
          <form @submit.prevent="submitForm" @keydown.enter="submitForm" class="sendform">
            <div class="top_credit_form_first">
                <input type="hidden" name="utm" value="credit_form">
                <input type="hidden" name="brand" value="">
                <input type="hidden" name="car" id="carmodel" value="">
                <input type="hidden" name="price" id="car_price" value="">
                <input name="ip" type="hidden" :value="userIp">
                <input type="hidden" name="_token" :value="csrfToken">
                <input type="hidden" name="utm_source" :value="utmSource">
                <input type="hidden" name="utm_medium" :value="utmMedium">
                <input type="hidden" name="utm_term" :value="utmTerm">
                <input type="hidden" name="utm_campaign" :value="utmCampaign">
                <input type="hidden" name="roistat" value="">
                <input type="hidden" name="client_id" value="">
              <div class="wrap_input">
                <input type="text" v-model="formData.name" placeholder="ФИО" required>
              </div>
              <div class="wrap_input">
                <input type="tel" v-model="formData.phone" @input="formatPhone" placeholder="+7 (___) ___-__-__" required>
              </div>
              <div class="wrap_input">
                <button type="submit">Получить предложение</button>
              </div>
            </div>
            <div class="form_legacy">
              <label class="checkbox-elem">
                <input type="checkbox" checked required>
                Я принимаю условия <nuxt-link :to="policyUrl" class="privacy_but">"Пользовательского соглашения"</nuxt-link>
                <span class="checkmark"></span>
              </label>
            </div>
          </form>
        </div>
      </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();
const router = useRouter();
const formData = ref({ name: '', phone: '', comment: '' });
const policyUrl = '/policy';
const currentUrl = ref(''); 
const utmSource = ref('');
const utmMedium = ref('');
const utmCampaign = ref('');
const utmTerm = ref('');
const userIp = ref('');
const csrfToken = ref('');

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

const fetchUserIp = async () => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    userIp.value = response.data.ip;
  } catch (error) {
    console.error('Ошибка при получении IP:', error);
  }
};

const clearFields = () => {
  formData.value.name = '';
  formData.value.phone = '';
  formData.value.comment = '';  
}
const getParameterByName = (name) =>  {
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

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
    clearFields();
    router.push('/thanks');
  } catch (error) {
    console.error('Ошибка при отправке формы:', error.response?.data || error.message);
  }
};

onMounted(async () => {
  if (typeof window !== 'undefined') {
    currentUrl.value = window.location.href;
    utmSource.value = getParameterByName("utm_source");
    utmMedium.value = getParameterByName("utm_medium");
    utmCampaign.value = getParameterByName("utm_campaign");
    utmTerm.value = getParameterByName("utm_term");
  }
  fetchUserIp();
});

</script>
