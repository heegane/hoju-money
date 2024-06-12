<template>
  <div>
    <span>이름: </span>
    <span>{{ userInfo.name }}</span>
  </div>
  <div>
    <span>이메일: </span>
    <span>{{ userInfo.email }}</span>
  </div>
  <div>
    <span>총자산: </span>
  </div>
  <div>
    <button type="button" class="btn" @click="switchToUpdateMode">
      내 정보 수정하기
    </button>
    <button type="button" class="btn" @click="btnLogout">
      로그아웃(아이콘으로?)
    </button>
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
