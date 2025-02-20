<template>
    <div>
      
      <TopBannerForm />
  
      <div class="container">
        <div class="page_title brand_title credit_title">Заявка на автокредит</div>
        <div class="credit_middle_text">Счастливый момент приобретения нового автомобиля можно приблизить. Воспользуйтесь программой кредитования и оформите покупку на выгодных условиях.</div>
      </div>
  
      <div class="container">
        <div class="credit_form_page">
          <FormCarSelection/>
        </div>
      </div>
    </div>
    <CheaperForm/>
</template>
  
<script setup>
import CheaperForm from '../components/CheaperForm.vue';
import TopBannerForm from '~/components/credit/TopBannerForm.vue';
import FormCarSelection from '~/components/credit/FormCarSelection.vue';

useHead({
    title: 'Оформить автокредит на новый автомобиль: купить авто в кредит в Москве у офицального дилера',
    meta: [
      { name: 'description', content: 'Купить новый автомобиль в кредит в Москве.' },
      { property: 'og:title', content: 'Оформить автокредит на новый автомобиль: купить авто в кредит в Москве у офицального дилера' },
      { property: 'og:description', content: 'Купить новый автомобиль в кредит в Москве.' }
    ]
});
</script>
