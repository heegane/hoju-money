<template>
<div>
  <div class="card btn">
    <div style="display:flex;">
      <div>
        <img :src="userInfo.avatar" class="avatar">
      </div>
      <div>
        <p class="font-brown fs-3 fw-bolder">{{ userInfo.name }}님 안녕하세요?</p>
        <p class="font-brown fs-5">{{ userInfo.email }}</p>
        <p class="font-brown fs-5 fw-bold">총자산: {{ moneyInfo.totalMoney.toLocaleString() }}원</p>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { useUserInfoStore } from '@/store/user';
import { useMoneyInfoStore } from '@/store/asset';

const userInfoStore = useUserInfoStore();
const userInfo = userInfoStore.userInfo;
const moneyInfoStore = useMoneyInfoStore();
const moneyInfo = moneyInfoStore.moneyInfo;
</script>
  
<style scoped>
.font-brown {
  color: #4D2A30;
}
.card {
  display: flex;
  justify-content: center; /* 수평 중앙 정렬 */
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
.no-underline {
  text-decoration: none;
  color: inherit;
}
.horizontal-layout {
  display: flex;
  align-items: center;
  justify-content: center;
}
.custom-text {
    color: #4D2A30 ;
    font-size: 18px;
}

</style>
