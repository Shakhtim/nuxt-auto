<template>
  <header>
    <div class="mobile_block">
      <div class="mb_top">
        <div class="mb_call_me call">Позвонить мне</div>
        <div class="mb_phone"><a :href="'tel:' + setting.phone">{{ setting.phone }}</a></div>
      </div>
      <div class="mb_top_logo">
        <div class="mb_top_logotype">
          <nuxt-link to="/"><nuxt-img :src="`/img/${setting.logotype}`" alt="Логотип" /></nuxt-link>
        </div>
        <div class="mb_top_catalog" :class="{ active: isCatalogOpen }" @click="toggleCatalog">{{ isCatalogOpen ? 'Закрыть' : 'Каталог' }}</div>
        <div class="mb_top_phone_icon call">
          <nuxt-img :src="`/img/icons/mm-call.svg`" alt="" />
        </div>
        <div class="hamburger" :class="{ active: isMenuOpen }" @click="toggleMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div class="mb_top_menu" :class="{ active: isMenuOpen }">
        <ul>
          <li v-for="item in menuItems" :key="item.title">
            <nuxt-link :to="item.link">{{ item.title }}</nuxt-link>
          </li>
        </ul>
        <div class="mb_top_address">{{ setting.address }}</div>
        <div class="mb_top_phone_link"><a :href="'tel:' + setting.phone">{{ setting.phone }}</a></div>
        <div class="mb_top_schedule">Ежедневно {{ setting.schedule }}</div>
      </div>
      <div class="mb_all_brands" :class="{ active: isCatalogOpen }">
        <div class="wrap_brand" v-for="brand in brands" :key="brand.id">
          <div class="brand_title">
            <nuxt-link :to="'/catalog/' + brand.slug">{{ brand.title }}</nuxt-link>
          </div>
        </div>
      </div>
    </div>

    <div class="container mob_hidden">
      <div class="under_top_block_header">
        <div class="logo">
          <nuxt-link to="/"><nuxt-img :src="`/img/${setting.logotype}`" alt="Логотип" /></nuxt-link>
        </div>
        <div class="nav">
          <nav>
            <ul>
              <li v-for="item in menuItems" :key="item.title">
                <nuxt-link :to="item.link">{{ item.title }}</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>
        <div>
          <div class="mb_top_own_phone_link"><a :href="'tel:' + setting.phone">{{ setting.phone }}</a></div>
        </div>
        <div>
          <div class="mb_top_own_phone_link_2 call_2 call">Обратная связь</div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue';
import axios from 'axios';
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();
const props = defineProps({
  setting: {
    type: Object,
    required: true,
  },
  menuItems: {
    type: Array,
    required: true,
  },
});
const brands = ref([]);
const isMenuOpen = ref(false);
const isCatalogOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleCatalog = () => {
  isCatalogOpen.value = !isCatalogOpen.value;
};

const fetchBrands = async () => {
  try {
    const response = await axios.get(`${config.public.baseUrl}/api/brands/get-public-brands`);
    brands.value = response.data;
  } catch (error) {
    console.error('Ошибка при получении брендов:', error);
  }
};

onMounted(() => {
  fetchBrands();
});

</script>

<style scoped>
.mb_all_brands.active {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}
.mb_all_brands .wrap_brand {
  transition: all 0.3s ease;
}
.mb_all_brands .wrap_brand:hover {
  transform: scale(1.1);
}
.mb_top_phone_icon img{
  width: 30px;
  height: 30px;
}
</style>