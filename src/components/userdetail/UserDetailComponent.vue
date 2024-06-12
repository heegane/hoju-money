<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <button type="button" class="btn btn-close" @click="closeModal"></button>
      <div>
        <img
          :src="userInfo.avatar"
          alt="avatar"
          class="rounded-circle"
          width="100"
        />
      </div>
      <UserDetailReadComponent v-if="isReadMode" :isReadMode="isReadMode" @updateMode="switchMode" />
      <UserDetailUpdateComponent v-else :isReadMode="isReadMode" @updateMode="switchMode"  />
    </div>
  </div>
</template>

<script setup>
import { useUserInfoStore } from '@/store/user';
import UserDetailReadComponent from './UserDetailReadComponent.vue';
import UserDetailUpdateComponent from './UserDetailUpdateComponent.vue';
import { ref } from 'vue';

const userInfoStore = useUserInfoStore();
const userInfo = userInfoStore.userInfo;

const props = defineProps({
  isVisible: Boolean,
});
const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};

const isReadMode = ref(true);

const switchMode = (mode) => {
  isReadMode.value = mode;
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
