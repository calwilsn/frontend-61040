<script setup lang="ts">
import { useRoute } from "vue-router";
import CreatePinPointForm from "../components/PinPoint/CreatePinPointForm.vue";

// Use the useRoute hook to get the route parameters
const router = useRoute();
let pinid: string = Array.isArray(router.params.pinid) ? router.params.pinid[0] : router.params.pinid;
</script>

<template>
  <main>
    <h1>Create a new pinpoint</h1>
    <CreatePinPointForm :pinid="pinid" />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
