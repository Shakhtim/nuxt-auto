<template>
  <footer>
    <div class="footer_logo_block">
      <div class="container">
        <div class="footer_logo">
          <nuxt-img :src="`/img/${setting.logotype}`" alt="Логотип" />
        </div>
        <div class="footer_nav">
          <ul>
            <li><nuxt-link to="/">Главная</nuxt-link></li>
            <li><nuxt-link to="/credit">Автокредит</nuxt-link></li>
            <li><nuxt-link to="/trade-in">Trade-in</nuxt-link></li>
            <li><nuxt-link to="/gosapp">Госпрограммы</nuxt-link></li>
            <li><nuxt-link to="/actions">Акции</nuxt-link></li>
            <li><nuxt-link to="/reviews">Отзывы</nuxt-link></li>
            <li><nuxt-link to="/contacts">Контакты</nuxt-link></li>
          </ul>
        </div>
        <div class="footer_phone">
          <a :href="`tel:${setting.phone}`">{{ setting.phone }}</a>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="footer_second">
        <div class="footer_address">{{ setting.address }}</div>
        <div class="footer_address" style="max-width: 300px">
          <span v-html="setting.ooo"></span><br>
        </div>
        <nuxt-link :to="{ name: 'policy' }" class="footer_address" style="text-decoration: underline;">
          Пользовательское соглашение
        </nuxt-link>
        <div class="footer_button call">Обратный звонок</div>
      </div>
    </div>

    <div class="container">
      <div class="aferta">
        <p>
          Стоимость подарка не зависит от стоимости купленного а/м, покупатель может выбрать любой подарок из перечисленных при покупке а/м. Обращаем Ваше внимание на то, что данный сайт носит исключительно информационный характер и ни при каких условиях не является публичной офертой, определяемой положениями статьи 437 Гражданского кодекса Российской Федерации. Отправляя персональные данные вы соглашаетесь с условиями обработки и 
          <nuxt-link :to="{ name: 'policy' }" class="privacy_but" target="_blank"> использования персональных данных.</nuxt-link>* 
          Цена указана с учетом максимальной скидки: при условии покупки авто в кредит и не включает в себя услуги обязательного страхования. При первоначальном взносе от 10% со сроком на 7 лет.
        </p>
        <p>
          Для получения более подробной информации об указанных акциях, а также о стоимости автомобилей обращайтесь к менеджерам по продажам.
        </p>
      </div>
    </div>

    <div id="metrika">{{ setting.IDmetrika }}</div>

  </footer>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  setting: {
    type: Object,
    required: true,
  },
});
</script>

