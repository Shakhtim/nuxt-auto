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
        <form @submit.prevent="submitForm" class="sendform">
          <div class="car_form_wrap_timer">
            <div class="car_form_wrap_timer_text">
              <div class="cfi_text">Автокредит от <span>{{ setting.credit_rate }}%</span></div>
              <!-- Countdown Timer -->
              <div class="clock2"></div>
              {{ countdownText }}
            </div>
          </div>
          <div class="car_form_inputs_wrap">
            <div class="wrap_input">
              <input type="text" v-model="form.name" placeholder="ФИО" required />
              <input type="hidden" name="utm" value="model_timer" />
              <!-- <input type="hidden" name="ip" :value="setting.getUserIpAddr()" /> -->
              <input type="hidden" name="brand" :value="car.brand.title" />
              <input type="hidden" name="car" :value="car.title" />
              <input type="hidden" name="price" id="car_price" :value="car.price" />
            </div>
            <div class="wrap_input">
              <input type="tel" v-model="form.phone" required placeholder="+7(___)___-__-__" />
            </div>
            <div class="wrap_input">
              <button type="submit">Получить предложение</button>
            </div>
          </div>
          <div class="form_legacy_detail_page">
              <label class="checkbox-elem">
              <input type="checkbox" v-model="form.agree" required checked="checked"/>
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

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

const form = ref({
  name: '',
  phone: '',
  agree: false,
});
const selectedColorIndex = ref(0);
const countdown = ref(null);

const router = useRouter();
const policyUrl = computed(() => router.resolve({ name: 'policy' }).href);
const selectedColorImage = computed(() => {
  return props.car.images.filter(image => image.type === 'colors')[selectedColorIndex.value];
});
const actionEndDate = computed(() => {
  const nextSunday = calculateNextSunday();
  const options = { day: 'numeric', month: 'long' };
  return nextSunday.toLocaleDateString('ru-RU', options);
});
const countdownText = computed(() => {
  if (!countdown.value) return '00:00:00:00'; 
  const days = Math.floor(countdown.value / (3600 * 24));
  const hours = Math.floor((countdown.value % (3600 * 24)) / 3600);
  const minutes = Math.floor((countdown.value % 3600) / 60);
  const seconds = countdown.value % 60;
  return `${days} дн. ${hours} ч. ${minutes} мин. ${seconds} сек.`;
});

const submitForm = () => {
  console.log('Форма отправлена');
};

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
</script>
  