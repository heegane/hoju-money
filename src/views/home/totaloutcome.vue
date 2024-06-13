<template>
<div class="card"  >
    <div class="report-header">
        <span class="font-brown fs-4 fw-bolder">총 지출 {{moneyInfo.outcomeMoney.toLocaleString()}}원</span>
    </div>
    <div class="chart-container">
        <canvas id="categoryChart" style="margin-left: 30px;"></canvas>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import { useMoneyInfoStore } from '@/store/asset';

const moneyInfoStore = useMoneyInfoStore();
const moneyInfo = moneyInfoStore.moneyInfo;

const chart = ref(null);
const categories = ref({});

// 현재 달을 가져오는 함수
const getCurrentMonth = () => {
    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    return months[new Date().getMonth()];
};

// Chart.js의 모든 요소를 등록
Chart.register(...registerables);

const fetchData = async () => {
    try {
        const [comesResponse, categoriesResponse] = await Promise.all([
            axios.get('http://localhost:3001/comes'),
            axios.get('http://localhost:3001/categories')
        ]);

        const comesData = comesResponse.data;

        // 카테고리 데이터 필터링 및 그룹화
        const filteredData = comesData.filter(item => item.category_id >= 7 && item.category_id <= 13);
        const categoryCounts = filteredData.reduce((acc, item) => {
            acc[item.category_id] = (acc[item.category_id] || 0) + 1;
            return acc;
        }, {});

        // 차트 데이터 준비
        const labels = Object.keys(categoryCounts);
        const counts = Object.values(categoryCounts);

        // 카테고리 데이터 매핑
        categories.value = categoriesResponse.data.reduce((acc, category) => {
            acc[category.id] = category.typename;
            return acc;
        }, {});

        // 차트 생성
        if (chart.value) {
            chart.value.destroy();
        }

        const ctx = document.getElementById('categoryChart').getContext('2d');
        chart.value = new Chart(ctx, {
            type: 'doughnut', // 도넛 그래프로 변경
            data: {
                labels: labels.map(id => categories.value[id]), // 라벨 데이터
                datasets: [{
                    data: counts,
                    backgroundColor: [
                        '#8898DA',
                        '#D992C9',
                        '#E2AEB1',
                        '#E2D1AB',
                        '#E6E7BC',
                        '#A8C46E',
                        '#B2BAC9',
                    ]
                }]
            },
            options: {
                responsive: true,
                elements: {
                    arc: {
                        borderWidth: 1
                    }
                },
                cutout: '80%', // 도넛의 중심에 구멍을 남김
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const total = context.dataset.data.reduce((acc, value) => acc + value, 0);
                                const category = categories.value[labels[context.dataIndex]];
                                const currentValue = context.dataset.data[context.dataIndex];
                                const percentage = ((currentValue / total) * 100).toFixed(2);
                                return `${category}: ${percentage}%`;
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

onMounted(() => {
    fetchData();
});
</script>


<style scoped>
.font-brown {
    color: #4D2A30;
}

.card {
    display: flex;
    flex-direction: column;
    /* 요소들을 세로로 정렬하기 위해 컬럼 방향으로 설정합니다. */
    justify-content: center;
    align-items: center;
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.report-header {
    margin-bottom: 20px;
    /* 레포트 헤더와 차트 사이에 간격 추가 */
}

.chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30vh;
    /* 전체 화면의 75% */
    width: 16vw;
    /* 차트 컨테이너의 너비를 100%로 설정하여 수평 중앙 정렬을 유지합니다. */
}
</style>