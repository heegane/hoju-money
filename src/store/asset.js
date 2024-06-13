import { defineStore } from 'pinia';
import axios from 'axios';
import { reactive } from 'vue';
// import { useUserInfoStore } from './user';
// const userInfoStore = useUserInfoStore();
// const id = userInfoStore.userInfo.id;

export const useMoneyInfoStore = defineStore('moneyInfo', {
    state: () => ({
      moneyInfo: {
        incomeMoney: 0,
        outcomeMoney: 0,
        netMoney: 0,
        totalMoney: 0
      }
    }),
    actions: {
      async loadTotal() {
        try {
          const currentYear = new Date().getFullYear();
          const currentMonth = new Date().getMonth() + 1;

          const response = await axios.get(`http://localhost:3001/comes`);

          const totalIncome = response.data.reduce((total, currentValue) => {
            if (currentValue.type === 1) {
              return total + currentValue.money;
            }
            return total;
          }, 0);

          const totalOutcome = response.data.reduce((total, currentValue) => {
            if (currentValue.type === 2) {
              return total + currentValue.money;
            }
            return total;
          }, 0);

          const filteredData = response.data.filter((item) => {
            const itemDate = new Date(item.date);
            return (
                itemDate.getFullYear() === currentYear &&
                itemDate.getMonth() + 1 === currentMonth
            );
        });

          const income = filteredData.reduce((total, currentValue) => {
            if (currentValue.type === 1) {
              return total + currentValue.money;
            }
            return total;
          }, 0);
    
          const outcome = filteredData.reduce((total, currentValue) => {
            if (currentValue.type === 2) {
              return total + currentValue.money;
            }
            return total;
          }, 0);

          this.moneyInfo.totalMoney = totalIncome - totalOutcome;

          this.moneyInfo.incomeMoney = income;
          this.moneyInfo.outcomeMoney = outcome;
          this.moneyInfo.netMoney = income - outcome;
        } catch(err) {
          console.error(err);
        }
      }
    }
});
