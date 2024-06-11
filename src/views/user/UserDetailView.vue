<template>
    <div v-if="isVisible" class="modal-overlay">
      <div class="modal-content">
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
          <button type="button" @click="closeModal">닫기</button>
          <button type="button">로그아웃</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useUserInfoStore } from '@/stores/user';
  const userInfoStore = useUserInfoStore();
  const userInfo = userInfoStore.userInfo;
  
  const props = defineProps({
    isVisible: Boolean,
  });
  const emit = defineEmits(['close']);
  
  const closeModal = () => {
    emit('close');
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
    border-radius: 8px;
    text-align: center;
  }
  </style>