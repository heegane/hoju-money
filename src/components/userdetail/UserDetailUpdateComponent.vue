<template>
  <div>
    <form>
      <div class="form-group my-2">
        <label for="name">이름</label>
        <input type="text" id="name" class="form-control" :placeholder="userInfo.name" v-model="newName">
      </div>
      <div class="form-group my-2">
        <label for="email">이메일</label>
        <div class="px-1" id="email">
          {{ userInfo.email }}
        </div>
      </div>
      <div class="form-group my-2">
        <label for="money">총 자산</label>
        <div class="px-1" id="money">
          {{ totalMoney.toLocaleString() }}원
        </div>
      </div>
      <div class="mt-3 text-end">
        <button type="button" class="btn btn-gray mx-2" @click="btnCancel">취소</button>
        <button type="button" class="btn btn-brown" @click="btnSave">저장</button>
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

const btnCancel = () => {
  emit('updateMode', true);
}

const btnSave = () => {
  userInfo.name = newName.value;
  updateName();
  emit('updateMode', true);
}

// const switchToReadMode = () => {
//   userInfo.name = newName.value;
//   updateName();
//   emit('updateMode', true);
// };
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
.btn-gray {
  background-color: #e7e0e2;
}
.btn-brown {
  background-color: #4D2A30;
  color: white;
}
</style>
