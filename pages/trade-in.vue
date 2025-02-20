<template>
      <TopBannerForm />
  
      <div class="container">
        <div class="page_title brand_title credit_title">Заявка на выгодный Trade-in</div>
        <div class="credit_middle_text">Счастливый момент приобретения нового автомобиля можно приблизить. Воспользуйтесь программой кредитования и оформите покупку на выгодных условиях.</div>
      </div>
  
      <div class="container">
        <div class="credit_form_page">
          <FormCarSelection/>
        </div>
      </div>
    <CheaperForm/>
</template>
  
<script setup>
import CheaperForm from '../components/CheaperForm.vue';
import TopBannerForm from '~/components/trade-in/TopBannerForm.vue';
import FormCarSelection from '~/components/trade-in/FormCarSelection.vue';

useHead({
    title: 'Авто в трейд-ин в Москве - сдать автомобиль в автосалоне',
    meta: [
      { name: 'description', content: 'Купить новый автомобиль в кредит в Москве.' },
      { property: 'og:title', content: 'Авто в трейд-ин в Москве - сдать автомобиль в автосалоне' },
      { property: 'og:description', content: 'Купить новый автомобиль в кредит в Москве.' }
    ]
});
</script>
