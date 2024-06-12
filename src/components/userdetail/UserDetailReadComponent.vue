<template>
  <div class="text-center">
    <div>
    <span>{{ userInfo.name }}</span>
  </div>
  <div>
    <span>{{ userInfo.email }}</span>
  </div>
  <div>
    <span>총자산: 원</span>
  </div>
  <div>
    <button type="button" class="btn btn-primary" @click="switchToUpdateMode">
      수정
    </button>
  </div>
  <div>
    <button type="button" class="btn mx-0 px-0" @click="btnLogout">
      <font-awesome-icon icon="fa-solid fa-user-secret"/>
      <!-- <font-awesome-icon icon="fa-solid fa-right-from-bracket" />
      <font-awesome-icon :icon="['fas', 'right-from-bracket']" /> -->
      로그아웃
    </button>
  </div>
  </div>
  

</template>

<script setup>
import { useUserInfoStore } from '@/store/user';
import { useRouter } from 'vue-router';

const userInfoStore = useUserInfoStore();
const userInfo = userInfoStore.userInfo;
const logout = userInfoStore.logout;

const router = useRouter();

const props = defineProps({
  isReadMode: Boolean
});

const emit = defineEmits(['close', 'updateMode']);

const closeModal = () => {
  emit('close');
};

const btnLogout = () => {
  closeModal();
  router.push({path: '/login'});
  logout();
};

const switchToUpdateMode = () => {
  emit('updateMode', false);
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: white;
  padding: 20px;
  width: 40%;
  border-radius: 8px;
  text-align: center;
}
.btn-update {
  background-color: darkgray;
  border-radius: 10px;
}
.btn-logout {
  background-color: darkgray;
}
</style>
