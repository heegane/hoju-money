<template>
    <div>
        <h2>수입</h2>
        <label for="datepicker">날짜</label>
        <datepicker 
            v-model="income.date"
            :disabled="!isEditable"
            input-class="form-control">
        </datepicker>

        <!-- datepicker 아이콘으로 변경 -->
        <!-- <datepicker 
          v-model="income.date"
          :disabled="!isEditable"
          input-class="form-control">
            <template #input>
            <div class="icon-wrapper" @click="toggleDatepicker">
                <i class="fas fa-calendar-alt"></i>
            </div>
            </template>
        </datepicker> -->

        금액 <br/>
        <input type="text" v-model.number="income.money" :disabled="!isEditable"> <br/>

        카테고리 <br/>
        <div class="category">
            <button type="button" class="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" :disabled="!isEditable">
                {{selectedCategoryName}}
            </button>
            <ul class="dropdown-menu">
                <li v-for="category in filteredCategories" :key="category.id">
                    <a class="dropdown-item" href="#" @click="selectCategory(category.id, category.typename)" :disabled="!isEditable">{{ category.typename }}</a>
                </li>
            </ul>
        </div>

        입금계좌 <br/>
        <div class="method">
            <button type="button" class="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" :disabled="!isEditable">
                {{selectedMethodName}}
            </button>
            <ul class="dropdown-menu">
                <li v-for="method in methods" :key="method">
                    <a class="dropdown-item" href="#" @click="selectMethod(method)" :disabled="!isEditable">{{ method }}</a>
                </li>
            </ul>
        </div>

        내역 <br/>
        <input type="text" v-model="income.title" :disabled="!isEditable"> <br/>

        메모 <br/>
        <input type="text" v-model="income.memo" :disabled="!isEditable"> <br/>

        <button type="button" class="btn btn-dark" @click="enableEditing" v-if="!isEditable">수정</button>
        <button type="button" class="btn btn-dark" @click="submitForm" v-if="isEditable">수정 완료</button>
        <button type="button" class="btn btn-danger" @click="deleteId">삭제</button>
        <button type="button" class="btn btn-dark" @click="resetForm">닫기</button>
    </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import Datepicker from 'vue3-datepicker';
import useTransactionStore from '../../store/transaction.js';

export default {
    name: "IncomeUpdateDelete",
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
            date: new Date()
        });
        
        const selectedCategoryName = ref('수입 카테고리 선택');
        const selectedMethodName = ref('입금 계좌 선택');
        //상세보기 시 수정 불가능 > 수정 버튼 누를 시 수정 가능하도록
        const isEditable = ref(false);

        onMounted(async () => {
            await store.fetchData();
            const comeId = store.currentComeId; // Pinia 저장소에서 셋팅할 ID를 가져옴
            // console.log("comeId은 잘 들어감")
            // console.log(comeId)
            const come = await store.getCome(comeId);
            if (come) {
                income.value = { ...come };
                // console.log(income);
                // console.log("잘들어감?");
                
                //income.date가 string일 경우 Date 객체로 변환
                if (typeof come.date === 'string') {
                    income.value.date = new Date(come.date);
                }
                
                const category = store.categories.find(c => c.id === come.category_id);
                if (category) {
                    selectedCategoryName.value = category.typename;
                }
                selectedMethodName.value = come.method;
            }
        });

        const categories = computed(() => store.categories);
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

        //수정완료 -> 저장
        const submitForm = async () => {
            await store.updateCome(income.value);
            //resetForm(); //닫기 전까지는 계속 수정할 수 있게 폼 안비움
            isEditable.value = false; //저장 후에 다시 막음 (수정하려면 다시 수정 버튼 클릭)
        };

        //수정 버튼 (수정/수정완료)
        const enableEditing = () => {
            isEditable.value = true;
        };

        //삭제
        const deleteId = async () => {
            const comeId = store.currentComeId;
            if (comeId) {
                try {
                    await store.deleteCome(comeId);
                    alert('Deleted income successfully');
                    resetForm(); //폼 초기화
                } catch (error) {
                    console.error('There was an error deleting the come!', error);
                }
            } else {
                console.error('Invalid ID for deletion');
            }
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
                date: new Date()
            };
            selectedCategoryName.value = '수입 카테고리 선택';
            selectedMethodName.value = '입금 계좌 선택';
            isEditable.value = false;
            //창 닫기 추가하기
        };

        return {
            income, categories, filteredCategories, methods, 
            selectCategory, selectMethod, submitForm, resetForm, 
            selectedCategoryName, selectedMethodName,
            enableEditing, isEditable, deleteId
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
