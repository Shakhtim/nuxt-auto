<template>
  <div class="container pd15">
    <h1 class="h1_contacts_title">Контакты</h1>

    <div class="new-contact-wrap" v-if="setting">
      <div class="contacts_top_info_1">
        <div class="item item_address">
          <div class="label">Адрес:</div>
          <div class="item_description">{{ setting.address }}</div>
        </div>
        <div class="item">
          <div class="label">Телефон:</div>
          <div class="item_description">
            <a :href="'tel:' + setting.phone">{{ setting.phone }}</a>
          </div>
        </div>
        <div class="item">
          <div class="label">График работы:</div>
          <div class="item_description">{{ setting.schedule }} ежедневно</div>
        </div>
        <div class="item">
          <div class="label">Электронная почта:</div>
          <div class="item_description">
            <a :href="'mailto:' + setting.email">{{ setting.email }}</a>
          </div>
        </div>
        <div class="item item_address">
          <div class="label">Юр. Лицо:</div>
          <div class="item_description">ООО "СТАТУС"</div>
        </div>
        <div class="item item_address">
          <div class="label">ИНН</div>
          <div class="item_description">9728097964</div>
        </div>
        <div class="item item_address">
          <div class="label">КПП</div>
          <div class="item_description">772801001</div>
        </div>
        <div class="item item_address">
          <div class="label">ОГРН</div>
          <div class="item_description">1237700394260</div>
        </div>
        <div class="item">
          <div class="label">Юр. Адрес:</div>
          <div class="item_description">
            119421 г. Москва вн. Тер. Г. муниципальный округ Обручевский, пр-кт Ленинский д. 111 к. 1 помещ. 24н
          </div>
        </div>
      </div>

      <div class="contact_wrap_photos_block">
        <div class="contact_photo_image"
          v-for="(image, index) in images"
          :key="index"
          @click="() => showImg(index)"
        >
        <img :src="image.src" :alt="image.alt" />
        </div>

        <VueEasyLightbox
          :visible="visibleRef"
          :imgs="images"
          :index="indexRef"
          @hide="onHide"
        />
      </div>

      <div class="contact_form-1">
        <div class="new-contact-call1">Обратная связь</div>
        <div class="new-contact-call2">Служба контроля качества</div>
        <FormContacts/>
      </div>
    </div>

    <div class="map" id="map" v-if="setting"></div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import FormContacts from '../components/contacts/FormContacts.vue';
import VueEasyLightbox from 'vue-easy-lightbox';
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();
const setting = ref(null);
const visibleRef = ref(false);
const indexRef = ref(0);

const images = ref([
  { src: '/img/contact_1.webp', alt: 'Фото 1' },
  { src: '/img/contact_2.webp', alt: 'Фото 2' },
  { src: '/img/contact_3.webp', alt: 'Фото 3' },
  { src: '/img/contact_4.webp', alt: 'Фото 4' }
]);

const showImg = (index) => {
  indexRef.value = index;
  visibleRef.value = true;
};
const onHide = () => (visibleRef.value = false);

 const fetchSettings = async() => {
  try {
    const response = await axios.get(`${config.public.baseUrl}/api/settings/get-all-settings`);
    setting.value = response.data[0];
    loadMap();
  } catch (error) {
    console.error('Ошибка при получении настроек:', error);
  }
} 

const loadMap = () => {
  if (window.ymaps && setting.value) {
    window.ymaps.ready(function () {
      var myMap = new window.ymaps.Map('map', {
        center: [setting.value.latitude, setting.value.longitude],
        zoom: 14,
      }, {
        searchControlProvider: 'yandex#search'
      });

      var MyIconContentLayout = window.ymaps.templateLayoutFactory.createClass(
        '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
      );

      var myPlacemarkWithContent = new window.ymaps.Placemark([setting.value.latitude, setting.value.longitude], {
        hintContent: `Автосалон ${setting.value.title}`,
        balloonContent: `<b>Автосалон ${setting.value.title}</b><br>м. ${setting.value.address}`,
        iconContent: ''
      }, {
        iconLayout: 'default#imageWithContent',
        iconImageSize: [50, 55],
        iconImageOffset: [-25, -26],
        iconContentLayout: MyIconContentLayout
      });

      myMap.geoObjects.add(myPlacemarkWithContent);
      myMap.behaviors.disable('scrollZoom');
    });
  } else {
    console.error('ymaps не загружен или настройки не доступны');
  }
}

// Функция для загрузки скрипта Яндекс.Карт
const loadYandexMapsScript = () => {
  return new Promise((resolve, reject) => {
    if (window.ymaps) {
      resolve();
    } else {
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
      script.async = true;
      script.onload = () => {
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    }
  });
}

onMounted(async () => {
  await loadYandexMapsScript();
  await fetchSettings();
});

useHead({
  title: 'Контакты автосалона',
  meta: [
    { name: 'description', content: 'Можете связаться с нашим автосалоном.' },
    { property: 'og:title', content: 'Контакты автосалона' },
    { property: 'og:description', content: 'Можете связаться с нашим автосалоном.' }
  ]
});
</script>
