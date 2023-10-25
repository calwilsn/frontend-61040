<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { RouterLink } from "vue-router";

const { updateSession } = useUserStore();

async function login() {
  void updateSession();
  void router.push({ name: "Home" });
}
</script>

<template>
  <form class="pure-form centered-form" @submit.prevent="login">
    <fieldset>
      <div class="centered-link">
        <RouterLink :to="{ name: 'Home' }" :class="{ link_text: true }"> continue as guest </RouterLink>
      </div>
    </fieldset>
  </form>
</template>
