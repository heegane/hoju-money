import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import axios from "axios";

export const useUserInfoStore = defineStore('userInfo', {
    state: () => {
        return {
            userInfo: {id:0, name:"", email:"", avatar:""}
        }
    },
    actions: {
        async getUserInfo() {
            try {
                const email = ref(sessionStorage.getItem('email'));      
                const res = await axios.get(`http://localhost:3001/users?email=${email.value}`);
                
                this.userInfo.id = res.data[0].id;
                this.userInfo.name = res.data[0].name;
                this.userInfo.email = email.value;
                this.userInfo.avatar = res.data[0].avatar;
            } catch(err) {
                console.error(err);
            }
        },
        logout() {
            sessionStorage.setItem("email", "");
            sessionStorage.setItem("password", "");

            this.userInfo.id = null;
            this.userInfo.name = "";
            this.userInfo.email = "";
            this.userInfo.avatar = "";
        }
    }
});