<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <button type="button" class="btn btn-close" @click="closeModal"></button>
      <div>
        <img :src="userInfo.avatar" alt="avatar" class="rounded-circle" width="100">
      </div>
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
        <button type="button" class="btn" @click="btnUpdate">내 정보 수정하기</button>
        <button type="button" class="btn" @click="btnLogout">로그아웃(아이콘으로?)</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserInfoStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const userInfoStore = useUserInfoStore();
const userInfo = userInfoStore.userInfo;
const logout = userInfoStore.logout;

const router = useRouter();

const props = defineProps({
  isVisible: Boolean,
});
const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};

const btnUpdate = () => {
  alert("수정 버튼 클릭");
};

const btnLogout = () => {
  closeModal();
  router.push({path: '/login'});
  logout();
};
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