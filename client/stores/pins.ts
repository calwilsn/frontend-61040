import { ObjectId } from "mongodb";
import { defineStore } from "pinia";
import { ref } from "vue";

import { fetchy } from "@/utils/fetchy";

export const usePinsStore = defineStore(
  "pins",
  () => {
    const showConfirmationBar = ref(false);
    const selectedLocation = ref(false);
    const selectedLat = ref(0);
    const selectedLong = ref(0);
    const pins = ref(Array<{ lat: Number; long: Number }>());
    const pinIds = ref(Array<ObjectId>());
    const selectedPinIdx = ref(-1);
    const selectedPinId = ref("");

    const resetStore = () => {
      showConfirmationBar.value = false;
      pins.value = [];
      pinIds.value = [];
      selectedLocation.value = false;
      selectedLat.value = 0;
      selectedLong.value = 0;
      selectedPinId.value = "";
      selectedPinIdx.value = -1;
    };

    const updatePins = async (mapid: ObjectId) => {
      try {
        pinIds.value = (
          await fetchy(`/api/${mapid}/pins`, "GET", {
            body: {},
          })
        ).pins;

        pins.value = await fetchy(`/api/${mapid}/pins/locations`, "GET", {
          body: {},
        });
      } catch (_) {
        console.log("default pin values");
        return;
      }
    };

    const selectLocation = async (mapid: ObjectId, x: number, y: number) => {
      selectedLat.value = x;
      selectedLong.value = y;
      showConfirmationBar.value = true;
      selectedPinIdx.value = -1;
      await fetchy(`/api/map/${mapid}/${selectedLat.value}/${selectedLong.value}`, "PATCH", {
        body: {},
      });
    };

    const dropPin = async (mapid: ObjectId) => {
      try {
        selectedLocation.value = true;
        showConfirmationBar.value = false;

        const pin = (
          await fetchy(`/api/map/${mapid}/pin`, "PATCH", {
            body: {},
          })
        ).value;

        pinIds.value.push(pin);
        pins.value.push({
          lat: selectedLat.value,
          long: selectedLong.value,
        });
      } catch (_) {
        console.log("error occurred");
        return;
      }
    };

    const cancelAction = async (mapid: ObjectId) => {
      await fetchy(`/api/map/${mapid}/${selectedLat.value}/${selectedLong.value}`, "PATCH", {
        body: {},
      });

      showConfirmationBar.value = false;
      selectedLat.value = 0;
      selectedLong.value = 0;
      selectedPinIdx.value = -1;
    };

    const onPinClick = (idx: number) => {
      selectedPinIdx.value = idx;
      showConfirmationBar.value = true;
    };

    const removePin = async (mapid: ObjectId) => {
      const oldPinId = pinIds.value[selectedPinIdx.value];
      pins.value.splice(selectedPinIdx.value, 1);
      pinIds.value.splice(selectedPinIdx.value, 1);
      showConfirmationBar.value = false;

      await fetchy(`/api/map/${mapid}/pins/${oldPinId}`, "DELETE", {
        body: {},
      });
    };

    return {
      showConfirmationBar,
      selectedLocation,
      selectedLat,
      selectedLong,
      pins,
      pinIds,
      selectedPinIdx,
      selectedPinId,
      updatePins,
      selectLocation,
      dropPin,
      cancelAction,
      onPinClick,
      removePin,
    };
  },
  { persist: true },
);
