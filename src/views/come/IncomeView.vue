<template lang="">
    <div class="container">
        <div class="monpick-div">
            <button class="btn" type="button" @click="prevMonth()">&lt;</button>
            <h1>{{comesStore.currentTime.curYear}}년 {{comesStore.currentTime.curMonth}}월</h1>
            <button class="btn" type="button" @click="nextMonth()">&gt;</button>
        </div>
        <div class="select-div bg-light">
            <div class="date-div">
                <div>
                    <select class="form-select" v-model="dateType">
                        <option :value=0>일별</option>
                        <option :value=1>월별</option>
                        <option :value=2>기간별</option>
                    </select>
                </div>
                <div v-if="dateType === 0">
                    <DatePicker :locale="ko" v-model="date0" />
                </div>
                <div v-if="dateType === 1">
                    <DatePicker :locale="ko" v-model="date1" startingView='month' minimumView='month' inputFormat="yyyy-MM" />
                </div>
                <div class="period-div" v-if="dateType === 2">
                    <DatePicker :locale="ko" v-model="date2" /> 
                    <div class="m-1">~</div>
                    <DatePicker :locale="ko" v-model="date3" />
                </div>
                
            </div>
            <div class="category-div">
                <select class="form-select" v-model="select1" v-on:change="onChangeCategory(select1)">
                    <option :value="0">전체</option>
                    <option v-for="category in categorysStore.categoryList" :value="category.id">{{category.typename}}</option>
                </select>
            </div>
        </div>
        <div class="list-div mt-5">
                <table class="table">
                    <thead>
                    <tr>
                        <th>날짜</th>
                        <th>분류</th>
                        <th>내역</th>
                        <th>금액</th>
                        <th>결제 수단</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="income in pageData">
                        <td>{{income.date.split(" ")[0]}}</td>
                        <td>{{categorysStore.categoryList[income.category_id-1].typename}}</td>
                        <td>{{income.title}}</td>
                        <td>{{income.money}} 원</td>
                        <td>{{income.method}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="page-nation-div">
                
                <ul class="pagination justify-content-center">
                    <li class="page-item"><a class="page-link" href="javascript:void(0);" @click="onPrevPage()">&lt;</a></li>
                    <li class="page-item" v-for="i in parseInt(totalPageCount)" :key="i" :class="{ active: i - 1 === parseInt(pageState) }"><a class="page-link" href="#" @click="onChangePage(i-1)">{{i}}</a></li>
                    <li class="page-item"><a class="page-link" href="javascript:void(0);" @click="onNextPage()">&gt;</a></li>
                </ul>
            </div>

    </div>
</template>
<script>
import DatePicker from 'vue3-datepicker';
import { onMounted, reactive, ref, toRaw } from 'vue';
import { useCategorysStore } from '@/store/categorys';
import { useComesStore } from '@/store/comes';

export default {
    components: {DatePicker},
    setup() {
        const today = new Date();
        console.log(today)
        // const year = ref(comesStore.currentTime.curYear);
        // const month = ref(today.getMonth()+1);

        const prevMonth = () => {
            if (comesStore.currentTime.curMonth == 1) {
                // year.value = year.value - 1;
                comesStore.currentTime.curYear = comesStore.currentTime.curYear - 1;
                comesStore.currentTime.curMonth = 12;
            }
            else {
                comesStore.currentTime.curMonth = comesStore.currentTime.curMonth -1;
            }
            
        }

        const nextMonth = () => {
            if (comesStore.currentTime.curMonth == 12) {
                comesStore.currentTime.curYear = comesStore.currentTime.curYear + 1;
                // year.value = year.value + 1;
                comesStore.currentTime.curMonth = 1;
            }
            else {
                comesStore.currentTime.curMonth = comesStore.currentTime.curMonth + 1;
            }
            
        }

        const date0 = ref(); // 일별
        const date1 = ref(); // 월별
        const date2 = ref(); // 기간별 start
        const date3 = ref(); // 기간별 end
        const dateType = ref(0);
        const totalPageCount = ref(0);
        const categorysStore = useCategorysStore();
        const comesStore = useComesStore();

        let pageState = ref(0);
        let pageData = ref([]);

        let select1 = ref(0);

        const bindData = (arr)=> {
            const temp = [...toRaw(arr)];
            totalPageCount.value = parseInt(temp.length / 10) + 1;
            pageData.value = [...temp.slice(pageState.value*10+1, pageState.value*10+1+10)];
            
        }

        onMounted(async ()=>{
            // get income categorys 
            await comesStore.setDate(today);
            console.log(comesStore.currentTime.curYear, '/', comesStore.currentTime.curMonth, '/', comesStore.currentTime.curDate)
            categorysStore.getIncomeCategoryList();
            await comesStore.getIncomeList();
            bindData(comesStore.comeList);
            
        })

        const onChangePage = (page) => {
            pageState.value = page;
            bindData(comesStore.comeList);
        }

        const onPrevPage = () => {
            if(pageState.value != 0) {
                pageState.value = pageState.value - 1;
                bindData(comesStore.comeList);
            }
        }

        const onNextPage = () => {
            if(pageState.value < totalPageCount.value-1) {
                pageState.value = pageState.value + 1;
                bindData(comesStore.comeList);
            }
            
        }

        const onChangeCategory = async (id) => {
            pageState.value = 0

            if ( id == 0 ) {
                await comesStore.getIncomeList();
                bindData(comesStore.comeList);
            }
            else {
                await comesStore.getIncomesOfCategory(id);
                bindData(comesStore.comeList);
            }

        }
        return {prevMonth, nextMonth, date0, date1, date2, date3, dateType, pageState, totalPageCount, pageData, categorysStore, comesStore, onChangePage, onPrevPage, onNextPage, select1, onChangeCategory};
    }
}

</script>
<style scoped>
.select-div, .date-div, .period-div, .monpick-div{
    display : flex;
    align-items: center;
}
.page-item.active .page-link {
    background-color: #2B8EC8;
    border-color: #2B8EC8;
    font-weight: bold;
    
}
</style>
