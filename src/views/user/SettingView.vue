<template>
<div class="mt-5 mx-5 px-5" style="background-color: white; padding-top: 40px; padding-bottom: 40px;">
    <div class="mb-5">
        <span class="fs-2">앱 데이터 설정</span>
    </div>
    <div>
        <div class="d-flex justify-content-between">
            <span class="fs-5">알림</span>
            <Toggle v-model="value"/>
        </div>
        
        <select class="form-select my-4">
            <option value="kor">한국어</option>
            <option value="eng">영어 - English</option>
            <option value="jap">일본어 - 日本語</option>
        </select>
        <select class="form-select my-4">
            <option value="light">라이트 모드</option>
            <option value="dark">다크 모드</option>
            <option value="system">시스템 모드</option>
        </select>
    </div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import Toggle from '@vueform/toggle'

const value = ref(true);
</script>

<style src="@vueform/toggle/themes/default.css">
</style>
