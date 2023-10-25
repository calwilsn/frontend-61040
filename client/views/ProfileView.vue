<script setup lang="ts">
import PinPointListComponent from "@/components/PinPoint/PinPointListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import MapComponent from "../components/Map/MapComponent.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <section>
      <h1 v-if="isLoggedIn">Profile</h1>
      <h1 v-else>Please login!</h1>
    </section>
    <MapComponent />
    <form class="pure-form centered-form" @submit.prevent="login">
      <fieldset>
        <div class="centered-link">
          <RouterLink :to="{ name: 'New PinPoint' }" :class="{ link_text: true }"> Create a new PinPoint </RouterLink>
        </div>
      </fieldset>
    </form>
    <PinPointListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
