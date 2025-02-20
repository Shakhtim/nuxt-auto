<template>
    <div>
      <!-- SEO Metadata (commented out for now) -->
      <!-- 
      <head>
        <title>{{ seoMeta.title }}</title>
        <meta name="description" :content="seoMeta.description" v-if="seoMeta.description"/>
        <meta name="keywords" :content="seoMeta.keywords" v-if="seoMeta.keywords"/>
        <link rel="canonical" :href="currentUrl"/>
      </head> 
      -->
  
      <BrandList />
  
      <div class="container page_title brand_title">
        <!-- Авто {{ brand.title }} в наличии -->
      </div>
  
      <!-- Uncomment to display car details -->
      
      <div class="container">
        <div class="wrap_cars">
          <div v-for="car in brandMenu" :key="car.slug" class="car">
            <router-link :to="getCarLink(car)" :title="car.title">
              {{ car.title }}
            </router-link>
            <div class="car_title">
              {{ car.brand.title }} {{ car.title }} <span>В кредит от {{ setting.credit_rate }}%</span>
            </div>
            <div class="car_image">
              <nuxt-img 
                  v-if="getColorImage(car)" 
                  :src="`/img/cars/${getColorImage(car).image}`" 
                  :alt="getColorImage(car).alt || car.title" 
                />
            </div>
            <div class="car_price_rrc"> от {{ formatPrice(car.complectations[0].price) }} ₽</div>
              <div class="car_price_new">от {{ formatPrice(car.complectations[0].price_new) }} ₽<span style="color: #8080803d; padding:0;">*</span></div>
              <div class="car_credit">кредит от {{ formatPrice(calculateMonthlyPayment(car.complectations[0].price_new, 6.2, 84)) }} ₽</div>
          </div>
        </div>
      </div> 
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  import BrandList from '~/components/BrandList.vue';
  // import IncludeActions from '/components/includes/IncludeActions.vue';
  // import IncludeCheaper from '/components/includes/IncludeCheaper.vue';
  // import IncludePredFooterAddress from '/components/includes/IncludePredFooterAddress.vue';
  import { useRuntimeConfig } from '#app';

  const config = useRuntimeConfig();
  const route = useRoute();
  const brand = ref(null);
  const brandMenu = ref([]);
  const setting = ref({ credit_rate: 6.2, numberFormat: (price) => new Intl.NumberFormat('ru-RU').format(price) }); 
  
  const getCarLink = (car) => {
    return `/catalog/${car.brand.slug}/${car.slug}`;
  };
  
  const formatPrice = (price) => {
    return setting.value.numberFormat(price);
  };
  
  const calculateMonthlyPayment = (price, annualRate, months) => {
    const monthlyRate = annualRate / 100 / 12; 
    const monthlyPayment = (monthlyRate * price) / (1 - Math.pow(1 + monthlyRate, -months));
    return Math.round(monthlyPayment);
  };
  
  const getColorImage = (car) => {
        if (car.images && Array.isArray(car.images)) {
          const colorImage = car.images.find(image => image.type === 'colors');
          return colorImage || null; 
        }
        return null;
  };
  
  async function fetchBrandMenu(slug) { 
    try {
      const response = await axios.get(`${config.public.baseUrl}/api/cars/brands/${slug}`);
      brandMenu.value = response.data;
    } catch (error) {
      console.error('Error fetching brand menu:', error);
    }
  }
  
  onMounted(() => {
    const slug = route.params.brand;
    if (slug) {
      fetchBrandMenu(slug);
    }

    const currentbrand = capitalizeFirstLetter(slug);

    useHead({
      title: `Купить ${currentbrand} - цена у официального дилера, купить автомобиль в Москве, модельный ряд, комплектации`,
      meta: [
        { name: 'description', content: `Купить новый автомобиль ${currentbrand} в Москве.` },
      ]
    });
  });

  const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
  
  const brandMenuChunks = computed(() => {
    const chunks = [];
    for (let i = 0; i < brandMenu.value.length; i += 6) {
      chunks.push(brandMenu.value.slice(i, i + 6));
    }
    return chunks;
  });

  
  </script>
  
  