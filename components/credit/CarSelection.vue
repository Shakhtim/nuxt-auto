<template>
        <div class="wrap_input simple_select">
            <select v-model="selectedBrand" @change="fetchModels">
                <option value="">Выберите марку авто</option>
                <option v-for="brand in brands" :key="brand.slug" :value="brand.slug">{{ brand.title }}</option>
            </select>
        </div>
        <div class="wrap_input simple_select">
            <select v-model="selectedModel">
                <option value="">Выберите модель</option>
                <option v-for="model in models" :key="model.id" :value="model.slug">{{ model.title }}</option>
            </select>
        </div>
        <div class="wrap_input simple_select">
            <select v-model="selectedComplectation">
                <option value="">Выберите комплектaцию</option>
                <option v-for="complect in complects" :key="complect.id" :value="complect.id">{{ complect.title }}</option>
            </select>
        </div>
        <div class="wrap_input simple_select">
            <select name="vznos" id="vznos" v-model="initialPayment">
                <option value="">Первоначальный взнос</option>
                <option v-for="percent in [10, 20, 30, 40, 50, 60, 70, 80, 90]" :key="percent" :value="percent">{{ percent }}%</option>
            </select>
        </div>
</template>

<script setup>
import { ref, watch, defineEmits, onMounted } from 'vue';
import axios from 'axios';
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();
const emit = defineEmits();
const selectedBrand = ref('');
const selectedModel = ref('');
const selectedComplectation = ref('');
const initialPayment = ref('');
const brands = ref([]);
const models = ref([]);
const complects = ref([]);
const setting = {
    credit_rate: 6.2,
    numberFormat: (value) => new Intl.NumberFormat('ru-RU').format(value),
};

// кредит в месяц
const calculateMonthlyPayment = (price, annualRate, months) => {
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPayment = (monthlyRate * price) / (1 - Math.pow(1 + monthlyRate, -months));
  return Math.round(monthlyPayment);
}

// 
const formatPrice = (price) => {
    return setting.numberFormat(price);
};

// Функция для получения марок
const fetchBrands = async() => {
    try {
        const response = await axios.get(`${config.public.baseUrl}/api/brands/get-public-brands`);
        brands.value = response.data;        
    } catch (error) {
        console.error('Ошибка при получении марок:', error);
    }
}

// Функция для получения моделей по выбранному бренду
const fetchModels = async() => {
    if (!selectedBrand.value) return; // Не выполнять запрос, если бренд не выбран

    try {
        const response = await axios.get(`${config.public.baseUrl}/api/cars/brands/${selectedBrand.value}`);
        models.value = response.data;
    } catch (error) {
        console.error('Ошибка при получении моделей:', error);
    }
}

onMounted(() => {
    fetchBrands();
});

watch(selectedBrand, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        fetchModels();
        emit('update:modelValue', { brand: newVal, model: selectedModel.value, complectation: selectedComplectation.value });
    }
});

watch(selectedModel, (newVal) => {
    const selectedModelData = models.value.find(model => model.slug === newVal);
    if (selectedModelData) {
        const exteriorImage = selectedModelData.images.find(img => img.type === 'colors');
        const modelNameValue = `${selectedModelData.brand.title} ${selectedModelData.title}`;
        
        emit('update-model-details', {
            img: `/img/cars/${exteriorImage.image}`,
            name: modelNameValue,
            priceOld: `от ${formatPrice(selectedModelData.complectations[0].price)} ₽*`,
            priceNew: `от ${formatPrice(selectedModelData.complectations[0].price_new)} ₽*`,
            priceMonth: `в кредит от ${formatPrice(calculateMonthlyPayment(selectedModelData.complectations[0].price_new, 6.2, 84))} ₽/мес.`,
        });
    } else {
        emit('update-model-details', {
            img: '/img/not-found.png',
            name: 'Выберите автомобиль',
            priceOld: 'от ... ₽',
            priceNew: 'от ... ₽',
            priceMonth: 'в кредит от ... ₽'
        });
    }
});

// Наблюдатель для изменения комплектации
watch(selectedComplectation, (newVal) => {
    emit('update:modelValue', { brand: selectedBrand.value, model: selectedModel.value, complectation: newVal });
});

// Наблюдатель для изменения первоначального взноса
watch(initialPayment, (newVal) => {
    const selectedModelData = models.value.find(model => model.slug === selectedModel.value);
    if (selectedModelData && selectedModelData.complectations.length > 0) {
        const exteriorImage = selectedModelData.images.find(img => img.type === 'colors');
        const modelNameValue = `${selectedModelData.brand.title} ${selectedModelData.title}`;
        const selectedComplectationData = selectedModelData.complectations[0];

        if (selectedComplectationData) {

            const priceNew = selectedComplectationData.price_new;
            const downPayment = (newVal / 100) * priceNew; // Рассчитываем первоначальный взнос
            const loanAmount = priceNew - downPayment; // Сумма кредита
            
            // Обновляем значения priceNew и priceMonth
            emit('update-model-details', {
                img: `/img/cars/${exteriorImage.image}`,
                name: modelNameValue,
                priceOld: `от ${formatPrice(selectedModelData.complectations[0].price)} ₽*`,
                priceNew: `от ${formatPrice(selectedModelData.complectations[0].price_new)} ₽*`,
                priceMonth: `в кредит от ${formatPrice(calculateMonthlyPayment(loanAmount, setting.credit_rate, 84))} ₽/мес.`
            });
        }
    }
});
</script>
