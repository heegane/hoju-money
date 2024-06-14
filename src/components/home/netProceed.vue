<template>
<div class="card">
    <div class="report-header">
      <div class="font-brown fs-4 fw-bolder">이번 달 순이익</div>
      <div class="font-brown fs-5">
        <span>{{moneyInfo.netMoney.toLocaleString()}}원</span>
        <span v-if="parseInt(moneyInfo.totalMoney) > 0" style=""> ▲</span>
        <span v-else-if="moneyInfo.totalMoney < 0"> ▼</span>
        <span v-else> -</span>
      </div>
    </div>
</div>
</template>

<script setup>
import { ref, watch, watchEffect } from 'vue';
import { useMoneyInfoStore } from '@/store/asset';

const props = defineProps({
  isChange: {
    type: Boolean,
    required: true
  }
});

const moneyInfoStore = useMoneyInfoStore();
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
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  align-items: center;
  justify-content: center;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 5px 0;
}
</style>