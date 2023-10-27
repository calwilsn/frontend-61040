<script setup lang="ts">
import { defineProps } from "vue";
import { PinpointDoc } from "../../../server/concepts/pinpoint";

const props = defineProps({
  pinid: String,
  pinpoints: Array<PinpointDoc>,
});
</script>

<template>
  <fieldset>
    <div class="centered-link">
      <RouterLink :to="{ name: 'New PinPoint', params: { pinid: props.pinid } }" :class="{ link_text: true }"> Create a new PinPoint at this location </RouterLink>
    </div>
  </fieldset>
  <section class="pinpoints" v-if="props.pinpoints !== undefined && props.pinpoints.length !== 0">
    <article v-for="pinpoint in props.pinpoints" :key="pinpoint._id.toString()">
      <div>
        <img :src="pinpoint.media" alt="PinPoint Image" />
        <p>{{ pinpoint.caption }}</p>
      </div>
    </article>
  </section>
  <p v-else>No pinpoints found</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.pinpoints {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
