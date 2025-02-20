<template>
    <div class="review-page review__page">
      <div class="container page_title">
        Отзывы
      </div>
  
      <div class="container reviews">
        <div v-if="reviews.length === 0">
          <h1>Нет отзывов</h1>
        </div>
        <div v-for="(review, index) in reviews" :key="index" class="review" :class="{ show: index <= 3 }">
          <div class="review__img">
            <img :src="`/img/reviews/mini/${review.image}`" alt="" />
          </div>
          <div class="review__info">
            <div class="review__info-client">
              <div class="name">{{ review.author }}</div>
              <div class="stars">
                <div>
                  <img v-for="star in review.stars" :key="star" src="/img/icons/review-star.svg" alt="" />
                </div>
                <div class="date">{{ formatDate(review.custom_date) }}</div>
              </div>
              <div class="text">{{ review.content }}</div>
            </div>
          </div>
        </div>
      </div>
  
      <div class="container">
        <div class="more-reviews" @click="loadMoreReviews">Показать еще</div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRuntimeConfig } from '#app';

  const config = useRuntimeConfig();
  const reviews = ref([]);
  
  const fetchReviews = async() => {
    try {
      const response = await axios.get(`${config.public.baseUrl}/api/review/get-reviews`);
      reviews.value = response.data; 
    } catch (error) {
      console.error('Ошибка при получении отзывов:', error);
    }
  }
  
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  }
  
  const loadMoreReviews = () => {
  // Показать по 4 отзыва
  const hiddenReviews = document.querySelectorAll('.review__page .review:not(.show)');
  const reviewsToShow = Array.from(hiddenReviews).slice(0, 4);
  // Добавляем класс 'show' к отзыва, чтобы сделать их видимыми
  reviewsToShow.forEach(review => {
    review.classList.add('show');
  });

  // Проверяем, остались ли скрытые отзывы
  if (hiddenReviews.length === 0) {
    // Если скрытых отзывов больше нет, скрываем кнопку "Показать больше"
    document.querySelector('.more-reviews').style.display = 'none';
  }
}
  onMounted(() => {
    fetchReviews();
  });

  useHead({
        title: 'Отзывы клиентов о нашем автосалоне',
        meta: [
            { name: 'description', content: 'Наши клиенты оставили отзывы после покупок автомобилей в нашем автосалоне.' },
            { property: 'og:title', content: 'Отзывы клиентов о нашем автосалоне' },
            { property: 'og:description', content: 'Наши клиенты оставили отзывы после покупок автомобилей в нашем автосалоне.' }
        ]
    });


  </script>

  