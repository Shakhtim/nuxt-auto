<template>
    <div>
      <h1>{{ car.name }}</h1>
      <p>{{ car.description }}</p>
      <!-- Добавьте другие данные о автомобиле -->
    </div>
  </template>
  
  <script>
  export default {
    props: {
      car: {
        type: Object,
        required: true,
      },
      setting: {
        type: Object,
        default: () => ({}),
      },
    },
  };
  </script>
  