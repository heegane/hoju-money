<template>
<div class="container card my-5" style="width: 60%; border-radius: 16px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
    <div style="margin: 20px; padding: 10px;">
        <div class="mb-5">
            <span class="fs-2 fw-bold" style="color: #4D2A30">앱 데이터 설정</span>
        </div>
        <div class="d-flex justify-content-between">
            <span class="fs-5">알림</span>
            <Toggle v-model="alarm" @update:modelValue="updateAlarm"/>
        </div>
        
        <select class="form-select my-4" v-model="language" @change="updateLanguage">
            <option value="kor">한국어</option>
            <option value="eng">영어 - English</option>
            <option value="jap">일본어 - 日本語</option>
        </select>
        
        <select class="form-select my-4" v-model="mode" @change="updateMode">
            <option value="light">라이트 모드</option>
            <option value="dark">다크 모드</option>
            <option value="system">시스템 모드</option>
        </select>
    </div>
</div>
</template>

<script setup>
import { ref, watch } from 'vue';
import Toggle from '@vueform/toggle';
import { useSettingInfoStore } from '@/store/setting';

const settingInfo = useSettingInfoStore();

// Initialize the values directly from the store
const alarm = ref(settingInfo.settingInfo.alarm);
const language = ref(settingInfo.settingInfo.language);
const mode = ref(settingInfo.settingInfo.mode);

const updateAlarm = (value) => {
    settingInfo.setAlarm(value);
};

const updateLanguage = (event) => {
    settingInfo.setLanguage(event.target.value);
};

const updateMode = (event) => {
    settingInfo.setMode(event.target.value);
};

// Watch for changes in the Pinia store and update the refs accordingly
watch(() => settingInfo.settingInfo.alarm, (newVal) => {
    alarm.value = newVal;
});

watch(() => settingInfo.settingInfo.language, (newVal) => {
    language.value = newVal;
});

watch(() => settingInfo.settingInfo.mode, (newVal) => {
    mode.value = newVal;
});
</script>

<style src="@vueform/toggle/themes/default.css"></style>
