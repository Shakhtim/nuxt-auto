<template>
    <form @submit.prevent="submitForm" @keydown.enter="submitForm" class="sendform">
            <div class="wrap_credit_form">
              <div class="wrapper_credit_form_main">
                <div class="form_credit_inputs_title">Выберите автомобиль</div>
                <div class="top_credit_form">
  
                  <CarSelection @update-model-details="updateModel"/>
                    
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

                  <div class="form_credit_inputs_title">Ваши данные</div>
                  <div class="wrap_input input_credit divider">
                    <input type="text" name="name" v-model="formData.name" placeholder="Ваше имя" required>
                  </div>
                  <div class="wrap_input input_credit">
                    <input type="tel" name="phone" v-model="formData.phone" @input="formatPhone" placeholder="+7 (___) ___-__-__" required>
                  </div>
  
                  <label class="form_legacy_credit_page">
                    <p><input type="checkbox" checked required></p>
                    <p>Я принимаю условия <nuxt-link :to="policyUrl" class="privacy_but">"Пользовательского соглашения"</nuxt-link></p>
                  </label>
  
                  <div class="wrap_input credit_form_button">
                    <button type="submit">Отправить заявку</button>
                  </div>
  
                </div>
              </div>
              <CarInfo 
                :imageUrl="imageUrl" 
                :modelName="modelName" 
                :modelPriceOld="modelPriceOld" 
                :modelPriceNew="modelPriceNew" 
                :modelPriceMonth="modelPriceMonth" 
                :policyUrl="policyUrl" 
                />
              <TermsAndConditions/>
            </div>
          </form>
</template>   

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import CarSelection from '../components/credit/CarSelection.vue';
import TermsAndConditions from '../components/credit/TermsAndConditions.vue';
import CarInfo from '../components/credit/CarInfo.vue';
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();
const imageUrl = ref('/img/not-found.png');
const modelName = ref('Выберите автомобиль');
const modelPriceOld = ref('от ... ₽');
const modelPriceNew = ref('от ... ₽');
const modelPriceMonth = ref('в кредит от ... /мес.');
const policyUrl = '/policy';
const router = useRouter();
const formData = ref({ name: '', phone: ''});
const userIp = ref('');
const csrfToken = ref('');
const currentUrl = ref(''); 
const utmSource = ref('');
const utmMedium = ref('');
const utmCampaign = ref('');
const utmTerm = ref('');

const updateModel = ({img, name, priceOld, priceNew, priceMonth }) => {
    imageUrl.value = img;
    modelName.value = name;
    modelPriceOld.value = priceOld ;
    modelPriceNew.value = priceNew ;
    modelPriceMonth.value = priceMonth ;
};

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
    router.push('/thanks');
  } catch (error) {
    console.error('Ошибка при отправке формы:', error.response?.data || error.message);
  }
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