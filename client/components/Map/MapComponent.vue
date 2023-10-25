<script setup lang="ts">
import { LMap, LMarker, LTileLayer } from "@vue-leaflet/vue-leaflet";
import { ref } from "vue";
import L from "leaflet";
import pinImage from "../../assets/images/pin.png";
import ObjectId from "mongodb";
import { fetchy } from "../../utils/fetchy";

const mapId: ObjectId = "65281c0b73267650738106bd";

const pinIcon = L.icon({
  iconUrl: pinImage,
  iconSize: [40, 45],
  iconAnchor: [20, 45], // location of icon tip
});

const centerLat = ref(42.360001);
const centerLong = ref(-71.092003);
const selectedLocation = ref(false);
const selectedLat = ref(null);
const selectedLong = ref(null);
const showConfirmationBar = ref(false);
const markers = ref([]);
const selectedMarkerIdx = ref(null);

const onMapClick = async (event) => {
  selectedLat.value = event.latlng.lat;
  selectedLong.value = event.latlng.lng;
  showConfirmationBar.value = true;
  selectedMarkerIdx.value = null;

  try {
    await fetchy(`/api/map/${mapId}/${selectedLat.value}/${selectedLong.value}`, "PATCH", {
      body: {},
    });
  } catch (_) {
    console.log("error occurred");
    return;
  }
};

const confirmMarkerPlacement = async () => {
  selectedLocation.value = true;
  showConfirmationBar.value = false;
  markers.value.push({
    lat: selectedLat.value,
    long: selectedLong.value,
  });

  try {
    await fetchy(`/api/map/${mapId}/pin`, "PATCH", {
      body: {},
    });
  } catch (_) {
    console.log("error occurred");
    return;
  }
};

const cancelAction = async () => {
  // deselect location and marker
  try {
    await fetchy(`/api/map/${mapId}/${selectedLat.value}/${selectedLong.value}`, "PATCH", {
      body: {},
    });
  } catch (_) {
    console.log("error occurred");
    return;
  }

  showConfirmationBar.value = false;
  selectedLat.value = null;
  selectedLong.value = null;
  selectedMarkerIdx.value = null;
};

const onMarkerClick = (idx) => {
  selectedMarkerIdx.value = idx;
  showConfirmationBar.value = true;
};

const removeMarker = () => {
  markers.value.splice(selectedMarkerIdx.value, 1);
  showConfirmationBar.value = false;
};
</script>

<template>
  <div>
    <l-map :zoom="13" :center="[centerLat, centerLong]" style="height: 400px; width: 100%" @click="onMapClick">
      <l-tile-layer
        url="https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2Fsd2lsc24iLCJhIjoiY2xvNXZ3ajFmMGRjbTJqbnhtZGE2eG9kMCJ9.W0-Z-nHnPI2lT2Re-6YN0A"
      ></l-tile-layer>
      <l-marker v-for="(marker, index) in markers" :key="index" :lat-lng="[marker.lat, marker.long]" :icon="pinIcon" @click="() => onMarkerClick(index)"></l-marker>
    </l-map>

    <div v-if="showConfirmationBar" class="confirmation-bar">
      <button v-if="selectedMarkerIdx === null" @click="confirmMarkerPlacement">Drop Pin</button>
      <button v-else @click="removeMarker">Remove Pin</button>
      <button @click="cancelAction">Cancel</button>
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
