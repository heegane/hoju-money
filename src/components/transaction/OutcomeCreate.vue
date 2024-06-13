<template>
    <div v-if="isVisible" class="modal-overlay">
        <div class="modal-content">
            <h2>지출</h2>
            <label for="datepicker">날짜</label>
            <datepicker 
                v-model="outcome.date"
                input-class="form-control">
            </datepicker>

            <br/>
            금액
            <input type="text" v-model.number="outcome.money">

            카테고리
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

            결제수단
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

            내역
            <input type="text" v-model="outcome.title">

            메모
            <input type="text" v-model="outcome.memo">

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

const outcome = ref({
    users_id: 1,
    type: 2,
    title: '',
    category_id: 7,
    money: 0,
    method: '',
    memo: '',
    date: new Date()
});

//드롭다운 항목 선택 시 선택한 항목을 보여주기 위해
const selectedCategoryName = ref('지출 카테고리 선택');
const selectedMethodName = ref('결제수단 선택');

onMounted(() => {
    store.fetchData();
});

const categories = computed(() => store.categories);
//지출에 해당하는 카테고리만 필터링해서 출력
const filteredCategories = computed(() => {
    if (Array.isArray(categories.value)) {
        return categories.value.filter(category => category.type == 2);
    }
    return [];
});

//결제수단을 선택할 수 있는 항목
const methods = ref(['KB 마이핏 통장', 'KB ONE 통장', '신한 쏠편한 통장', 'KB 리브 메이트', 'SC제일 비씨카드', 'KB 나라사랑카드', 'K-패스 카드', '현금']);

//카테고리
const selectCategory = (id, name) => {
    outcome.value.category_id = Number(id);
    selectedCategoryName.value = name;
};

//결제수단 선택
const selectMethod = (method) => {
    outcome.value.method = method;
    selectedMethodName.value = method;
};

//트랜젝션 저장 
const submitForm = async () => {
    const formattedDate = formatDate(outcome.value.date);
    const outcomeData = {
        ...outcome.value,
        date: formattedDate
    };
    await store.createCome(outcomeData);
    resetForm(); //후에 데이터 생성을 위해 폼비우기
    emit('refresh'); //저장 시 IncomeView쪽 새로고침
    closeModal();
};

//취소 버튼 (폼 비우기)
const resetForm = () => {
    outcome.value = {
        users_id: 1,
        type: 2,
        title: '',
        category_id: 7,
        money: 0,
        method: '',
        memo: '',
        date: new Date()
    };
    selectedCategoryName.value = '지출 카테고리 선택';
    selectedMethodName.value = '결제 수단 선택';
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
    width: 100%;
    padding: 8px;
    margin: 5px 0;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
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
    padding: 15px;
    width: 90%;
    max-width: 400px;
    border-radius: 8px;
    text-align: left;
    z-index: 999;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    max-height: 80%;
    overflow-y: auto;
}

.modal-content h2 {
    text-align: center;
    margin-bottom: 15px;
    font-size: 18px;
}

.modal-content label {
    font-weight: bold;
    margin-top: 8px;
    display: block;
    font-size: 14px;
}

.modal-content input[type="text"],
.modal-content textarea {
    width: 100%;
    padding: 8px;
    margin: 5px 0 15px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 14px;
}

.modal-content textarea {
    height: 80px;
}

.modal-content .category,
.modal-content .method {
    position: relative;
    margin-bottom: 15px;
}

.modal-content .btn {
    width: 100%;
    padding: 8px;
    margin: 5px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: #f5f5f5;
    font-size: 14px;
    cursor: pointer;
}

.modal-content .btn:hover {
    background: #e0e0e0;
}

.modal-content .btn.btn-dark {
    background: #4d2a30;
    color: white;
}

.modal-content .btn.btn-dark:hover {
    background: #4d2a30b0;
    color: white
}

.modal-content .dropdown-menu {
    width: 100%;
}

.modal-content .actions {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}

.modal-content .actions .btn {
    width: 48%;
    margin: 5px 0;
}

/* 스크롤바 css */
.modal-content::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.modal-content::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
    visibility: hidden; /* 스크롤바 숨기기 */
}

.modal-content:hover::-webkit-scrollbar-thumb {
    visibility: visible; /* 호버 시 스크롤바 보이게 */
}

.modal-content:hover::-webkit-scrollbar-thumb:hover {
    background: #555;
}

@media (max-width: 768px) {
    .modal-content {
        width: 90%;
        padding: 10px;
    }

    .modal-content .actions .btn {
        width: 100%;
    }
}
</style>
