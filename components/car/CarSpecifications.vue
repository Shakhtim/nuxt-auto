<template>
    <div class="container">
      <div class="car_page_tabs">
        <div 
          class="car_page_tab car_tab_main_info" 
          :class="{ active: isActiveTab === 'complectations' }" 
          @click="setActiveTab('complectations')"
        >
          Комплектации
        </div>
        <div 
          class="car_page_tab car_tab_main_info" 
          :class="{ active: isActiveTab === 'technical' }" 
          @click="setActiveTab('technical')"
        >
          Технические
        </div>
      </div>
      <div class="tab_content active" v-if="isActiveTab === 'complectations'">
        <div v-for="item in car.specifications_main" :key="item.id">
          <div class="flex spec_wrap">
            <div class="specification_title">{{ item.title }}</div>
          </div>
          <div class="complects_names">
            <div class="item_name mob_hidden"></div>
            <div class="item_name">Старая цена</div>
            <div class="item_name">Цена со скидкой</div>
            <div class="item_name">Кредит в месяц</div>
          </div>
          <div class="complectations">
            <div v-for="complect in car.complectations.filter(c => c.specification_id === item.id)" :key="complect.id" class="complect_data">
              <div class="flex complect_flex">
                <div class="complect_title" v-html="complect.title"></div>
                <div class="complect_old_price">от {{ formatPrice(complect.price) }} <span>₽</span></div>
                <div class="complect_new_price">от {{ formatPrice(complect.price_new) }} ₽</div>
                <div class="complect_credit">от <span>{{ formatPrice(calculateMonthlyPayment(complect.price_new, 6.2, 84)) }}</span> ₽/мес.</div>
                <div class="wrap_complect_buttons">
                  <div class="buttons">
                    <div class="complect_credit_but" data-type="кредиту">Купить в кредит</div>
                    <div class="complect_tradein_but" data-type="Trade-in">Trade-in</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tab_content" id="car_techno" v-if="isActiveTab === 'technical'">
      <div class="car_specification">
        <table>
          <tr>
            <td class="car_spec_td_first"></td>
            <td v-for="spec in car.specifications_main" :key="spec.id" class="spec_title_td">
              {{ spec.title }}
              <div class="spec_title_price">
                от {{ formatPrice(spec.firstPriceDiscount) }} ₽
              </div>
            </td>
          </tr>
        </table>
        <div v-for="(specifications, category) in car.specifications_main" :key="category">
          <table v-for="(spec, index) in specifications" :key="index">
            <tbody>
              <tr>
                <td>{{index}} </td>
                <td>{{spec}} </td>
                <td>{{spec}} </td>
                <td>{{spec}} </td>
              </tr>
            </tbody>
          </table>
        </div> 
        <!-- <div v-for="(specifications, category) in specificationsMain" :key="category">
          <div v-for="(spec, index) in specifications" :key="index" class="wrap_spec_item">
          <table>
            <tbody>
                <div class="spec_item_title active">{{ index }}</div>
              <tr v-for="(s, i) in specifications" :key="index">
                <td :class="s[0].title ? 'car_spec_td_first' : ''">
                  {{ s[0].title }}
                </td>
                 
                  <template v-for="i in specificationsMain.length" :key="i">
                    <td>
                    {{ s[1].value }}
                  </td>
                  </template>
              </tr>
            </tbody>
          </table>
        </div>
        </div> -->
      </div>
    </div>
    </div>
  </template>
  
<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  car: {
    type: Object,
    required: true,
  },
  setting: {
    type: Object,
    required: true,
  },
  formatPrice: {
    type: Function,
    required: true,
  },
  calculateMonthlyPayment: {
    type: Function,
    required: true,
  },
});

const specificationsMain = ref([]);
const isActiveTab = ref('complectations');

const getSpecificationsMain = () => {
  const specs = [];

  props.car.specifications_main.forEach(item => {
    specs.push({
      'Двигатель': [
        { title: 'Объем двигателя, л', value: item.engine_volume },
        { title: 'Рабочий объем двигателя, см3', value: item.engine_volume_sm },
        { title: 'Тип двигателя', value: item.engine_type },
        { title: 'Тип привода', value: item.privod },
        { title: 'Мощность, л.с.', value: item.horse_power }
      ],
      'Кузов': [
        { title: 'Длина', value: item.length },
        { title: 'Ширина', value: item.width },
        { title: 'Высота', value: item.height }
      ],
      'Эксплуатационные показатели': [
        { title: 'Расход топлива в городе, л/100 км', value: item.gas_mileage_city },
        { title: 'Расход топлива на трассе, л/100 км', value: item.gas_mileage_country },
        { title: 'Смешанный расход топлива, л/100 км', value: item.gas_mileage_mixed },
        { title: 'Максимальная скорость, км/ч', value: item.max_speed },
        { title: 'Разгон от 0 до 100 км/ч, сек', value: item.acceleration100 },
        { title: 'Объем топливного бака, л', value: item.fuel_tank_volume },
        { title: 'Максимальный объем багажного отделения, л', value: item.trunk_volume }
      ],
      'Подвеска и тормоза': [
        { title: 'Дорожный просвет, мм', value: item.clearance },
        { title: 'Колесная база, мм', value: item.wheel_base },
        { title: 'Передняя колея колес, мм', value: item.front_wheel_track },
        { title: 'Задняя колея колес, мм', value: item.rear_wheel_track },
        { title: 'Передний свес, мм', value: item.front_overhang },
        { title: 'Задний свес, мм', value: item.rear_overhang },
        { title: 'Передняя подвеска', value: item.front_suspension },
        { title: 'Задняя подвеска', value: item.rear_suspension },
        { title: 'Передние тормоза (тип, размер)', value: item.front_brakes },
        { title: 'Задние тормоза (тип, размер)', value: item.rear_brakes }
      ],
      'Трансмиссия и управление': [
        { title: 'Коробка передач', value: item.type_kpp },
        { title: 'Количество передач', value: item.count_gears }
      ]
    });
  });

  return specs;
};

const specifications = computed(() => getSpecificationsMain());

const setActiveTab = (tab) => {
  isActiveTab.value = tab;
};

onMounted(() => {
  specificationsMain.value = getSpecificationsMain();
});
</script>
  