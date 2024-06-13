import { defineStore } from 'pinia';

export const useSettingInfoStore = defineStore('settingInfo', {
    state: () => ({
        settingInfo: {
            alarm: false,
            language: 'kor',
            mode: 'light'
        }
    }),
    actions: {
        setAlarm(alarm) {
            this.settingInfo.alarm = alarm;
        },
        setLanguage(language) {
            this.settingInfo.language = language;
        },
        setMode(mode) {
            this.settingInfo.mode = mode;
        }
    }
});
