<template>
    <div v-if="isVisible" class="modal-overlay">
        <div class="modal-content">
            <h2>지출 입력</h2>
            <label for="datepicker">날짜</label>
            <datepicker 
                v-model="outcome.date"
                :disabled="!isEditable"
                input-class="form-control">
            </datepicker>

            금액 <br/>
            <input type="text" v-model.number="outcome.money" :disabled="!isEditable"> <br/>

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

            결제수단 <br/>
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
            <input type="text" v-model="outcome.title" :disabled="!isEditable"> <br/>

            메모 <br/>
            <input type="text" v-model="outcome.memo" :disabled="!isEditable"> <br/>

            <button type="button" class="btn btn-dark" @click="enableEditing" v-if="!isEditable">수정</button>
            <button type="button" class="btn btn-dark" @click="submitForm" v-if="isEditable">수정 완료</button>
            <button type="button" class="btn btn-danger" @click="deleteId">삭제</button>
            <button type="button" class="btn btn-dark" @click="closeModal">닫기</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, defineProps, defineEmits, watch } from 'vue';
import Datepicker from 'vue3-datepicker';
import useTransactionStore from '../../store/transaction.js';

const props = defineProps({
    isVisible: Boolean,
});
const emit = defineEmits(['close']);

const store = useTransactionStore();

const outcome = ref({
    users_id: 1,
    type: 1,
    title: '',
    category_id: 0,
    money: 0,
    method: '',
    memo: '',
    date: new Date()
});
    
const selectedCategoryName = ref('지출 카테고리 선택');
const selectedMethodName = ref('결제수단 선택');
//상세보기 시 수정 불가능 > 수정 버튼 누를 시 수정 가능하도록
const isEditable = ref(false);

const dataBind = async ()=> {
    await store.fetchData();
    const comeId = store.currentComeId; // Pinia 저장소에서 셋팅할 ID를 가져옴
    const come = await store.getCome(comeId);
    if (come) {
        outcome.value = { ...come };
        //outcome.date가 string일 경우 Date 객체로 변환
        if (typeof come.date === 'string') {
            outcome.value.date = new Date(come.date);
        }
        
        //const category = store.categories.find(c => c.id === come.category_id);
        const category = await store.getCategories(come.category_id);
        if (category) {
            selectedCategoryName.value = category.typename;
        }
        selectedMethodName.value = come.method;
    }
};

watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    dataBind();
  } 
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

//수정완료 -> 저장
const submitForm = async () => {
    const formattedDate = formatDate(outcome.value.date);
    const outcomeData = {
        ...outcome.value,
        date: formattedDate
    };
    await store.updateCome(outcomeData);
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
            alert('Deleted outcome successfully');
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
    outcome.value = {
        users_id: 1,
        type: 1,
        title: '',
        category_id: 0,
        money: 0,
        method: '',
        memo: '',
        date: new Date()
    };
    selectedCategoryName.value = '지출 카테고리 선택';
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
}

.modal-content {
    background: white;
    padding: 20px;
    width: 40%;
    border-radius: 8px;
    text-align: center;
    z-index : 999;
}
</style>