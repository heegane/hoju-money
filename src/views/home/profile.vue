<template>
<div>
  <div class="card btn py-4">
    <div class="d-flex align-items-center">
      <div>
        <img :src="userInfo.avatar" class="avatar mx-4">
      </div>
      <div class="text-left mx-5">
        <div class="font-brown fs-3 fw-bolder">반가워요 {{ userInfo.name }}님!</div>
        <div class="font-brown fs-5">{{ userInfo.email }}</div>
        <div class="font-brown fs-5 fw-bold">총자산: {{ moneyInfo.totalMoney.toLocaleString() }}원</div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, watch, watchEffect } from 'vue';
import { useUserInfoStore } from '@/store/user';
import { useMoneyInfoStore } from '@/store/asset';

const props = defineProps({
  isChange: {
    type: Boolean,
    required: true
  }
});

const userInfoStore = useUserInfoStore();
const moneyInfoStore = useMoneyInfoStore();
const userInfo = ref(userInfoStore.userInfo);
const moneyInfo = ref(moneyInfoStore.moneyInfo);

const loadData =async () => {
  await moneyInfoStore.loadTotal();
  moneyInfo.value = { ...moneyInfoStore.moneyInfo };
};

watchEffect(() => {
  loadData();
});

watch(() => props.isChange, (newVal) => {
  if (newVal) {
    loadData();
  }
}, { immediate: true });

</script>
  
<style scoped>
.font-brown {
  color: #4D2A30;
}
.card {
  display: flex;
  justify-content: center;
  align-items: center; /* 수직 중앙 정렬 */
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.details {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.avatar {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  margin-right: 10px;
}
</style>
