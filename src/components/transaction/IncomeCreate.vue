<template>
    <div v-if="isVisible" class="modal-overlay">
        <div class="modal-content">
            <h2>수입</h2>
            <label for="datepicker">날짜</label>
            <datepicker 
                v-model="income.date"
                input-class="form-control">
            </datepicker>

            금액 <br/>
            <input type="text" v-model.number="income.money"> <br/>

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

            내역 <br/>
            <input type="text" v-model="income.title"> <br/>

            메모 <br/>
            <input type="text" v-model="income.memo"> <br/>

            <button type="button" class="btn btn-dark" @click="submitForm">저장</button>
            <button type="button" class="btn btn-dark" @click="closeModal">취소</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Datepicker from 'vue3-datepicker';
import useTransactionStore from '../../store/transaction.js';

//모달창 설정
const props = defineProps({
    isVisible: Boolean,
});
const emit = defineEmits(['close']);

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

const categories = computed(() => store.categories);
//수입에 해당하는 카테고리만 필터링해서 출력
const filteredCategories = computed(() => {
    if (Array.isArray(categories.value)) {
        return categories.value.filter(category => category.type == 1);
    }
    return [];
});
//입금 계좌를 선택할 수 있는 항목
const methods = ref(['KB 마이핏 통장', 'KB ONE 통장', '신한 쏠편한 통장', 'KB 리브 메이트', 'SC제일 비씨카드', 'KB 나라사랑카드', 'K-패스 카드', '현금']);

//카테고리
const selectCategory = (id, name) => {
    income.value.category_id = id.number;
    selectedCategoryName.value = name;
};

//입금 계좌 선택
const selectMethod = (method) => {
    income.value.method = method;
    selectedMethodName.value = method;
};

//트랜젝션 저장 
const submitForm = async () => {
    const formattedDate = formatDate(income.value.date);
    const incomeData = {
        ...income.value,
        date: formattedDate
    };
    await store.updateCome(incomeData);
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

//날짜 데이터 포맷
const formatDate = (date) => {
    const pad = (n) => (n < 10 ? '0' + n : n);

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const closeModal = () => {
    resetForm();
    emit('close');
};
</script>

<style scoped>
.form-control {
    width: 200px;
    padding: 5px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.modal-content {
  background: white;
  padding: 20px;
  width: 40%;
  border-radius: 8px;
  text-align: center;
  z-index: 998;
}
</style>
