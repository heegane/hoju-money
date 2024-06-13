<template>
<div class="card">
    <div>
        <div class="font-brown fs-4 fw-bolder">총 수입</div>
        <div class="font-brown fs-5">{{moneyInfo.incomeMoney.toLocaleString()}}원</div>
    </div>
    <div class="chart-container">
        <canvas id="categoryChart2"></canvas>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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
        const filteredData = comesData.filter(item => item.category_id >= 1 && item.category_id <= 6);
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

        const ctx = document.getElementById('categoryChart2').getContext('2d');
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
                        display: false // 범례 숨기기
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
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.chart-container {
  display: flex;
  justify-content: right;
  align-items: center;
  height: 12vh;
  width: 12vw;
}

@media (max-width: 1000px) { /* 화면 너비가 768px 이하일 때 */
  .card {
    flex-direction: column;
  }

  .report-header {
    margin-bottom: 10px;
  }

  .chart-container {
    width: 80%;
    height: 20vh;
    /* margin-top: 20px; */
  }
}
</style>