<template>
     <div class="card"  >
    <!-- <div class="background-color"> -->
        <div class="report-header">
            <!-- <h3 style="color: #2B8EC8;">카테고리별 리포트</h3>
            <h5>{{ new Date().getFullYear() }} {{ currentMonth }} </h5> -->
            <h2>총지출: {{money.outcomeMoney.toLocaleString()}}원</h2>
        </div>
        <div class="chart-container">
            <canvas id="categoryChart" ></canvas>
        </div>
    <!-- </div> -->
</div>
</template>
<script>
import { ref, onMounted,reactive } from 'vue';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
export default {
    setup() {
        const chart = ref(null);
        const money = reactive({"totalMoney":0,"incomeMoney":0,"outcomeMoney":0});
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
                let outcome = comesData.reduce((total, currentValue) => {
                        if (currentValue.type === 2) {
                            return total + currentValue.money;
                        }
                        return total;
                       

                }, 0);
                money.outcomeMoney = outcome;
               

                const categoriesData = categoriesResponse.data;
                // 현재 달을 가져옵니다.
                // const currentYear = new Date().getFullYear();
                // const currentMonth = new Date().getMonth() + 1;
                // category_id가 7부터 13까지이고 현재 달 데이터인 경우 필터링합니다.
                const filteredData = comesData.filter(item => {
                    // const itemYear = new Date(item.date).getFullYear();
                    // const itemMonth = new Date(item.date).getMonth() + 1;
                    return item.category_id >= 7 && item.category_id <= 13;
                });

                // category_id별 데이터 그룹화
                const categoryCounts = filteredData.reduce((acc, item) => {
                    acc[item.category_id] = (acc[item.category_id] || 0) + 1;
                    return acc;
                }, {});
                // 차트 데이터 준비
                const labels = Object.keys(categoryCounts);
                const counts = Object.values(categoryCounts);
                // category 데이터 매핑
                categories.value = categoriesData.reduce((acc, category) => {
                    acc[category.id] = category.typename;
                    return acc;
                }, {});
                // 차트 생성
                if (chart.value) {
                    chart.value.destroy();
                }
                const ctx = document.getElementById('categoryChart').getContext('2d');
                chart.value = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        // labels: labels.map(id => categories.value[id]), // 실제 라벨 데이터
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
                        legend: {
                            display: false // 범례 숨기기
                        },
                        plugins: {
                            legend: {
                                position: 'right', // 라벨을 도넛 오른쪽에 위치
                                labels: {
                                    padding: 20 // 라벨의 내부 간격 설정
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const total = context.dataset.data.reduce((acc, value) => acc + value, 0);
                                        const category=categories.value[labels[context.dataIndex]];
                                        const currentValue = context.dataset.data[context.dataIndex];
                                        const percentage = ((currentValue / total) * 100).toFixed(2);
                                        return `${category}${percentage}%`;
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
        return {
            currentMonth: getCurrentMonth(),money // 현재 달 데이터 전달, 
        };
    }
};
</script>
<style scoped>
.background-color {
    background-color: #E5E6ED; /* 배경색 지정 */
}
.report-header {
    margin-left: 30px; /* 왼쪽 마진 추가 */
}
.chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30vh; /* 전체 화면의 75% */
    margin: 20px auto; /* 수평 중앙 정렬 및 위아래 마진 추가 */
}
.card {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}
</style>