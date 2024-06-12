<template>
    <router-link to="/login">
    <div class="card"  >
      <div class="profile" v-for="todo in todoList">
             <div class="details">
          <h2>{{todo.name}}님 안녕하세요?</h2>
          <p>{{todo.email}}</p>
          <p>{{money.totalMoney.toLocaleString()}}원</p>
        </div>
      </div>
    </div>
  </router-link>
  </template>




  <script>
  import { reactive,onMounted} from 'vue';
  import axios from 'axios';
  export default {
      //객체참조이고 setup안에서 let해놓으면 안된다.
      //todoList=response.data;
      //todoList상수를 선언했으니까 todoList=response.data; 불가능
      
      //const todoList=ref([]);  todoList.value=response.data;
  
      //const todoList=reacvie({todoList:[]})
      //todoList.todoList=response.data;
  
      setup()
      {
          let todoList=reactive([]);
        //   let totalIncome;
        //   let totalOutcome;
          const money = reactive({"totalMoney":0,"incomeMoney":0,"outcomeMoney":0});
          
          const loadData=()=>{
              //axios로 데이터를 불러와서 todoList에 전달한다
              axios.get("http://localhost:3001/users/1")
              .then(function (response) {
                  
                // 성공 핸들링
                //   console.log(response.data);
                  //컴포즈티브 방식
                //   response.data.forEach(element => {
                      todoList.push(response.data);
                      
                //   });
              })
              .catch(function (error) {
                  // 에러 핸들링
                  console.log(error);
              })
              .finally(function () {
                  // 항상 실행되는 영역
              });
          
  
          }

          const loadTotal=()=>{
              //axios로 데이터를 불러와서 todoList에 전달한다
              axios.get("http://localhost:3001/comes")
              .then(function (response) {
               
                let income = response.data.reduce((total, currentValue) => {
                        if (currentValue.type === 1) {
                            return total + currentValue.money;
                        }
                        return total;
                }, 0);

                let outcome = response.data.reduce((total, currentValue) => {
                        if (currentValue.type === 2) {
                            return total + currentValue.money;
                        }
                        return total;
                }, 0);


                money.incomeMoney = income;
                money.outcomeMoney = outcome;
                money.totalMoney =income-outcome; 
                
                // 성공 핸들링
                  console.log(money.totalMoney);
                  console.log(money.incomeMoney);
                  //컴포즈티브 방식
                  console.log(money.outcomeMoney);
                  //컴포즈티브 방식
                  //컴포즈티브 방식
                //   response.data.forEach(element => {
                    //   todoList.push(response.data);
                      
                //   });
              })
              .catch(function (error) {
                  // 에러 핸들링
                  console.log(error);
              })
              .finally(function () {
                  // 항상 실행되는 영역
              });
          
  
          }
  
  onMounted(()=>{
        loadTotal();
          loadData(); //localhost:5173/todo/list
    
  })
          //함수호출
          return {todoList,loadData,money};
      }
  }
  </script>
  <style lang="">
      
  </style>
<style scoped>
.card {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}
.profile img {
  width: 50px;
  border-radius: 50%;
}
.details {
  margin-top: 10px;
}
</style>