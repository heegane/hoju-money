<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <div class="d-flex justify-content-between">
        <button type="button" class="btn btn-close" @click="closeModal"></button>
        <button type="button" class="btn mx-0 px-0" @click="btnLogout">
          <font-awesome-icon icon="fa-solid fa-right-from-bracket" />
          로그아웃
        </button>
      </div>
      
      <div class="text-center">
        <img
          :src="userInfo.avatar"
          alt="avatar"
          class="rounded-circle"
          width="100"
        />
      </div>
      <UserDetailReadComponent v-if="isReadMode" :isReadMode="isReadMode" :totalMoney="money.totalMoney" @updateMode="switchMode" />
      <UserDetailUpdateComponent v-else :isReadMode="isReadMode" :totalMoney="money.totalMoney" @updateMode="switchMode"  />
    </div>
  </div>
</template>

<script setup>
import { useUserInfoStore } from '@/store/user';
import UserDetailReadComponent from './UserDetailReadComponent.vue';
import UserDetailUpdateComponent from './UserDetailUpdateComponent.vue';
import { onMounted, ref } from 'vue';
import { useDataLoader } from '@/store/asset';
import { useRouter } from 'vue-router';

const router = useRouter();

const { todoList, money, loadData, loadTotal } = useDataLoader();

const userInfoStore = useUserInfoStore();
const userInfo = userInfoStore.userInfo;
const logout = userInfoStore.logout;

const props = defineProps({
  isVisible: Boolean,
});
const emit = defineEmits(['close']);

const closeModal = () => {
  isReadMode.value = true;
  emit('close');
};

const btnLogout = () => {
  closeModal();
  router.push({path: '/login'});
  logout();
};

const isReadMode = ref(true);

const switchMode = (mode) => {
  isReadMode.value = mode;
}

onMounted(() => {
  loadTotal();
});
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
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 20px;
  width: 40%;
  border-radius: 8px;
  z-index: 1001;
  /* text-align: center; */
}
</style>
