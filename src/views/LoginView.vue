<template>
<div class="container d-flex justify-content-center align-items-center vh-100 pb-5">
    <div class="text-center pb-5 border pt-5 px-5">
        <div>
            <img src="@/assets/logo_badge.png" alt="logo" class="img-fluid logo-image" />
        </div>
        <div class="mb-3">
            <span class="fs-4">Enter your email, password for this app</span>
        </div>
        <div class="mx-5">
            <div class="mb-3">
                <input type="text" class="form-control" v-model="userInfo.email" placeholder="email@domain.com">
            </div>
            <div class="mb-3">
                <input type="password" class="form-control" v-model="userInfo.password">
            </div>
            <div class="d-grid gap-2 d-md-block btn bg-dark p-0">
                <button type="button" class="btn btn-dark" @click="btnLogin">Login with email</button>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const userInfo = reactive({ email: "", password: "" });
const userList = ref([]);

const btnLogin = () => {
    sessionStorage.setItem("email", "");
    sessionStorage.setItem("password", "");

    const user = userList.value.find((u) => u.email == userInfo.email);

    if (userInfo.email == "") {
        alert("아이디를 입력해주세요.");
        return;
    }

    if (user == null) {
        alert("해당하는 아이디가 없습니다.");
        return;
    }

    if (user.password != userInfo.password) {
        alert("패스워드가 일치하지 않습니다.");
        return;
    }

    sessionStorage.setItem("email", user.email);
    sessionStorage.setItem("password", user.password);

    router.push({path: '/home'});
}

axios.get('http://localhost:3001/users')
.then(res => {
    userList.value = res.data;
    console.log(userList.value);
})
.catch(err => {
    console.error(err);
});
</script>

<style scoped>
.logo-image {
    width: 15rem;
}
</style>
