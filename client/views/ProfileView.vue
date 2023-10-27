<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import MapComponent from "../components/Map/MapComponent.vue";
import { fetchy } from "../utils/fetchy";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const getUserId = async () => {
  try {
    await fetchy(`/api/users/${currentUsername}`, "GET");
  } catch {
    return;
  }
};
</script>

<template>
  <main>
    <section>
      <h1 v-if="isLoggedIn">Profile</h1>
      <h1 v-else>Please login!</h1>
    </section>
    <MapComponent :userid="getUserId" />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
