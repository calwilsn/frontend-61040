<script setup lang="ts">
import GuestForm from "@/components/Login/GuestForm.vue";
import LoginForm from "@/components/Login/LoginForm.vue";
import RegisterForm from "@/components/Login/RegisterForm.vue";
</script>

<template>
  <main class="column">
    <LoginForm />
    <RegisterForm />
    <GuestForm />
  </main>
</template>
