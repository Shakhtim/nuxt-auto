<template>
    <div class="container thanks_page">
        <div class="th_first" style="text-align: center;">
        Спасибо, что выбрали нас!
        </div>
        <div class="th_big" style="text-align: center;">
        Ваша заявка принята и уже обрабатывается
        </div>
        <div class="th_grey">
        Ожидайте звонка, наш специалист свяжется с Вами в течении 5 минут
        </div>
        <div class="th_button">
        <router-link to="/">На главную</router-link>
        </div>
        <div class="th_schedule" v-if="setting" style="margin: 20px 0;">
        Мы работаем {{ setting.schedule }}
        </div>
        
        <div class="th_dont_forget_present">
        <div class="flex">
            <div class="th_big_white">Не забудьте подарок!</div>
            <div class="cupon_number">#{{ getRandomInt(9999) }}</div>
        </div>
        <div class="th_present_descr">
            Сообщите нашему менеджеру ваш номер купона на подарок!
        </div>
        </div>
  </div>
</template>

<script setup>

    import axios from "axios";
    import { onMounted, ref } from "vue";
    import { useRuntimeConfig } from '#app';

    const config = useRuntimeConfig();
    const setting = ref(null);
    const fetchSettings = async() => {
        try {
            const response = await axios.get(`${config.public.baseUrl}/api/settings/get-all-settings`);
            setting.value = response.data[0];
        } catch (error) {
            console.error('Ошибка при получении настроек:', error);
        }
    } 

    const getRandomInt = (max) => {
        return Math.floor(Math.random() * max);
    }

    onMounted(async () => {
       await fetchSettings();
    });

    useHead({
    title: 'Спасибо!',
    meta: [
        { name: 'description', content: 'Мы свяжемся с вами в течение 10 минут.' },
        { property: 'og:title', content: 'Спасибо!' },
        { property: 'og:description', content: 'Мы свяжемся с вами в течение 10 минут.' }
    ]
    });
</script>