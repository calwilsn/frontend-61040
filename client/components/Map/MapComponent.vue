<script setup lang="ts">
import { LMap, LMarker, LTileLayer } from "@vue-leaflet/vue-leaflet";
import L from "leaflet";
import { ref } from "vue";
import pinImage from "../../assets/images/pin.png";
import { usePinsStore } from "../../stores/pins";
import PinPointListComponent from "../PinPoint/PinPointListComponent.vue";

const pinsStore = usePinsStore();

const pinIcon = L.icon({
  iconUrl: pinImage,
  iconSize: [40, 45],
  iconAnchor: [20, 45], // location of icon tip
});

const centerLat = ref(42.360001);
const centerLong = ref(-71.092003);
</script>

<template>
  <div>
    <l-map :zoom="13" :center="[centerLat, centerLong]" style="height: 400px; width: 100%" @click="pinsStore.selectLocation">
      <l-tile-layer
        url="https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2Fsd2lsc24iLCJhIjoiY2xvNXZ3ajFmMGRjbTJqbnhtZGE2eG9kMCJ9.W0-Z-nHnPI2lT2Re-6YN0A"
      ></l-tile-layer>
      <l-marker v-for="(pin, index) in pinsStore.pins" :key="index" :lat-lng="[pin.lat, pin.long]" :icon="pinIcon" @click="() => pinsStore.onPinClick(index)"></l-marker>
    </l-map>

    <div v-if="pinsStore.showPinpoints">
      <PinPointListComponent :pinpoints="pinsStore.pinpoints" />
    </div>

    <div v-if="pinsStore.showConfirmationBar" class="confirmation-bar">
      <button v-if="pinsStore.selectedPinIdx === -1" @click="pinsStore.dropPin">Drop Pin</button>
      <button v-else @click="pinsStore.removePin">Remove Pin</button>
      <button v-if="pinsStore.selectedPinIdx !== -1" @click="pinsStore.displayPinpoints">Show Pinpoints</button>
      <button @click="pinsStore.cancelAction">Cancel</button>
    </div>
  </div>
</template>

<style scoped>
l-map {
  width: 100%;
}

.confirmation-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f7f7f7;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #e0e0e0;
}

button {
  margin: 0 10px;
  padding: 8px 12px;
}

.confirm {
  color: orange;
}

.confirm:hover {
  color: darkorange;
}
</style>
