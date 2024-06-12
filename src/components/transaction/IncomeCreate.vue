<template>
    <div>
        <h2>수입</h2>
        <label for="datepicker">날짜</label>
        <datepicker 
            v-model="income.date"
            input-class="form-control">
        </datepicker>
        <!-- <p>Selected Date: {{ income.date }}</p> -->

        금액 <br/>
        <input type="text" v-model.number="income.money"> <br/>
        <!-- <p>{{ income.money }}</p> -->

        카테고리 <br/>
        <div class="category">
            <button type="button" class="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown">
                {{selectedCategoryName}}
            </button>
            <ul class="dropdown-menu">
                <li v-for="category in filteredCategories" :key="category.id">
                    <a class="dropdown-item" href="#" @click="selectCategory(category.id, category.typename)">{{ category.typename }}</a>
                </li>
            </ul>
        </div>
        <!-- <p>Selected Category: {{ income.category_id }}</p> -->

        입금계좌 <br/>
        <div class="method">
            <button type="button" class="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown">
                {{selectedMethodName}}
            </button>
            <ul class="dropdown-menu">
                <li v-for="method in methods" :key="method">
                    <a class="dropdown-item" href="#" @click="selectMethod(method)">{{ method }}</a>
                </li>
            </ul>
        </div>
        <!-- <p>Selected Method: {{ income.method }}</p> -->

        내역 <br/>
        <input type="text" v-model="income.title"> <br/>
        <!-- <p>{{ income.title }}</p> -->

        메모 <br/>
        <input type="text" v-model="income.memo"> <br/>
        <!-- <p>{{ income.memo }}</p> -->

        <button type="button" class="btn btn-dark" @click="submitForm">저장</button>
        <button type="button" class="btn btn-dark" @click="resetForm">취소</button>
    </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import Datepicker from 'vue3-datepicker';
import useTransactionStore from '../../store/transaction.js';

export default {
    name: "IncomeCreate",
    components: {
        Datepicker
    },
    setup() {
        const store = useTransactionStore();

        const income = ref({
            users_id: 1,
            type: 1,
            title: '',
            category_id: 0,
            money: 0,
            method: '',
            memo: '',
            date: ''
        });
        
        //드롭다운 항목 선택 시 선택한 항목을 보여주기 위해
        const selectedCategoryName = ref('수입 카테고리 선택');
        const selectedMethodName = ref('입금 계좌 선택');

        onMounted(() => {
            store.fetchData();
        });

        const categories = computed(() => store.categorys);
        //수입에 해당하는 카테고리만 필터링해서 출력
        const filteredCategories = computed(() => {
            if (Array.isArray(categories.value)) {
                return categories.value.filter(category => category.type == 1);
            }
            return [];
        });
        //입금 계좌를 선택할 수 있는 항목
        const methods = ref(['mastercard', 'visa', 'americanexpress']);

        //카테고리
        const selectCategory = (id, name) => {
            income.value.category_id = id;
            selectedCategoryName.value = name;
            //income.value.category_name = name;
        };

        //입금 계좌 선택
        const selectMethod = (method) => {
            income.value.method = method;
            selectedMethodName.value = method;
        };

        //트랜젝션 저장 
        const submitForm = async () => {
            await store.createCome(income.value);
            resetForm(); //후에 데이터 생성을 위해 폼비우기
        };

        //취소 버튼 (폼 비우기)
        const resetForm = () => {
            income.value = {
                users_id: 1,
                type: 1,
                title: '',
                category_id: 0,
                money: 0,
                method: '',
                memo: '',
                date: ''
            };
            selectedCategoryName.value = '수입 카테고리 선택';
            selectedMethodName.value = '입금 계좌 선택';
        };

        return {
            income, categories, filteredCategories, methods, selectCategory, selectMethod, submitForm, resetForm, selectedCategoryName, selectedMethodName
        };
    },
};
</script>

<style scoped>
.form-control {
    width: 200px;
    padding: 5px;
}
</style>
