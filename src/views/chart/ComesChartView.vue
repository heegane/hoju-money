<template>
    <div class="report-container">
        <div class="title-container">
            <h3 style="color: #4D2A30;">수입/지출 리포트</h3>
            <div class="date-selector">
                <label for="year">년도: </label>
                <select id="year" v-model="selectedYear">
                    <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
                </select>
                <label for="month">월: </label>
                <select id="month" v-model="selectedMonth">
                    <option v-for="month in availableMonths" :key="month" :value="month">{{ month }}</option>
                </select>
            </div>
        </div>
        <div class="chart-container">
            <canvas ref="lineChart"></canvas>
        </div>
    </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

export default {
    setup() {
        Chart.register(...registerables);
        const lineChart = ref(null);
        const selectedYear = ref(new Date().getFullYear());
        const selectedMonth = ref(new Date().getMonth() + 1);
        const availableYears = ref(Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i));
        const availableMonths = ref(Array.from({ length: 12 }, (_, i) => i + 1));

        // 현재 월의 전체 일수를 계산하는 함수
        function getDaysInMonth(year, month) {
            return new Date(year, month, 0).getDate();
        }

        // 일별 라벨을 생성하는 함수
        function generateDailyLabels(year, month) {
            const daysInMonth = getDaysInMonth(year, month);
            return Array.from({ length: daysInMonth }, (_, i) => `${i + 1}일`);
        }

        // 수입 및 지출 데이터를 가져오는 함수
        async function fetchDataByType(year, month, type) {
            const response = await axios.get('http://localhost:3001/comes');
            const filteredData = response.data.filter((item) => {
                const itemDate = new Date(item.date);
                return (
                    itemDate.getFullYear() === year &&
                    itemDate.getMonth() === month - 1 &&
                    item.type === type
                );
            });
            return generateDailyData(filteredData, year, month);
        }

        // 일별 데이터를 생성하는 함수
        function generateDailyData(data, year, month) {
            const daysInMonth = getDaysInMonth(year, month);
            const dailyData = Array(daysInMonth).fill(0);
            data.forEach((item) => {
                const day = new Date(item.date).getDate() - 1; // 일자를 가져와서 해당 일자의 데이터 누적
                dailyData[day] += item.money; // 해당 일자의 데이터 누적
            });
            return dailyData;
        }

        // 순수익 데이터를 계산하는 함수
        function calculateNetIncome(incomeData, outcomeData) {
            return incomeData.map((income, index) => income - outcomeData[index]);
        }

        // 차트 업데이트 함수
        async function updateChart() {
            const incomeData = await fetchDataByType(selectedYear.value, selectedMonth.value, 1); // 수입 데이터 가져오기
            const outcomeData = await fetchDataByType(selectedYear.value, selectedMonth.value, 2); // 지출 데이터 가져오기
            const netIncomeData = calculateNetIncome(incomeData, outcomeData); // 순수익 데이터 계산하기

            const ctx = lineChart.value.getContext('2d');
            if (lineChart.value.chart) {
                lineChart.value.chart.destroy();
            }

            lineChart.value.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: generateDailyLabels(selectedYear.value, selectedMonth.value), // 일별 라벨 생성 함수
                    datasets: [
                        {
                            label: '수입',
                            data: incomeData,
                            borderColor: '#8898da',
                            fill: false,
                        },
                        {
                            label: '지출',
                            data: outcomeData,
                            borderColor: '#d992c9',
                            fill: false,
                        },
                        {
                            label: '순수익',
                            data: netIncomeData,
                            borderColor: '#4caf50',
                            fill: false,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: true,
                                text: '일자',
                            },
                        },
                        y: {
                            display: true,
                            title: {
                                display: true,
                                text: '금액',
                            },
                        },
                    },
                },
            });
        }

        // 선택된 년도와 월이 변경될 때마다 차트 업데이트
        watch([selectedYear, selectedMonth], updateChart);

        // 초기 차트 설정
        onMounted(() => {
            updateChart();
        });

        return {
            selectedYear,
            selectedMonth,
            availableYears,
            availableMonths,
            lineChart,
        };
    },
};
</script>

<style scoped>
.report-container {
    background-color: white;
    margin: 20px;
    padding: 10px;
}

.title-container {
    margin: 20px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.date-selector {
    display: flex;
    align-items: center;
    margin-top: 10px;
}

.date-selector label {
    margin-right: 5px;
}

.chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 65vh;
    margin: 10px;
}
</style>
