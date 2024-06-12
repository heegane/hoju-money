<template>
  <div class="card">
    <div class="header">
      <h3>최근 수입 목록</h3>
      <router-link to="/login" class="add-button">+</router-link>
    </div>
    <ul>
      <li v-for="(item, index) in todoList" :key="index">{{ item.date}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ item.title}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ item.money }}원</li>
    </ul>
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue';
import axios from 'axios';

export default {
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

    onMounted(() => {
      loadTotal();
    });

    return { todoList };
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
</style>
