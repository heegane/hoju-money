<template>
    <div v-if="isVisible" class="modal-overlay">
        <div class="modal-content">
            <h2>수입 상세보기</h2>
            <label for="datepicker">날짜</label>
            <datepicker 
                v-model="income.date" 
                :disabled="!isEditable" 
                input-class="form-control">
            </datepicker> 

            <br/>
            금액
            <input type="text" v-model.number="income.money" :disabled="!isEditable">
            
            카테고리
            <div class="category">
                <button type="button" class="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown"
                    :disabled="!isEditable">
                    {{selectedCategoryName}}
                </button>
                <ul class="dropdown-menu">
                    <li v-for="category in filteredCategories" :key="category.id">
                        <a class="dropdown-item" href="#" @click="selectCategory(category.id, category.typename)"
                            :disabled="!isEditable">{{ category.typename }}</a>
                    </li>
                </ul>
            </div>

            입금계좌
            <div class="method">
                <button type="button" class="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown"
                    :disabled="!isEditable">
                    {{selectedMethodName}}
                </button>
                <ul class="dropdown-menu">
                    <li v-for="method in methods" :key="method">
                        <a class="dropdown-item" href="#" @click="selectMethod(method)" :disabled="!isEditable">{{method}}</a>
                    </li>
                </ul>
            </div>
            
            내역 
            <input type="text" v-model="income.title" :disabled="!isEditable">

            메모
            <input type="text" v-model="income.memo" :disabled="!isEditable">

            <button type="button" class="btn btn-dark" @click="enableEditing" v-if="!isEditable">수정</button>
            <button type="button" class="btn btn-dark" @click="submitForm" v-if="isEditable">수정 완료</button>
            <button type="button" class="btn btn-dark" @click="closeModal">닫기</button>
            <button type="button" class="btn btn-danger" @click="deleteId">삭제</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, defineProps, defineEmits, watch } from 'vue';
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
    date: new Date()
});
const selectedCategoryName = ref('수입 카테고리 선택');
const selectedMethodName = ref('입금 계좌 선택');
//상세보기 시 수정 불가능 > 수정 버튼 누를 시 수정 가능하도록
const isEditable = ref(false);

const dataBind = async ()=> {
    await store.fetchData();
    const comeId = store.currentComeId; // Pinia 저장소에서 셋팅할 ID를 가져옴
    const come = await store.getCome(comeId);
    if (come) {
        income.value = { ...come };
        //income.date가 string일 경우 Date 객체로 변환
        if (typeof come.date === 'string') {
            income.value.date = new Date(come.date);
        }
        
        //const category = store.categories.find(c => c.id === come.category_id);
        const category = await store.getCategories(come.category_id);
        if (category) {
            selectedCategoryName.value = category.typename;
        }
        selectedMethodName.value = come.method;
    }
}

watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    dataBind();
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
const methods = ref(['KB 마이핏 통장', 'KB ONE 통장', '신한 쏠편한 통장', 'KB 리브 메이트', 'SC제일 비씨카드', 'KB 나라사랑카드', 'K-패스 카드', '현금']);

//카테고리
const selectCategory = (id, name) => {

    income.value.category_id = Number(id);
    selectedCategoryName.value = name;
};

//입금 계좌 선택
const selectMethod = (method) => {
    income.value.method = method;
    selectedMethodName.value = method;
};

//수정완료 -> 저장
const submitForm = async () => {
    const formattedDate = formatDate(income.value.date);
    const incomeData = {
        ...income.value,
        date: formattedDate
    };
    await store.updateCome(incomeData);
    isEditable.value = false; //저장 후에 다시 막음 (수정하려면 다시 수정 버튼 클릭)
    emit('refresh'); //수정 시 IncomeView쪽 새로고침
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
            alert('삭제 완료!');
            resetForm(); //폼 초기화
            emit('refresh'); //삭제 시 IncomeView쪽 새로고침
            closeModal();
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
    emit('close');
    isEditable.value = false;
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

.modal-content .btn.btn-danger {
    background: #d9534f;
    color: white;
}

.modal-content .btn.btn-danger:hover {
    background: #c9302c;
    color: white;
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

