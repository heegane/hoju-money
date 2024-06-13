<template>
    <div class="card">
      <div class="header">
        <h3 style="color: #4D2A30; font-size: 30px;">최근 지출 목록</h3>
        <button class="add-button" @click="openCreateModal">+</button>
    </div>
      <ul>
      <li v-for="(item, index) in todoList" :key="index" class="income-item">
        <div class="left"style="color: #4D2A30; font-size: 18px;">{{ item.date.split(' ')[0]}}</div>
        <div class="center"style="color: #4D2A30; font-size: 18px;">{{ item.title }}</div>
        <div class="right"style="color: #4D2A30; font-size: 18px;">{{ item.money.toLocaleString() }}원</div>
      </li>
    </ul>
    </div>

    <OutcomeCreate :isVisible="openModal1" @close="closeCreateModal" />
 
  </template>
  
  <script>
  import { ref,reactive,onMounted} from 'vue';
  import OutcomeCreate from '@/components/transaction/OutcomeCreate.vue'
  import axios from 'axios';
  export default {
    components: {OutcomeCreate},
      //객체참조이고 setup안에서 let해놓으면 안된다.
      //todoList=response.data;
      //todoList상수를 선언했으니까 todoList=response.data; 불가능
      
      //const todoList=ref([]);  todoList.value=response.data;
  
      //const todoList=reacvie({todoList:[]})
      //todoList.todoList=response.data;
  
      setup()
      {
          let todoList=reactive([]);
        //   let totalOutcome;
        //   let totalOutcome;
        
          const loadTotal=()=>{
              //axios로 데이터를 불러와서 todoList에 전달한다
              axios.get("http://localhost:3001/comes")
              .then(function (response) {
            const typeOnes = response.data.filter(item => item.type == 2);
           
            const sortedData = typeOnes.sort((a, b) => new Date(b.date) - new Date(a.date));
            // console.log(sortedData)
            console.log(sortedData);
            todoList.splice(0); // 기존 데이터 초기화
            todoList.push(...sortedData.slice(0, 5)); // 최근 5개 데이터 추가
            console.log(todoList);
            
     
              })
              .catch(function (error) {
                  // 에러 핸들링
                  console.log(error);
              })
              .finally(function () {
                  // 항상 실행되는 영역
              });
          
  
          }
          const openModal1 = ref(false);

    const openCreateModal = () => {
      openModal1.value = true;
    };

    const closeCreateModal = () => {
      openModal1.value = false;
    };
  
  onMounted(()=>{
      
          loadTotal(); //localhost:5173/todo/list
    
  })
          //함수호출
          return {todoList, openModal1, openCreateModal, closeCreateModal};
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
  