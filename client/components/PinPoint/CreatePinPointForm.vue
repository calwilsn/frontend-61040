<script setup lang="ts">
import router from "@/router";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps({
  pinid: String,
});

const image = ref("");
const caption = ref("");
const emit = defineEmits(["refreshPinPoints"]);

const createPinPoint = async (image: string, caption?: string) => {
  console.log("making pinpoint");
  console.log("pin", props.pinid);
  console.log("image", image);
  console.log("caption", caption);
  try {
    await fetchy(`/api/pinpoints/${props.pinid}/${caption}`, "POST", {
      body: { image },
    });
  } catch (_) {
    console.log("error occurred");
    return;
  }
  emptyForm();
  void router.push({ name: "Home" });
};

const emptyForm = () => {
  image.value = "";
  caption.value = "";
};
</script>

<template>
  <form @submit.prevent="createPinPoint(image, caption)">
    <label for="image">Image:</label>
    <textarea id="image" v-model="image" placeholder="Enter a link to an image" required> </textarea>
    <label for="caption">Caption:</label>
    <textarea id="caption" v-model="caption" placeholder="Enter a caption" required> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Create PinPoint</button>
  </form>
</template>

<style scoped>
form {
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 0.5em;
  width: 60%;
  margin: 0 auto;
}

label {
  font-size: large;
}

textarea {
  background-color: var(--base-bg);
}

button {
  background-color: rgb(255, 150, 0);
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  margin-bottom: 0em;
  border-radius: 4px;
  resize: none;
  height: 4em; /* reduced from 6em */
  padding: 0.25em; /* reduced from 0.5em */
}
</style>
