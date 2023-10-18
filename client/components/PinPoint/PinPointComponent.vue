<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["pinpoint"]);
const emit = defineEmits(["editPinPoint", "refreshPinPoints"]);
const { currentUsername } = storeToRefs(useUserStore());

const deletePinPoint = async () => {
  try {
    await fetchy(`/api/pinpoints/user/${props.pinpoint._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPinPoints");
};
</script>

<template>
  <p class="author">{{ props.pinpoint.author }}</p>
  <p>{{ props.pinpoint.content }}</p>
  <div class="base">
    <menu v-if="props.pinpoint.author == currentUsername">
      <li><button class="btn-small pure-button" @click="emit('editPinPoint', props.pinpoint._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deletePinPoint">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.pinpoint.dateCreated !== props.pinpoint.dateUpdated">Edited on: {{ formatDate(props.pinpoint.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.pinpoint.dateCreated) }}</p>
    </article>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
