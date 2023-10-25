<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";
import CreatePinPointForm from "./CreatePinPointForm.vue";
import EditPinPointForm from "./EditPinPointForm.vue";
import PinPointComponent from "./PinPointComponent.vue";
import SearchPinPointForm from "./SearchPinPointForm.vue";

const loaded = ref(false);
let pinpoints = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchAuthor = ref("");

async function getPinPoints(author?: string) {
  let query: Record<string, string> = author !== undefined ? { author } : {};
  let pinpointResults;
  try {
    pinpointResults = await fetchy("/api/pinpoints", "GET", { query });
  } catch (_) {
    return;
  }
  searchAuthor.value = author ? author : "";
  pinpoints.value = pinpointResults;
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getPinPoints();
  loaded.value = true;
});
</script>

<template>
  <div class="row">
    <h2 v-if="!searchAuthor">PinPoints:</h2>
    <h2 v-else>PinPoints by {{ searchAuthor }}:</h2>
    <SearchPinPointForm @getPinPointsByAuthor="getPinPoints" />
  </div>
  <section class="pinpoints" v-if="loaded && pinpoints.length !== 0">
    <article v-for="pinpoint in pinpoints" :key="pinpoint._id">
      <PinPointComponent v-if="editing !== pinpoint._id" :pinpoint="pinpoint" @refreshPinPoints="getPinPoints" @editPinPoint="updateEditing" />
      <EditPinPointForm v-else :pinpoint="pinpoint" @refreshPinPoints="getPinPoints" @editPinPoint="updateEditing" />
    </article>
  </section>
  <p v-else-if="loaded">No pinpoints found</p>
  <p v-else>Loading...</p>
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
