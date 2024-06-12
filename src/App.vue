<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import SidebarComponent from '@/components/SidebarComponent.vue'
import { onMounted } from 'vue';
import { watchEffect } from 'vue';
import LoginView from './views/LoginView.vue';

const route = useRoute();
const router  = useRouter();
const email = ref(sessionStorage.getItem('email'));
const showSidebar = ref(false);

onMounted(() => {
  if (!email.value) {
    router.push({ path: '/login' });
  } else {
    showSidebar.value = true;
  }
});

watchEffect(() => {
  if (route.name == 'login') {
    showSidebar.value = false;
  } else {
    showSidebar.value = true;
  }
})
</script>

<template>
  <SidebarComponent v-if="showSidebar"/>
  <LoginView v-if="!showSidebar"/>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  
}

.viewbox {
  background-color: #E5E6ED;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
