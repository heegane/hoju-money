<template>

</template>

<script setup>
import { useUserInfoStore } from '@/stores/user';

const userInfoStore = useUserInfoStore();
const userInfo = userInfoStore.userInfo;
const getUserInfo = userInfoStore.getUserInfo;

getUserInfo();
</script>

<style>

</style>
