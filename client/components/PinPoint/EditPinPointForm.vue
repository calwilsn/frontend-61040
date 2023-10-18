<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["pinpoint"]);
const content = ref(props.pinpoint.content);
const emit = defineEmits(["editPinPoint", "refreshPinPoints"]);

const editPinPoint = async (content: string) => {
  try {
    await fetchy(`/api/pinpoints/${props.pinpoint._id}`, "PATCH", { body: { update: { content: content } } });
  } catch (e) {
    return;
  }
  emit("editPinPoint");
  emit("refreshPinPoints");
};
</script>

<template>
  <form @submit.prevent="editPinPoint(content)">
    <p class="author">{{ props.pinpoint.author }}</p>
    <textarea id="content" v-model="content" placeholder="Create a pinpoint!" required> </textarea>
    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="btn-small pure-button" @click="emit('editPinPoint')">Cancel</button></li>
      </menu>
      <p v-if="props.pinpoint.dateCreated !== props.pinpoint.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.pinpoint.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.pinpoint.dateCreated) }}</p>
    </div>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  border-radius: 4px;
  resize: none;
}

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

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}
</style>
