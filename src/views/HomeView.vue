<template>
<div class="container">
    <profile/>

   <div class="flex-div">
    <totalincome/>
    <totaloutcome/>
    <netProceed/>
   </div> 
   <div class="flex-div">
   <recentincome/>
    <recentoutcome/>
</div> 
   
  

</div>
   
</template>

<script setup>
import profile from '@/views/home/profile.vue';
import recentincome from '@/views/home/recentincome.vue';
import recentoutcome from '@/views/home/recentoutcome.vue';
import totaloutcome from '@/views/home/totaloutcome.vue';
import totalincome from '@/views/home/totalincome.vue';
import netProceed from '@/views/home/netProceed.vue';

</script>

<style scoped>
.flex-div{
    display:flex;
}
</style>
