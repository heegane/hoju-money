<template>
  <div>
    <form>
      <div class="form-group">
        <label for="exampleInputEmail1">이름</label>
        <input type="text" id="newName" class="form-control" :placeholder="userInfo.name" v-model="newName">
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">이메일</label>
        <input type="password" class="form-control" :placeholder="userInfo.email" readonly>
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">총 자산</label>
        <input type="password" class="form-control" :placeholder="`${totalMoney.toLocaleString()}원`" readonly>
      </div>
      <div class="text-center">
        <button type="button" class="btn btn-primary" @click="switchToReadMode">저장하기</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useUserInfoStore } from '@/store/user';
import { ref } from 'vue';

const userInfoStore = useUserInfoStore();
const userInfo = userInfoStore.userInfo;
const updateName = userInfoStore.updateName;

const newName = ref(userInfo.name);

const props = defineProps({
  isReadMode: Boolean,
  totalMoney: Number
});

const emit = defineEmits(['updateMode']);

const switchToReadMode = () => {
  userInfo.name = newName.value;
  updateName();
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
