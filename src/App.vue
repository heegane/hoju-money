<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/login">로그인</RouterLink>
        <RouterLink to="/home">홈</RouterLink>
        <RouterLink to="/come/income">수입 내역</RouterLink>
        <RouterLink to="/come/outcome">지출 내역</RouterLink>
        <RouterLink to="/chart/category">카테고리 차트</RouterLink>
        <RouterLink to="/chart/comes">수입/지출 차트</RouterLink>
        <RouterLink to="/user/detail">프로필 조회</RouterLink>
        <RouterLink to="/user/setting">설정</RouterLink>
      </nav>
    </div>
  </header>

  <div class="viewbox">
    <RouterView />
  </div>
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
