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
        totalMoney: 0
      }
    }),
    actions: {
      async loadTotal() {
        try {
          const res = await axios.get(`http://localhost:3001/comes`);

          const income = res.data.reduce((total, currentValue) => {
            if (currentValue.type === 1) {
              return total + currentValue.money;
            }
            return total;
          }, 0);
    
          const outcome = res.data.reduce((total, currentValue) => {
            if (currentValue.type === 2) {
              return total + currentValue.money;
            }
            return total;
          }, 0);

          this.moneyInfo.incomeMoney = income;
          this.moneyInfo.outcomeMoney = outcome;
          this.moneyInfo.totalMoney = income - outcome;
        } catch(err) {
          console.error(err);
        }
      }
    }
});
