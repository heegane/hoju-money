<template>
  <!-- <div class="container-fluid"> -->
  <div class="card">
    <div class="header">
      <h3 style="color: #4D2A30; font-size: 30px;">최근 수입 목록</h3>
      <button class="add-button" @click="openCreateModal">+</button>
    </div>
    <ul>
      <li v-for="(item, index) in todoList" :key="index" class="income-item">
        <div class="left" style="color: #4D2A30; font-size: 18px;">{{ item.date.split(' ')[0] }}</div>
        <div class="center" style="color: #4D2A30; font-size: 18px;">{{ item.title }}</div>
        <div class="right" style="color: #4D2A30; font-size: 18px;">{{ item.money.toLocaleString() }}원</div>
      </li>
    </ul>
  </div>
  <div class="modal-view">
    <IncomeCreate :isVisible="openModal1" @close="closeCreateModal" />
  </div>
  <!-- </div> -->
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import IncomeCreate from '@/components/transaction/IncomeCreate.vue'
import axios from 'axios';

export default {
  components: {IncomeCreate},
  setup() {
    let todoList = reactive([]);

    const loadTotal = () => {
      axios.get("http://localhost:3001/comes")
        .then(function (response) {
          const typeOnes = response.data.filter(item => item.type == 1);
          const sortedData = typeOnes.sort((a, b) => new Date(b.date) - new Date(a.date));
          todoList.splice(0);
          todoList.push(...sortedData.slice(0, 5));
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    const openModal1 = ref(false);

    const openCreateModal = () => {
      openModal1.value = true;
    };

    const closeCreateModal = () => {
      openModal1.value = false;
    };

    onMounted(() => {
      loadTotal();
    });

    return { todoList, openModal1, openCreateModal, closeCreateModal };
  }
}
</script>

<style scoped>
.card {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 5px 0;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.add-button {
  font-size: 24px;
  background-color: #2b8ec8;
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  text-align: center;
  line-height: 36px;
}
.income-item {
    display: flex;
    align-items: center;
    padding: 5px 0;
  }

  .left {
    flex: 1;
  }

  .center {
    flex: 2;
  }

  .right {
    flex: 1;
    text-align: right;
  }
</style>
