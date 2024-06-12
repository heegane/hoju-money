<template>
  <div class="text-center">
    <div class="my-2">
      <span class="fs-4">{{ userInfo.name }}</span>
    </div>
    <div class="my-2">
      <span>{{ userInfo.email }}</span>
    </div>
    <div class="my-2">
      <span>총자산: {{ totalMoney.toLocaleString() }}원</span>
    </div>
    <div class="my-2 text-end">
      <button type="button" class="btn btn-brown" @click="switchToUpdateMode">수정</button>
    </div>
  </div>
</template>

<script setup>
import { useUserInfoStore } from '@/store/user';
import { useRouter } from 'vue-router';

const userInfoStore = useUserInfoStore();
const userInfo = userInfoStore.userInfo;

const router = useRouter();

const props = defineProps({
  isReadMode: Boolean,
  totalMoney: Number
});

const emit = defineEmits(['updateMode']);

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
.btn-brown {
  background-color: #4D2A30;
  color:azure
}
</style>
