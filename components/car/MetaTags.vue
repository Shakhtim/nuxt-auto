<template>
    <div>
      <title>{{ metaTitle }}</title>
      <meta name="description" :content="metaDescription" />
      <meta name="keywords" :content="metaKeywords" />
      <link rel="canonical" :href="currentUrl" />
    </div>
  </template>
  
<script setup>
import { defineProps, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  car: {
    type: Object,
    required: true,
  },
  seo: {
    type: Object,
    required: true,
  },
});

const router = useRouter();
const currentUrl = computed(() => window.location.href);

const metaTitle = computed(() => {
  return props.seo.parseTemplate(props.car).meta_title || props.car.title;
});

const metaDescription = computed(() => {
  return props.seo.parseTemplate(props.car).meta_description || '';
});

const metaKeywords = computed(() => {
  return props.seo.parseTemplate(props.car).meta_keywords || '';
});
</script>
  