import axios from 'axios';
import { reactive } from 'vue';

export function useDataLoader() {
  const money = reactive({ totalMoney: 0, incomeMoney: 0, outcomeMoney: 0 });

  const loadData = () => {
    axios.get("http://localhost:3001/users/1")
    .then((response) => {
      userDetail.value = response.data;
    })
    .catch(function (error) {
        console.log(error);
    });
  }

  const loadTotal = async () => {
    try {
      const response = await axios.get('http://localhost:3001/comes');
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
      money.totalMoney = income - outcome;
    } catch (error) {
      console.error('Error loading total:', error);
    }
  }

  return { money, loadData, loadTotal };
}
