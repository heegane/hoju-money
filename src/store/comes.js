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
        comeList: []
    }),
    actions: {
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
        },
        // 월별 income
        async getIncomesOfMonth(date) {
            await axios.get(`http://localhost:3001/comes?type=1&_sort=date`)
                .then((res) => {
                    // 성공 핸들링
                    const temp = res.data.reverse(); // 최근 데이터 순으로 가져오기
                    console.log(temp)
                    const t_str = date.getFullYear()+"-"+('0' + (date.getMonth()+1)).slice(-2);
                    console.log(temp.filter(e => e.date.includes(t_str)))
                    this.comeList = temp.filter(e => e.date.includes(t_str));
                })
                .catch((err) => {
                    // 에러 핸들링
                    console.log(err);
                })
        },
        // 일별 income
        async getIncomesOfDate(date) {
            await axios.get(`http://localhost:3001/comes?type=1&_sort=date`)
                .then((res) => {
                    // 성공 핸들링
                    const temp = res.data.reverse(); // 최근 데이터 순으로 가져오기
                    console.log(temp)
                    const t_str = date.getFullYear()+"-"+('0' + (date.getMonth()+1)).slice(-2)+"-"+('0' + date.getDate()).slice(-2);
                    console.log(t_str)
                    console.log(temp.filter(e => e.date.includes(t_str)))
                    this.comeList = temp.filter(e => e.date.includes(t_str));
                })
                .catch((err) => {
                    // 에러 핸들링
                    console.log(err);
                })
        },
        // 기간별 income
        async getIncomesOfPeriod(date1, date2) {
            await axios.get(`http://localhost:3001/comes?type=1&_sort=date`)
                .then((res) => {
                    // 성공 핸들링
                    const temp = res.data.reverse(); // 최근 데이터 순으로 가져오기
                    console.log(temp)
                    const start_str = date1.getFullYear()+"-"+('0' + (date1.getMonth()+1)).slice(-2)+"-"+('0' + date1.getDate()).slice(-2);
                    const end_str = date2.getFullYear()+"-"+('0' + (date2.getMonth()+1)).slice(-2)+"-"+('0' + date2.getDate()).slice(-2);
                    console.log(start_str, end_str)
                    const filteredData = temp.filter(e => {
                        const date = e.date.split(' ')[0]; // "2024-06-12 17:00:38" -> "2024-06-12"
                        return date >= start_str && date <= end_str;
                    });
                    this.comeList = filteredData;
                })
                .catch((err) => {
                    // 에러 핸들링
                    console.log(err);
                })
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
        },

        // category 별 월별 income
        async getIncomesOfCategoryAndMonth(date, id) {
            await axios.get(`http://localhost:3001/comes?category_id=${id}&_sort=date`)
                .then((res) => {
                    // 성공 핸들링
                    const temp = res.data.reverse(); // 최근 데이터 순으로 가져오기
                    console.log(temp)
                    const t_str = date.getFullYear()+"-"+('0' + (date.getMonth()+1)).slice(-2);
                    console.log(temp.filter(e => e.date.includes(t_str)))
                    this.comeList = temp.filter(e => e.date.includes(t_str));
                })
                .catch((err) => {
                    // 에러 핸들링
                    console.log(err);
                })
        },
        // category 별 일별 income
        async getIncomesOfCategoryAndDate(date, id) {
            await axios.get(`http://localhost:3001/comes?category_id=${id}&_sort=date`)
                .then((res) => {
                    // 성공 핸들링
                    const temp = res.data.reverse(); // 최근 데이터 순으로 가져오기
                    const t_str = date.getFullYear()+"-"+('0' + (date.getMonth()+1)).slice(-2)+"-"+('0' + date.getDate()).slice(-2);
                    console.log(t_str)
                    console.log(temp.filter(e => e.date.includes(t_str)))
                    this.comeList = temp.filter(e => e.date.includes(t_str));
                })
                .catch((err) => {
                    // 에러 핸들링
                    console.log(err);
                })
        },
         // category 별 기간별 income
         async getIncomesOfCategoryAndPeriod(date1, date2, id) {
            await axios.get(`http://localhost:3001/comes?category_id=${id}&_sort=date`)
                .then((res) => {
                    // 성공 핸들링
                    const temp = res.data.reverse(); // 최근 데이터 순으로 가져오기
                    console.log(temp)
                    const start_str = date1.getFullYear()+"-"+('0' + (date1.getMonth()+1)).slice(-2)+"-"+('0' + date1.getDate()).slice(-2);
                    const end_str = date2.getFullYear()+"-"+('0' + (date2.getMonth()+1)).slice(-2)+"-"+('0' + date2.getDate()).slice(-2);
                    console.log(start_str, end_str)
                    const filteredData = temp.filter(e => {
                        const date = e.date.split(' ')[0]; // "2024-06-12 17:00:38" -> "2024-06-12"
                        return date >= start_str && date <= end_str;
                    });
                    this.comeList = filteredData;
                })
                .catch((err) => {
                    // 에러 핸들링
                    console.log(err);
                })
        },
        ////////////////////////////////////////////////////
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
                
        }
        // getComeDetail(id) {
        //     axios.get(`http://localhost:3001/comes/${id}`)
        //         .then((res) => {
        //             // 성공 핸들링
        //             this.come.id = res.data.id;
        //             this.come.user_id = res.data.user_id;
        //             this.come.type = res.data.type;
        //             this.come.title = res.data.title;
        //             this.come.category_id = res.data.category_id;
        //             this.come.money = res.data.money;
        //             this.come.method = res.data.method;
        //             this.come.memo = res.data.memo;
        //             this.come.date = res.data.date;
        //         })
        //         .catch((err) => {
        //             // 에러 핸들링
        //             console.log(err);
        //         })
                
        // }
    }
});