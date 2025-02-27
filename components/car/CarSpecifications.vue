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
                <div class="complect_title"
                :class="{ active: isActiveComplect === complect.id }" 
                @click="setActiveTabDetails(complect.id)"
                >{{ complect.title }} {{ isActiveComplect === complect.id ? '▲' : '▼' }}</div>
                <div class="complect_old_price">от {{ formatPrice(complect.price) }} <span>₽</span></div>
                <div class="complect_new_price">от {{ formatPrice(complect.price_new) }} ₽</div>
                <div class="complect_credit">от <span>{{ formatPrice(calculateMonthlyPayment(complect.price_new, 6.2, 84)) }}</span> ₽/мес.</div>
                <div class="wrap_complect_buttons">
                  <div class="buttons">
                    <div class="complect_credit_but call" data-type="Купить в кредит">Купить в кредит</div>
                    <div class="complect_tradein_but call" data-type="Купить в Trade-in">Trade-in</div>
                  </div>
                </div>
              </div>
              <div class="complect_content" :class="{ active: isActiveComplect === complect.id }">
                <ul>
                  <li 
                    v-for="content in complect.content.trim().split('\n')" 
                    :key="content" 
                    :class="{ header_title: content.startsWith('--') }"
                  >
                  {{ content.replace('--', '') }}
                </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tab_content active" id="car_techno" v-if="isActiveTab === 'technical'">
      <div class="car_specification">
        <table>
            <tbody>
              <tr>
                <td class="car_spec_td_first"></td>
                <td class="spec_title_td" v-for="carSpec in car.specifications_main" :key="car.id">
                  {{ carSpec.title }}
                  <p v-for="(complect, index) in car.complectations.filter(c => c.specification_id === carSpec.id)" :key="complect.id">
                    <span v-if="index === 0">
                      {{ complect.price_new ? "от " + formatPrice(complect.price_new) + " ₽" : "от " + formatPrice(complect.price) + " ₽" }}
                    </span>
                  </p>
                </td>
              </tr>
            </tbody>
        </table>
        <div class="wrap_spec_item" v-for="group in getSpecificationsMain()" :key="group.groupName">
          <div class="spec_item_title active">{{ group.groupName }}</div>
          <table>
            <tbody>
              <tr v-for="spec in group.specs" :key="spec.title">
                <td class="car_spec_td_first">{{ spec.title }}</td>
                <td v-for="(value, index) in spec.values" :key="index">{{ value }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  </template>
  
<script setup>
import { ref, inject, onMounted } from 'vue';

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
const isActiveComplect = ref(null);
const openModal = inject('openModal');

const getSpecificationsMain = () => {
  const specs = [];

  // Создаем массив для каждой группы характеристик
  const engineSpecs = [
    { title: 'Объем двигателя, л', values: [] },
    { title: 'Рабочий объем двигателя, см3', values: [] },
    { title: 'Тип двигателя', values: [] },
    { title: 'Тип привода', values: [] },
    { title: 'Мощность, л.с.', values: [] }
  ];

  const bodySpecs = [
    { title: 'Длина', values: [] },
    { title: 'Ширина', values: [] },
    { title: 'Высота', values: [] }
  ];

  const performanceSpecs = [
    { title: 'Расход топлива в городе, л/100 км', values: [] },
    { title: 'Расход топлива на трассе, л/100 км', values: [] },
    { title: 'Смешанный расход топлива, л/100 км', values: [] },
    { title: 'Максимальная скорость, км/ч', values: [] },
    { title: 'Разгон от 0 до 100 км/ч, сек', values: [] },
    { title: 'Объем топливного бака, л', values: [] },
    { title: 'Максимальный объем багажного отделения, л', values: [] }
  ];

  const suspensionSpecs = [
    { title: 'Дорожный просвет, мм', values: [] },
    { title: 'Колесная база, мм', values: [] },
    { title: 'Передняя колея колес, мм', values: [] },
    { title: 'Задняя колея колес, мм', values: [] },
    { title: 'Передний свес, мм', values: [] },
    { title: 'Задний свес, мм', values: [] },
    { title: 'Передняя подвеска', values: [] },
    { title: 'Задняя подвеска', values: [] },
    { title: 'Передние тормоза (тип, размер)', values: [] },
    { title: 'Задние тормоза (тип, размер)', values: [] }
  ];

  const transmissionSpecs = [
    { title: 'Коробка передач', values: [] },
    { title: 'Количество передач', values: [] }
  ];

  // Заполняем массивы значениями для каждого автомобиля
  props.car.specifications_main.forEach(item => {
    engineSpecs[0].values.push(item.engine_volume);
    engineSpecs[1].values.push(item.engine_volume_sm);
    engineSpecs[2].values.push(item.engine_type);
    engineSpecs[3].values.push(item.privod);
    engineSpecs[4].values.push(item.horse_power);

    bodySpecs[0].values.push(item.length);
    bodySpecs[1].values.push(item.width);
    bodySpecs[2].values.push(item.height);

    performanceSpecs[0].values.push(item.gas_mileage_city);
    performanceSpecs[1].values.push(item.gas_mileage_country);
    performanceSpecs[2].values.push(item.gas_mileage_mixed);
    performanceSpecs[3].values.push(item.max_speed);
    performanceSpecs[4].values.push(item.acceleration100);
    performanceSpecs[5].values.push(item.fuel_tank_volume);
    performanceSpecs[6].values.push(item.trunk_volume);

    suspensionSpecs[0].values.push(item.clearance);
    suspensionSpecs[1].values.push(item.wheel_base);
    suspensionSpecs[2].values.push(item.front_wheel_track);
    suspensionSpecs[3].values.push(item.rear_wheel_track);
    suspensionSpecs[4].values.push(item.front_overhang);
    suspensionSpecs[5].values.push(item.rear_overhang);
    suspensionSpecs[6].values.push(item.front_suspension);
    suspensionSpecs[7].values.push(item.rear_suspension);
    suspensionSpecs[8].values.push(item.front_brakes);
    suspensionSpecs[9].values.push(item.rear_brakes);

    transmissionSpecs[0].values.push(item.type_kpp);
    transmissionSpecs[1].values.push(item.count_gears);
  });

  specs.push(
    { groupName: 'Двигатель', specs: engineSpecs },
    { groupName: 'Кузов', specs: bodySpecs },
    { groupName: 'Эксплуатационные показатели', specs: performanceSpecs },
    { groupName: 'Подвеска и тормоза', specs: suspensionSpecs },
    { groupName: 'Трансмиссия и управление', specs: transmissionSpecs }
  );

  return specs;
};

const setActiveTab = (tab) => {
  isActiveTab.value = tab;
}; 

const setActiveTabDetails = (id) => {
  isActiveComplect.value = isActiveComplect.value === id ? null : id;
};

onMounted(() => {
  specificationsMain.value = getSpecificationsMain();
  const callElements = document.querySelectorAll('.call');
  callElements.forEach(element => {
    element.addEventListener('click', openModal);
  });
});

</script>
  