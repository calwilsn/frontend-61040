<script setup lang="ts">
import { ref } from "vue";

const author = ref("");
const emit = defineEmits(["getPinPointsByAuthor"]);
</script>

<template>
  <form @submit.prevent="emit('getPinPointsByAuthor', author)" class="pure-form">
    <fieldset>
      <legend>Search by Author</legend>
      <input id="author" type="text" v-model="author" placeholder="Username" />
      <button type="submit" class="pure-button pure-button-primary">Search</button>
    </fieldset>
  </form>
</template>

<style scoped>
form {
  display: flex;
  gap: 0.5em;
  padding: 1em;
  align-items: center;
}
</style>
