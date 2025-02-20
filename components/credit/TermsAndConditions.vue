<template>
    <div class="container credit_terms" :class="tradeInClass">
      <div class="item">
        <div class="credit_terms_title">Условия кредитования:</div>
        <ul class="grey_text">
          <li>Гражданство: Россия</li>
          <li>Место постоянной регистрации: Россия</li>
          <li>Возраст: от 21 до 75 лет на момент обращения в автосалон</li>
          <li>Стаж на текущем месте работы: не менее 3 месяцев</li>
          <li>Для ИП дополнительно: свидетельство ИНН и ОГРН</li>
        </ul>
      </div>
      <div class="item" v-if="tradeInClass">
        <img src="/img/about-us.jpg" alt="">
        <div class="credit_terms_text_top">Trade-in с выгодой</div>
        <div class="credit_terms_text_bottom">до <span>200 000 </span> руб.</div>
      </div>
      <div class="item" v-else>
        <img src="/img/model-order-bg-min.jpg" alt="">
        <div class="credit_terms_text_top">Рекордное снижение цен</div>
        <div class="credit_terms_text_bottom">до <span>350 000 </span> руб.</div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      tradeInClass: {
        type: String,
        required: true
      },
    }
  };
  </script>