//스토어를 만든다.
import { defineStore } from 'pinia';
import axios from 'axios';

export const useComesStore = defineStore('comes', {
    state: () => ({
        come: {
            "id": "",
            "user_id": "",
            "type": "",
            "title": "",
            "category_id": "",
            "money": "",
            "method": "",
            "memo": "",
            "date": ""
        },
        comeList: [],
        currentTime: { "curYear": "-1", "curMonth": '-1', "curDate": "-1" }

    }),
    actions: {
        // date setting
        async setDate(now) {
            console.log(now)
            this.currentTime.curYear = now.getFullYear();
            this.currentTime.curMonth = now.getMonth() + 1;
            this.currentTime.curDate = now.getDate();
        },
        // income && outcome
        getComeList() {
            axios.get('http://localhost:3001/comes&_sort=date')
                .then((res) => {
                    // 성공 핸들링
                    this.comeList = res.data.reverse();
                })
                .catch((err) => {
                    // 에러 핸들링
                    console.log(err);
                })
                .finally(() => {
                    // 항상 실행되는 영역
                });
        },
        // income만
        async getIncomeList() {
            await axios.get('http://localhost:3001/comes?type=1&_sort=date')
                .then((res) => {
                    // 성공 핸들링
                    this.comeList = res.data.reverse(); // 최근 데이터 순으로 가져오기
                })
                .catch((err) => {
                    // 에러 핸들링
                    console.log(err);
                })
                .finally(() => {
                    // 항상 실행되는 영역
                });
        },
        // 월별 income
        async getIncomesOfMonth() {
            await axios.get('http://localhost:3001/comes?type=1&_sort=date')
                .then((res) => {
                    // 성공 핸들링
                    const temp = res.data.reverse(); // 최근 데이터 순으로 가져오기
                    this.comeList = temp.filters(e => e.date) // e.date 값이 포함하는지
                })
                .catch((err) => {
                    // 에러 핸들링
                    console.log(err);
                })
                .finally(() => {
                    // 항상 실행되는 영역
                });
        },
        // category 별 income
        async getIncomesOfCategory(id) {
            await axios.get(`http://localhost:3001/comes?category_id=${id}&_sort=date`)
                .then((res) => {
                    // 성공 핸들링
                    this.comeList = res.data.reverse(); // 최근 데이터 순으로 가져오기

                })
                .catch((err) => {
                    // 에러 핸들링
                    console.log(err);
                })
                .finally(() => {
                    // 항상 실행되는 영역
                });
        },
        // outcome만
        getOutcomeList() {
            axios.get('http://localhost:3001/comes?type=2&_sort=date')
                .then((res) => {
                    // 성공 핸들링
                    this.comeList = res.data.reverse();
                })
                .catch((err) => {
                    // 에러 핸들링
                    console.log(err);
                })
                .finally(() => {
                    // 항상 실행되는 영역
                });
        },
        getComeDetail(id) {
            axios.get(`http://localhost:3001/comes/${id}`)
                .then((res) => {
                    // 성공 핸들링
                    this.come.id = res.data.id;
                    this.come.user_id = res.data.user_id;
                    this.come.type = res.data.type;
                    this.come.title = res.data.title;
                    this.come.category_id = res.data.category_id;
                    this.come.money = res.data.money;
                    this.come.method = res.data.method;
                    this.come.memo = res.data.memo;
                    this.come.date = res.data.date;
                })
                .catch((err) => {
                    // 에러 핸들링
                    console.log(err);
                })
                .finally(() => {
                    // 항상 실행되는 영역
                });
        }
    }
});