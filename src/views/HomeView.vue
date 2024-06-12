<template>
  <div class="container">
    <UserDetailComponent :isVisible="openModal" @close="closeModal" />
    <div class="flex-div" @click="openUserProfile">
      <profile />
    </div>
    <div class="flex-div">
      <totalincome />
      <totaloutcome />
      <netProceed />
    </div>
    <div class="flex-div">
      <recentincome />
      <recentoutcome />
    </div>
  </div>
</template>


<script setup>
import profile from '@/views/home/profile.vue';
import recentincome from '@/views/home/recentincome.vue';
import recentoutcome from '@/views/home/recentoutcome.vue';
import totaloutcome from '@/views/home/totaloutcome.vue';
import totalincome from '@/views/home/totalincome.vue';
import netProceed from '@/views/home/netProceed.vue';
import UserDetailComponent from '@/components/userdetail/UserDetailComponent.vue';

import { useUserInfoStore } from '@/store/user';
import { ref } from 'vue';

const userInfoStore = useUserInfoStore();
const userInfo = userInfoStore.userInfo;
const getUserInfo = userInfoStore.getUserInfo;

const openModal = ref(false);

const openUserProfile = () => {
  openModal.value = true;
};

const closeModal = () => {
  openModal.value = false;
};

getUserInfo();
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
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
