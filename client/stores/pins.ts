import { LeafletMouseEvent } from "leaflet";
import { defineStore } from "pinia";
import { ref } from "vue";
import { PinpointDoc } from "../../server/concepts/pinpoint";

import { fetchy } from "@/utils/fetchy";

export const usePinsStore = defineStore(
  "pins",
  () => {
    const pinpoints = ref(new Array<PinpointDoc>());
    const showPinpoints = ref(false);
    const showConfirmationBar = ref(false);
    const selectedLocation = ref(false);
    const selectedLat = ref(0);
    const selectedLong = ref(0);
    const pins = ref(new Array<{ lat: number; long: number }>());
    const pinIds = ref(new Array<string>());
    const selectedPinIdx = ref(-1);
    const selectedPinId = ref("");
    const mapid = ref("65281c0b73267650738106bd");

    const resetStore = () => {
      showPinpoints.value = false;
      showConfirmationBar.value = false;
      pins.value = [];
      pinIds.value = [];
      selectedLocation.value = false;
      selectedLat.value = 0;
      selectedLong.value = 0;
      selectedPinId.value = "";
      selectedPinIdx.value = -1;
    };

    const updatePins = async () => {
      try {
        pinIds.value = (
          await fetchy(`/api/${mapid.value}/pins`, "GET", {
            body: {},
          })
        ).pins;

        pins.value = await fetchy(`/api/${mapid.value}/pins/locations`, "GET", {
          body: {},
        });
      } catch (_) {
        console.log("default pin values");
        return;
      }
    };

    const selectLocation = async (event: LeafletMouseEvent) => {
      await fetchy(`/api/map/${mapid.value}/${event.latlng.lat}/${event.latlng.lng}`, "PATCH", {
        body: {},
      });

      selectedPinId.value = "";
      showPinpoints.value = false;
      showConfirmationBar.value = true;
      selectedLocation.value = true;
      selectedPinIdx.value = -1;
      selectedLat.value = event.latlng.lat;
      selectedLong.value = event.latlng.lng;
    };

    const dropPin = async () => {
      try {
        const pin = (
          await fetchy(`/api/map/${mapid.value}/pin`, "PATCH", {
            body: {},
          })
        ).pin;

        pinIds.value.push(pin);
        pins.value.push({
          lat: selectedLat.value,
          long: selectedLong.value,
        });
      } catch (_) {
        console.log("error occurred");
        return;
      }

      selectedLocation.value = false;
      showConfirmationBar.value = false;
    };

    const cancelAction = async () => {
      await fetchy(`/api/map/${mapid.value}/${selectedLat.value}/${selectedLong.value}`, "PATCH", {
        body: {},
      });

      selectedPinId.value = "";
      showConfirmationBar.value = false;
      selectedLocation.value = false;
      selectedLat.value = 0;
      selectedLong.value = 0;
      selectedPinIdx.value = -1;
    };

    const displayPinpoints = async () => {
      showConfirmationBar.value = false;
      showPinpoints.value = true;
      const results: Array<PinpointDoc> = await fetchy(`/api/pin/${selectedPinId.value}/pinpoints`, "GET", {});
      pinpoints.value = results;
      console.log("displaying these images");
      for (let i = 0; i < pinpoints.value.length; ++i) {
        console.log(pinpoints.value[i].media);
      }
    };

    const onPinClick = async (idx: number) => {
      selectedPinIdx.value = idx;
      selectedPinId.value = pinIds.value[idx];
      showConfirmationBar.value = true;
      selectedLocation.value = false;
      showPinpoints.value = false;
    };

    const removePin = async () => {
      const oldPinId = pinIds.value[selectedPinIdx.value];

      try {
        await fetchy(`/api/map/${mapid.value}/pins/${oldPinId}`, "DELETE", {});
      } catch (_) {
        console.log("error occurred");
        return;
      }

      pins.value.splice(selectedPinIdx.value, 1);
      pinIds.value.splice(selectedPinIdx.value, 1);
      showConfirmationBar.value = false;
      selectedLocation.value = false;
    };

    return {
      pinpoints,
      showPinpoints,
      showConfirmationBar,
      selectedLocation,
      selectedLat,
      selectedLong,
      pins,
      pinIds,
      selectedPinIdx,
      selectedPinId,
      displayPinpoints,
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
