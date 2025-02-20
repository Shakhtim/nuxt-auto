<template>
    <div class="container address_front">
      <div class="address_front_left">
        <div class="a_address">
          <span>Адрес:</span>
          {{ apiSetting.address }}
        </div>
        <div class="a_phone">
          <span>Телефон:</span>
          <a :href="'tel:' + apiSetting.phone">{{ apiSetting.phone }}</a>
        </div>
        <div class="a_schedule">
          <span>Режим работы:</span>
          {{ apiSetting.schedule }}
        </div>
      </div>
      <div class="address_front_right">
        <div class="map" id="map"></div>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted } from 'vue';


const props = defineProps({
  apiSetting: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.latitude && value.longitude && value.title && value.address;
    },
  },
});

const mapLoaded = ref(false);
const mapError = ref(false);

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
      script.onerror = () => {
        reject(new Error('Failed to load Yandex Maps script'));
      };
      document.head.appendChild(script);
    }
  });
};
console.log(props.apiSetting);

// Функция для инициализации карты
const initMap = () => {
  try {
    window.ymaps.ready(() => {
      const myMap = new window.ymaps.Map('map', {
        center: [props.apiSetting.latitude, props.apiSetting.longitude],
        zoom: 14,
      }, {
        searchControlProvider: 'yandex#search',
      });

      const MyIconContentLayout = window.ymaps.templateLayoutFactory.createClass(
        '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
      );

      const myPlacemarkWithContent = new window.ymaps.Placemark(
        [props.apiSetting.latitude, props.apiSetting.longitude],
        {
          hintContent: `Автосалон ${props.apiSetting.title}`,
          balloonContent: `<b>Автосалон ${props.apiSetting.title}</b><br>м. ${props.apiSetting.address}`,
          iconContent: '',
        },
        {
          iconLayout: 'default#imageWithContent',
          iconImageSize: [50, 55],
          iconImageOffset: [-25, -26],
          iconContentLayout: MyIconContentLayout,
        }
      );

      myMap.geoObjects.add(myPlacemarkWithContent);
      myMap.behaviors.disable('scrollZoom');
      mapLoaded.value = true;
    });
  } catch (error) {
    console.error('Ошибка при инициализации карты:', error);
    mapError.value = true;
  }
};

// Функция для загрузки карты
const loadMap = async () => {
  try {
    await loadYandexMapsScript();
    initMap();
  } catch (error) {
    console.error('Ошибка при загрузке скрипта Яндекс.Карт:', error);
    mapError.value = true;
  }
};

watch(
  () => props.apiSetting,
  (newValue) => {
    if (newValue && newValue.latitude && newValue.longitude) {
      loadMap();
    }
  },
  { immediate: true }
);
</script>

  