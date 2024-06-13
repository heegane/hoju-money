<template>
  <div>
    <div class="card btn">
      <div style="display:flex;">
        <div>
        <img :src="userInfo.avatar" class="avatar">
      </div>
      <div>
        <h2 style="color: #4D2A30; font-size: 25px;">{{userDetail.name}}님 안녕하세요?</h2>
              <p class="custom-text">{{userDetail.email}}</p>
              <p style="color: #4D2A30; font-size: 22px;">총자산: {{money.totalMoney.toLocaleString()}}원</p>
      </div>
        </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive,onMounted} from 'vue';
import axios from 'axios';
import { useUserInfoStore } from '@/store/user';

export default {
  setup() {
    const userInfoStore = useUserInfoStore();
    const userInfo = userInfoStore.userInfo;
    let userDetail= ref({});
    // let totalIncome;
    // let totalOutcome;
    const money = reactive({"totalMoney":0,"incomeMoney":0,"outcomeMoney":0});
      
    const loadData = () => {
      axios.get("http://localhost:3001/users/1")
      .then((response) => {
        userDetail.value = response.data;
      })
      .catch(function (error) {
          // 에러 핸들링
          console.log(error);
      })
      .finally(function () {
          // 항상 실행되는 영역
      });
    }

    const loadTotal = () => {
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
        console.log(money.outcomeMoney);
        // 컴포즈티브 방식
        // 컴포즈티브 방식
        // response.data.forEach(element => {
        //   userDetail.push(response.data);
        // });
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
      loadData();
    });
  
    return {userDetail, loadData, money, userInfo};
  }
}
</script>
  
<style scoped>
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
