<template lang="">
  <div class="container card view-box mt-5">
    <div class="monpick-div mb-3" v-if="dateType == 0 && month">
      <button class="btn" type="button" @click="prevMonth()"><font-awesome-icon icon="fa-solid fa-chevron-left" /></button>
      <span class="fs-2 font-brown fw-bold"> {{month.getFullYear()}}년 {{month.getMonth()+1}}월 </span>
        <button class="btn" type="button" @click="nextMonth()"><font-awesome-icon icon="fa-solid fa-chevron-right" /></button>
    </div>
    <div class="select-div mx-0">
      <div class="date-div">
        <div>
          <select
            class="form-select"
            v-model="dateType"
            @change="onChangeDateType(dateType)"
          >
            <option :value="0">월별</option>
            <option :value="1">일별</option>
            <option :value="2">기간별</option>
            <option :value="3">전체</option>
          </select>
        </div>
        <div class="picker-div" v-if="dateType === 0">
          <DatePicker
            :locale="ko"
            v-model="month"
            @update:modelValue="onChangeMonth"
            startingView="month"
            minimumView="month"
            inputFormat="yyyy-MM"
          />
        </div>
        <div class="picker-div" v-if="dateType === 1">
          <DatePicker
            :locale="ko"
            v-model="date"
            @update:modelValue="onChangeDate"
          />
        </div>
        <div class="period-div" v-if="dateType === 2">
          <DatePicker
            :locale="ko"
            v-model="startDate"
            @update:modelValue="onChangeStartDate"
          />
          <div class="m-1">~</div>
          <DatePicker
            :locale="ko"
            v-model="endDate"
            @update:modelValue="onChangeEndDate"
          />
        </div>
      </div>
      <div class="category-div">
        <select
          class="form-select"
          v-model="categorySelect"
          @change="onChangeCategory(categorySelect)"
        >
          <option :value="0">전체</option>
          <option
            v-for="category in categoriesStore.categoryList"
            :value="category.id"
          >
            {{category.typename}}
          </option>
        </select>
      </div>
      <div class="d-flex justify-content-end" style="width: 60%">
        <button type="button" class="btn btn-brown" @click="openCreateModal">추가</button>
      </div>
    </div>
    <div class="list-div mt-2 d-flex justify-content-center">
      <table class="table">
        <thead>
          <tr>
            <th class="text-center">날짜</th>
            <th class="text-center">분류</th>
            <th class="text-center">지출 내역</th>
            <th class="text-center">금액</th>
            <th class="text-center">결제 수단</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="outcome in pageData" @click="openDetailModal(outcome.id)">
            <td class="text-center">{{outcome.date.split(" ")[0]}}</td>
            <td class="text-center">
              {{categoriesStore.categoryList[outcome.category_id-7].typename}}
            </td>
            <td class="text-start">{{outcome.title}}</td>
            <td class="text-start">{{outcome.money}} 원</td>
            <td class="text-start">{{outcome.method}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagenation-div mt-3">
      <ul class="pagination justify-content-center">
        <li class="page-item">
          <a class="page-link" href="javascript:void(0);" @click="onPrevPage()"
          ><font-awesome-icon icon="fa-solid fa-chevron-left" /></a
          >
        </li>
        <li
          class="page-item"
          v-for="i in parseInt(totalPageCount)"
          :key="i"
          :class="{ active: i - 1 === parseInt(pageState) }"
        >
          <a class="page-link" href="#" @click="onChangePage(i-1)">{{i}}</a>
        </li>
        <li class="page-item">
          <a class="page-link" href="javascript:void(0);" @click="onNextPage()"
          ><font-awesome-icon icon="fa-solid fa-chevron-right" /></a
          >
        </li>
      </ul>
    </div>
    <div class="modal-view">
      <OutcomeUpdateDelete :isVisible="openModal" @close="closeModal" @refresh="refreshData"/>
    </div>
    <div class="modal-view">
      <OutcomeCreate :isVisible="openModal1" @close="closeCreateModal" @refresh="refreshData"/>
    </div>
  </div>
</template>
<script>
import DatePicker from 'vue3-datepicker';
import OutcomeUpdateDelete from '@/components/transaction/OutcomeUpdateDelete.vue'
import OutcomeCreate from '@/components/transaction/OutcomeCreate.vue'
import { useRoute } from 'vue-router';
import { onMounted, reactive, ref, toRaw } from 'vue';
import { useCategoriesStore } from '@/store/categories';
import { useComesStore } from '@/store/comes';
import { useTransactionStore } from '@/store/transaction';

export default {
    components: {DatePicker, OutcomeUpdateDelete, OutcomeCreate },
    setup() {
        const route = useRoute();
        const today = new Date(); // 현재 날짜 저장
        const month = ref(); // 월별
        const date = ref(); // 일별
        const startDate = ref(); // 기간별 start
        const endDate = ref(); // 기간별 end
        const dateType = ref(0); // 월별 || 일별 || 기간별 || 전체
        const totalPageCount = ref(0); // 전체 페이지 수

        const categoriesStore = useCategoriesStore();
        const comesStore = useComesStore();
        const transactionStore = useTransactionStore();

        let pageState = ref(0); // current pageNum
        let pageData = ref([]); // current pageData(List)
        let categorySelect = ref(0); // category_id

        const openModal = ref(false);

        const openDetailModal = (id) => {
          transactionStore.currentComeId = id;
          console.log(transactionStore.currentComeId)
          openModal.value = true;
          console.log(openModal.value)
        };

        const closeModal = () => {
          openModal.value = false;
        };

        const openModal1 = ref(false);

        const openCreateModal = () => {
          openModal1.value = true;
        };

        const closeCreateModal = () => {
          openModal1.value = false;
        };

        // data bind func
        const bindData = (arr)=> {
            const temp = [...toRaw(arr)];
            totalPageCount.value = Math.ceil(temp.length / 10);
            pageData.value = [...temp.slice(pageState.value*10, pageState.value*10+10)];
        }

        // 초기 1번 = mounted 될 때 호출
        onMounted(async ()=>{
            comesStore.comeType = route.path.includes("income") ? 1 : 2;
            [month.value, date.value, startDate.value, endDate.value] = [today, today, today, today]; // 현재 시간으로 초기화
            // get outcome categories
            categoriesStore.getOutcomeCategoryList();
            // 월별 outcome으로 초기화
            await comesStore.getComesOfMonth(month.value);
            bindData(comesStore.comeList);
        })

        // pagenation : pageNum을 클릭하면 해당 page에 해당하는 data로 bind
        const onChangePage = (page) => {
            pageState.value = page;
            bindData(comesStore.comeList);
        }

        // pagenation : < 을 클릭하면 pageNum - 1 && 변경된 pageNum에 해당하는 data로 bind
        const onPrevPage = () => {
            if (pageState.value != 0) { // 예외 처리
                pageState.value = pageState.value - 1;
                bindData(comesStore.comeList);
            }
        }

        // pagenation : > 을 클릭하면 pageNum + 1 && 변경된 pageNum에 해당하는 data로 bind
        const onNextPage = () => {
            if (pageState.value < totalPageCount.value - 1) { // 예외 처리
                pageState.value = pageState.value + 1;
                bindData(comesStore.comeList);
            }
        }

        // dateType == 0, 월별일 때 상단에 보이는 h1의 < 버튼을 통해 targetMonth를 1달 이전으로 설정하는 함수
        const prevMonth = async() => {
            const newDate = new Date(month.value);
            if ((newDate.getMonth() + 1) == 1) {
                newDate.setFullYear(newDate.getFullYear() - 1);
                newDate.setMonth(11);
            } else {
                newDate.setMonth(newDate.getMonth() - 1);
            }
            month.value = newDate;
            await comesStore.getComesOfMonth(month.value);
            bindData(comesStore.comeList);
        }

        // dateType == 0, 월별일 때 상단에 보이는 h1의 > 버튼을 통해 targetMonth를 1달 이후로 설정하는 함수
        const nextMonth = async() => {
            const newDate = new Date(month.value);
            if ((newDate.getMonth() + 1) == 12) {
                newDate.setFullYear(newDate.getFullYear() + 1);
                newDate.setMonth(0);
            } else {
                newDate.setMonth(newDate.getMonth() + 1);
            }
            month.value = newDate;
            await comesStore.getComesOfMonth(month.value);
            bindData(comesStore.comeList);
        }

        // dateType == 0, 월별일 때 datapicker onChangeValue 함수
        const onChangeMonth = async () => {
            pageState.value = 0
            categorySelect.value = 0
            await comesStore.getComesOfMonth(month.value);
            bindData(comesStore.comeList);
        }

        // dateType == 1, 일별일 때 datapicker onChangeValue 함수
        const onChangeDate = async () => {
            pageState.value = 0
            categorySelect.value = 0
            await comesStore.getComesOfDate(date.value);
            bindData(comesStore.comeList);
        }

        // dateType == 2, 기간별일 때 시작일의 datapicker onChangeValue 함수
        const onChangeStartDate = async () => {
            pageState.value = 0
            categorySelect.value = 0
            await comesStore.getComesOfPeriod(startDate.value, endDate.value);
            bindData(comesStore.comeList);
        }

        // dateType == 2, 기간별일 때 종료일의 datapicker onChangeValue 함수
        const onChangeEndDate = async () => {
            pageState.value = 0
            categorySelect.value = 0
            await comesStore.getComesOfPeriod(startDate.value, endDate.value);
            bindData(comesStore.comeList);
        }

        // date select를 onChange 했을 때 조건에 따른 list bind 함수
        const onChangeDateType = async (type) => {
            pageState.value = 0;
            if ( type == 0 ) { // 월별
                if (categorySelect.value == 0) { // 월별 && 전체
                    await comesStore.getComesOfMonth(month.value);
                    bindData(comesStore.comeList);
                }
                else { // 월별 && category_id 별
                    await comesStore.getComesOfCategoryAndMonth(month.value, categorySelect.value);
                    bindData(comesStore.comeList);
                }
            }
            else if ( type == 1 ) { // 일별
                if (categorySelect.value == 0) { // 일별 && 전체
                    await comesStore.getComesOfDate(date.value);
                    bindData(comesStore.comeList);
                }
                else { // 일별 && category_id 별
                    await comesStore.getComesOfCategoryAndDate(date.value, categorySelect.value);
                    bindData(comesStore.comeList);
                }
            }
            else if (type == 2) { // 기간별
                if (categorySelect.value == 0) { // 기간별 && 전체
                    await comesStore.getComesOfPeriod(startDate.value, endDate.value);
                    bindData(comesStore.comeList);
                }
                else { // 기간별 && category_id 별
                    await comesStore.getComesOfCategoryAndPeriod(startDate.value, endDate.value, categorySelect.value);
                    bindData(comesStore.comeList);
                }
            }
            else { // 전체
                if (categorySelect.value == 0) { // 전체 && 전체
                    await comesStore.getComesList();
                    bindData(comesStore.comeList);
                }
                else { // 전체 && category_id 별
                    await comesStore.getComesOfCategory(categorySelect.value);
                    bindData(comesStore.comeList);
                }
            }
        }

        // category select를 onChange 했을 때 조건에 따른 list bind 함수
        const onChangeCategory = async (id) => {
            pageState.value = 0
            if ( id == 0 ) { // 전체
                if (dateType.value == 0) { // 전체 && 월별
                    await comesStore.getComesOfMonth(month.value);
                    bindData(comesStore.comeList);
                }
                else if (dateType.value == 1) { // 전체 && 일별
                    await comesStore.getComesOfDate(date.value);
                    bindData(comesStore.comeList);
                }
                else if (dateType.value == 2) { // 전체 && 기간별
                    await comesStore.getComesOfPeriod(startDate.value, endDate.value);
                    bindData(comesStore.comeList);
                }
                else { // 전체 && 전체
                    await comesStore.getComesList();
                    bindData(comesStore.comeList);
                }
            }
            else { // category_id 별
                if (dateType.value == 0) { // category_id 별 && 월별
                    await comesStore.getComesOfCategoryAndMonth(month.value, id);
                    bindData(comesStore.comeList);
                }
                else if (dateType.value == 1) { // category_id 별 && 일별
                    await comesStore.getComesOfCategoryAndDate(date.value, categorySelect.value);
                    bindData(comesStore.comeList);
                }
                else if (dateType.value == 2) { // category_id 별 && 기간별
                    await comesStore.getComesOfCategoryAndPeriod(startDate.value, endDate.value, categorySelect.value);
                    bindData(comesStore.comeList);
                }
                else { // category_id 별 && 전체
                    await comesStore.getComesOfCategory(categorySelect.value);
                    bindData(comesStore.comeList);
                }
            }

        }

        const refreshData = async () => {
            if (dateType.value == 0) { // 월별
                await comesStore.getComesOfMonth(month.value);
            } else if (dateType.value == 1) { // 일별
                await comesStore.getComesOfDate(date.value);
            } else if (dateType.value == 2) { // 기간별
                await comesStore.getComesOfPeriod(startDate.value, endDate.value);
            } else { // 전체
                await comesStore.getComesList();
            }
            bindData(comesStore.comeList);
        };

        return {onChangeDate, onChangeMonth, onChangeStartDate, onChangeEndDate, prevMonth, nextMonth, date, month, startDate, endDate, dateType, pageState, totalPageCount, pageData, categoriesStore, comesStore, onChangePage, onPrevPage, onNextPage, categorySelect, onChangeDateType, onChangeCategory, openModal, openDetailModal, closeModal, openModal1, openCreateModal, closeCreateModal, refreshData};
    }
}
</script>
<style scoped>
.btn-brown {
  background-color: #4D2A30;
  color: white;
}
.font-brown {
  color: #4D2A30;
}
.view-box {
  background-color: #ffffff;
  border-radius: 16px;
  padding : 32px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 700px;
}

.picker-div, .period-div, .select-div, .date-div, .category-div {
  display: flex;
  align-items: center;
  margin-left :16px;
}
.monpick-div {
  display: flex;
  justify-content: center;
}

.btn-div {
  float : right;
}

.page-link {
  background-color: white;
  color: #4D2A30;
}

.page-item.active .page-link {
    background-color: #4D2A30;
    border-color: #4D2A30;
    font-weight: bold;
    z-index : 0;
}

.table {
  width: 90%;
}

.table th:first-child, .table td:first-child {
  width: 15%; /* 첫 번째 열의 너비를 20%로 설정 */
}

.table th:nth-child(2), .table td:nth-child(2) {
  width: 20%; /* 두 번째 열의 너비를 20%로 설정 */
}

.table th:nth-child(3), .table td:nth-child(3) {
  width: 30%; /* 세 번째 열의 너비를 30%로 설정 */
}

.table th:nth-child(4), .table td:nth-child(4) {
  width: 15%; /* 네 번째 열의 너비를 15%로 설정 */
}

.table th:nth-child(5), .table td:nth-child(5) {
  width: 20%; /* 다섯 번째 열의 너비를 15%로 설정 */
}
</style>
