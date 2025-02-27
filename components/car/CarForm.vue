<template>
    <div class="container car_form">
      <div class="car_form_thumbnails">
        <div
        v-for="(item, key) in car.images.filter(image => image.type === 'colors')"
        :key="item.id" 
        :class="['thumbnail', { active: selectedColorIndex === key }]"
        :style="{ backgroundColor: item.description ? item.description.split('^^^')[1] : 'transparent' }"
        :data-title="item.description ? item.description.split('^^^')[0] : 'Нет данных'"
        :data-src="`cars/${item.image}`"
        @click="selectColor(key)"
      ></div>
      </div>
      <div class="car_form_inputs">
        <div class="car_form_action_date">Акция до {{ actionEndDate }}</div>
        <form @submit.prevent="submitForm" @keydown.enter="submitForm" class="sendform">
          <div class="car_form_wrap_timer">
            <div class="car_form_wrap_timer_text">
              <div class="cfi_text">Автокредит от <span>{{ setting.credit_rate }}%</span></div>
              <div class="clock2">
                {{ countdownText }}
              </div>
              <div id="countdown" class="countdown-text">
                <div class="countdown-item">
                  <div class="countdown-title">Дней</div>
                  <div class="countdown-value">{{ days }}</div>
                </div>
                <div class="countdown-item">
                  <div class="countdown-title">Часов</div>
                  <div class="countdown-value">{{ hours }}</div>
                </div>
                <div class="countdown-item">
                  <div class="countdown-title">Минут</div>
                  <div class="countdown-value">{{ minutes }}</div>
                </div>
                <div class="countdown-item">
                  <div class="countdown-title">Секунд</div>
                  <div class="countdown-value">{{ seconds }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="car_form_inputs_wrap">
            <div class="wrap_input">
              <input type="text" name="name" v-model="formData.name" placeholder="Ваше имя" required>
              <input type="hidden" name="utm" value="credit_form_car">
              <input name="ip" type="hidden" :value="userIp">
              <input type="hidden" name="_token" :value="csrfToken">
              <input type="hidden" name="utm_source" :value="utmSource">
              <input type="hidden" name="utm_medium" :value="utmMedium">
              <input type="hidden" name="utm_term" :value="utmTerm">
              <input type="hidden" name="utm_campaign" :value="utmCampaign">
              <input type="hidden" name="roistat" value="">
              <input type="hidden" name="client_id" value="">
              <input type="hidden" name="url" :value="currentUrl">
            </div>
            <div class="wrap_input">
              <input type="tel" name="phone" v-model="formData.phone" @input="formatPhone" placeholder="+7 (___) ___-__-__" required>
            </div>
            <div class="wrap_input">
              <button type="submit">Получить предложение</button>
            </div>
          </div>
          <div class="form_legacy_detail_page">
              <label class="checkbox-elem">
              <input type="checkbox" required v-model="form.agree"/>
              Я принимаю условия <nuxt-link :href="policyUrl" class="privacy_but">"Пользовательского соглашения"</nuxt-link>
              и даю свое согласие на обработку моих персональных данных, а также ознакомлен с условиями продажи и финансовых программ.
              <span class="checkmark"></span>
            </label>
          </div>
        </form>
      </div>
    </div>
  </template>
  
<script setup>
import { ref, computed, onMounted, onBeforeUnmount, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
const emit = defineEmits();
import axios from 'axios';
import { useRuntimeConfig } from '#app';

const props = defineProps({
  car: {
    type: Object,
    required: true,
  },
  setting: {
    type: Object,
    required: true,
  },
  getColorImage: {
    type: Function,
    required: true,
  },
});

const config = useRuntimeConfig();
const form = ref({
  name: '',
  phone: '',
  agree: true,
});
const selectedColorIndex = ref(0);
const router = useRouter();
const policyUrl = computed(() => router.resolve({ name: 'policy' }).href);
const formData = ref({ name: '', phone: ''});
const userIp = ref('');
const csrfToken = ref('');
const currentUrl = ref(''); 
const utmSource = ref('');
const utmMedium = ref('');
const utmCampaign = ref('');
const utmTerm = ref('');

const selectedColorImage = computed(() => {
  return props.car.images.filter(image => image.type === 'colors')[selectedColorIndex.value];
});
const actionEndDate = computed(() => {
  const nextSunday = calculateNextSunday();
  const options = { day: 'numeric', month: 'long' };
  return nextSunday.toLocaleDateString('ru-RU', options);
});
const countdown = ref(86400); // Пример значения (1 день в секундах)

const days = computed(() => Math.floor(countdown.value / (3600 * 24)));
const hours = computed(() => Math.floor((countdown.value % (3600 * 24)) / 3600));
const minutes = computed(() => Math.floor((countdown.value % 3600) / 60));
const seconds = computed(() => countdown.value % 60);

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

const selectColor = (index) => {
  selectedColorIndex.value = index;
  emit('color-selected', selectedColorImage.value); 
};

const calculateNextSunday = () => {
  const now = new Date();
  const nextSunday = new Date();

  nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7);
  nextSunday.setHours(23, 59, 0, 0);

  if (now.getDay() === 0 && now.getHours() >= 23 && now.getMinutes() >= 59) {
    nextSunday.setDate(nextSunday.getDate() + 7);
  }

  return nextSunday;
};

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

const startCountdown = () => {
  const endDate = calculateNextSunday();
  countdown.value = Math.floor((endDate - Date.now()) / 1000);

  const interval = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(interval);
      startCountdown();
    }
  }, 1000);
};

onMounted(() => {
  startCountdown();
});

onBeforeUnmount(() => {
  clearInterval(countdown.value);
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
  
<style>
.countdown-text {
  display: flex;
  gap: 10px;
  color: white;   /* Устанавливаем цвет текста на белый */
  text-align: center; /* Центрируем текст */
  background-color: #0099DA; /* Добавляем полупрозрачный черный фон для контраста */
  padding: 20px;  /* Добавляем отступы вокруг текста */
  border-radius: 10px; /* Скругляем углы */
  line-height: 1.5; /* Увеличиваем межстрочный интервал для лучшей читаемости */
}

.countdown-title {
  font-size: 16px;
}

.countdown-value {
  font-size: 45px;
}

.countdown-item {
  margin: 10px 0; /* Отступы между элементами */
}
</style>