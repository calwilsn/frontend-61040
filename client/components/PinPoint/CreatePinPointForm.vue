<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const pin = ref("");
const image = ref("");
const caption = ref("");
const emit = defineEmits(["refreshPinPoints"]);

const createPinPoint = async (pin: string, image: string, caption?: string) => {
  console.log("pin", pin);
  console.log("image", image);
  console.log("caption", caption);
  try {
    await fetchy(`/api/pinpoints/${pin}/${image}/${caption}`, "POST", {
      body: {},
    });
  } catch (_) {
    console.log("error occurred");
    return;
  }
  emit("refreshPinPoints");
  emptyForm();
};

const emptyForm = () => {
  pin.value = "";
  image.value = "";
  caption.value = "";
};
</script>

<template>
  <form @submit.prevent="createPinPoint(pin, image, caption)">
    <label for="pin">Location:</label>
    <textarea id="pin" v-model="pin" placeholder="Enter a location" required> </textarea>
    <label for="image">Image:</label>
    <textarea id="image" v-model="image" placeholder="Enter a link to an image" required> </textarea>
    <label for="caption">Caption:</label>
    <textarea id="caption" v-model="caption" placeholder="Enter a caption (optional)" not required> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Create PinPoint</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

button {
  background-color: rgb(255, 150, 0);
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>
