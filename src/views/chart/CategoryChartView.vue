<template>
    <div class="report-container">
        <div>
            <h3 style="color: #2B8EC8;">카테고리별 리포트</h3>
            <h5>{{ currentYear }}년 {{ currentMonth }}월 </h5>
        </div>
        <div class="chart-container">
            <canvas id="categoryChart"></canvas>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';

export default {
    setup() {
        const chart = ref(null);
        const categories = ref({});
        const currentYear = ref(new Date().getFullYear());
        const currentMonth = ref(new Date().getMonth() + 1);

        // Chart.js의 모든 요소를 등록
        Chart.register(...registerables);

        // 현재 달 데이터 필터링 함수
        const filterCurrentMonthData = (data) => {
            return data.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate.getFullYear() === currentYear.value && itemDate.getMonth() + 1 === currentMonth.value && item.category_id >= 7 && item.category_id <= 13;
            });
        };

        // 카테고리별 데이터 그룹화 함수
        const groupByCategory = (data) => {
            return data.reduce((acc, item) => {
                acc[item.category_id] = (acc[item.category_id] || 0) + 1;
                return acc;
            }, {});
        };

        // 차트 생성 함수
        const createChart = (labels, counts) => {
            if (chart.value) {
                chart.value.destroy();
            }
            const ctx = document.getElementById('categoryChart').getContext('2d');
            chart.value = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels.map(id => categories.value[id]), // 실제 라벨 데이터
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
                                    const currentValue = context.dataset.data[context.dataIndex];
                                    const percentage = ((currentValue / total) * 100).toFixed(2);
                                    return ` ${percentage}%`;
                                }
                            }
                        }
                    }
                }
            });
        };

        const fetchData = async () => {
            try {
                const [comesResponse, categoriesResponse] = await Promise.all([
                    axios.get('http://localhost:3001/comes'),
                    axios.get('http://localhost:3001/categories')
                ]);
                const comesData = comesResponse.data;
                const categoriesData = categoriesResponse.data;

                // 데이터 필터링 및 그룹화
                const filteredData = filterCurrentMonthData(comesData);
                const categoryCounts = groupByCategory(filteredData);

                // 차트 데이터 준비
                const labels = Object.keys(categoryCounts);
                const counts = Object.values(categoryCounts);

                // category 데이터 매핑
                categories.value = categoriesData.reduce((acc, category) => {
                    acc[category.id] = category.typename;
                    return acc;
                }, {});

                // 차트 생성
                createChart(labels, counts);
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.');
            }
        };

        onMounted(() => {
            fetchData();
        });

        return {
            currentMonth,
            currentYear
        };
    }
};
</script>
<style scoped>
.report-container {
    margin: 20px; /* 전체 컨테이너에 마진 적용 */
}

.chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 75vh; /* 전체 화면의 75% */
    margin: 10px auto; /* 수평 중앙 정렬 및 위아래 마진 추가 */
}
</style>
