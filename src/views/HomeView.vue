<template>
  <div class="container py-5">
    <UserDetailComponent :isVisible="openModal" @close="closeModal" />
    <div class="flex-div" @click="openUserProfile">
      <profile :is-change="isChange" />
    </div>
    <div class="flex-div">
      <totalincome :is-change="isChange" />
      <totaloutcome :is-change="isChange" />
      <netProceed :is-change="isChange" />
    </div>
    <div class="flex-div">
      <recentincome @send-is-change="changeData" />
      <recentoutcome @send-is-change="changeData" />
    </div>
  </div>
</template>

<script setup>
import profile from '@/components/home/profile.vue';
import recentincome from '@/components/home/recentincome.vue';
import recentoutcome from '@/components/home/recentoutcome.vue';
import totaloutcome from '@/components/home/totaloutcome.vue';
import totalincome from '@/components/home/totalincome.vue';
import netProceed from '@/components/home/netProceed.vue';
import UserDetailComponent from '@/components/userdetail/UserDetailComponent.vue';

import { useUserInfoStore } from '@/store/user';
import { useMoneyInfoStore } from '@/store/asset';
import { onMounted, ref } from 'vue';

const isChange = ref(false);

const changeData = (is) => {
  isChange.value = is;
  console.log("isChange : ", isChange.value)
}

const userInfoStore = useUserInfoStore();
const userInfo = userInfoStore.userInfo;
const getUserInfo = userInfoStore.getUserInfo;

const moneyInfoStore = useMoneyInfoStore();
const loadTotal = moneyInfoStore.loadTotal;

const openModal = ref(false);

const openUserProfile = () => {
  openModal.value = true;
};

const closeModal = () => {
  openModal.value = false;
};

onMounted(() => {
  getUserInfo();
  loadTotal();
})
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.flex-div {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 20px;
}

.flex-div > * {
  flex: 1;
  margin: 0 10px;
}
</style>
