<template>
    <div class="background-color">
        <div class="report-header">
            <h3 style="color: #2B8EC8;">수입/지출 리포트</h3>
            <h5>{{ currentYear }}년 {{ currentMonth }}월 </h5>
        </div>
        <div class="line-chart-container">
            <canvas ref="lineChart"></canvas>
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

export default {
    setup() {
        Chart.register(...registerables);
        const lineChart = ref(null);
        const now = new Date(); // 현재 날짜를 가져옴
        const currentYear = ref(now.getFullYear());
        const currentMonth = ref(now.getMonth() + 1);
        const daysInMonth = getDaysInMonth(currentYear.value, currentMonth.value - 1); // 현재 월의 전체 일수를 계산

        // 현재 월의 전체 일수를 계산하는 함수
        function getDaysInMonth(year, month) {
            return new Date(year, month + 1, 0).getDate();
        }

        // 일별 라벨을 생성하는 함수
        function generateDailyLabels() {
            return Array.from({ length: daysInMonth }, (_, i) => `${i + 1}일`);
        }

        // 수입 및 지출 데이터를 가져오는 함수
        async function fetchDataByType(type) {
            const response = await axios.get('http://localhost:3001/comes');
            const filteredData = response.data.filter((item) => {
                const itemDate = new Date(item.date);
                return (
                    itemDate.getFullYear() === currentYear.value &&
                    itemDate.getMonth() === currentMonth.value - 1 &&
                    item.type === type
                );
            });
            return generateDailyData(filteredData);
        }

        // 일별 데이터를 생성하는 함수
        function generateDailyData(data) {
            const dailyData = Array(daysInMonth).fill(0);
            data.forEach((item) => {
                const day = new Date(item.date).getDate() - 1; // 일자를 가져와서 해당 일자의 데이터 누적
                dailyData[day] += item.money; // 해당 일자의 데이터 누적
            });
            return dailyData;
        }

        // 차트 초기화 및 데이터 불러오기
        onMounted(async () => {
            const incomeData = await fetchDataByType(1); // 수입 데이터 가져오기
            const outcomeData = await fetchDataByType(2); // 지출 데이터 가져오기

            const ctx = lineChart.value.getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: generateDailyLabels(), // 일별 라벨 생성 함수
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
        });

        return {
            currentMonth,
            currentYear,
            lineChart,
        };
    },
};
</script>

<style scoped>
.background-color {
    background-color: #E5E6ED; /* 배경색 지정 */
}
.report-header {
    margin-left: 30px; /* 왼쪽 마진 추가 */
}
.line-chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh; /* 전체 화면의 75% */
    margin: 20px auto; /* 수평 중앙 정렬 및 위아래 마진 추가 */
}
</style>
