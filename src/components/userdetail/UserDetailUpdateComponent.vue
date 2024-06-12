<template>
  <div>
    <span>이름: </span>
    <input type="text" :placeholder="userInfo.name">
  </div>
  <div>
    <span>이메일: </span>
    <span>{{ userInfo.email }}</span>
  </div>
  <div>
    <span>총자산: </span>
  </div>
  <div>
    <button type="button" class="btn" @click="switchToReadMode">
      저장하기
    </button>
  </div>
</template>

<script setup>
import { useUserInfoStore } from '@/store/user';

const userInfoStore = useUserInfoStore();
const userInfo = userInfoStore.userInfo;

const props = defineProps({
  isReadMode: Boolean,
});

const emit = defineEmits(['updateMode']);

const btnSave = () => {
  
};

const switchToReadMode = () => {
  emit('updateMode', true);
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
</style>
