<template>
  <div class="container-fluid">
    <div class="row flex-nowrap">
      <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-nav">
        <div
          class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100"
        >
          <div
            class="d-flex align-items-center pb-3 mt-3 mb-md-0 me-md-auto text-black text-decoration-none"
          >
            <img src="@/assets/logo_badge.png" width="50" alt="" />
            <span class="fs-5 d-none d-sm-inline">호주머니</span>
          </div>
          <ul
            class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start w-100"
            id="menu"
          >
            <li class="nav-item w-100">
              <div class="mt-3 w-100">
                <RouterLink
                  to="/home"
                  class="nav-link align-middle px-0 ms-1 d-none d-sm-inline text-black fw-bold"
                  >Home</RouterLink
                >
              </div>
            </li>
            <li class="nav-item mt-3 w-100">
              <span
                class="nav-link px-0 align-middle ms-1 d-none d-sm-inline text-black fw-bold"
                >수입/지출</span
              >
              <ul
                class="collapse show nav flex-column ms-1 w-100"
                id="submenu1"
              >
                <li class="mt-2 w-100">
                  <RouterLink
                    to="/come/income"
                    class="nav-link align-middle px-0 ms-1 d-none d-sm-inline text-black"
                    >수입 내역</RouterLink
                  >
                </li>
                <li class="mt-2 w-100">
                  <RouterLink
                    to="/come/outcome"
                    class="nav-link align-middle px-0 ms-1 d-none d-sm-inline text-black"
                    >지출 내역</RouterLink
                  >
                </li>
              </ul>
            </li>
            <li class="nav-item mt-3 w-100">
              <span
                class="nav-link px-0 align-middle ms-1 d-none d-sm-inline text-black fw-bold"
                >분석 리포트</span
              >
              <ul
                class="collapse show nav flex-column ms-1 w-100"
                id="submenu1"
              >
                <li class="mt-2 w-100">
                  <RouterLink
                    to="/chart/category"
                    class="nav-link align-middle px-0 ms-1 d-none d-sm-inline text-black"
                    >카테고리별 그래프</RouterLink
                  >
                </li>
                <li class="mt-2 w-100">
                  <RouterLink
                    to="/chart/comes"
                    class="nav-link align-middle px-0 ms-1 d-none d-sm-inline text-black"
                    >수입/지출 그래프</RouterLink
                  >
                </li>
              </ul>
            </li>
          </ul>
          <hr />
          <div class="pb-4 w-100">
            <div
              class="d-flex align-items-center text-black text-decoration-none"
            >
              <button
                class="btn p-0 d-flex align-items-center"
                @click="openUserProfile"
              >
                <img
                  :src="userInfo.avatar"
                  alt="profileImage"
                  width="30"
                  height="30"
                  class="rounded"
                />
                <span class="d-none d-sm-inline mx-1">{{ userInfo.name }}</span>
              </button>
              <span>
                <RouterLink
                  to="/user/setting"
                  class="d-flex text-black text-decoration-none mx-3"
                  >설정</RouterLink
                >
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="view-box col py-3">
        <RouterView />
      </div>
    </div>
    <UserDetailView :isVisible="openModal" @close="closeModal" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserInfoStore } from '@/store/user';
import UserDetailView from '@/components/UserDetailComponent.vue';

const userInfoStore = useUserInfoStore();
const userInfo = userInfoStore.userInfo;

const openModal = ref(false);

const openUserProfile = () => {
  openModal.value = true;
};

const closeModal = () => {
  openModal.value = false;
};
</script>

<style scoped>
.bg-nav {
  background-color: #f5ceb4;
}

.view-box {
  background-color: #fffdf6;
}
</style>
