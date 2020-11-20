<template>
  <div class="bottom-panel">
      <p>
      Screen: x = {{mouseX}} y = {{mouseY}}
      </p>
      <p>
          SVG: x = {{ svgX }} y = {{ svgY }}
      </p>
  </div>
</template>

<script>
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */

import { defineComponent, onMounted, watchEffect } from "vue";

// TODO Next: bring in the useMousePosition compositions to better see what's going on.

import {
  useMousePositionScreen,
  useMousePositionSVG
} from "@/composables/WebApi";

export default defineComponent({
  name: "App",
  components: {

  },
  setup() {
    const { x: mouseX, y: mouseY } = useMousePositionScreen();
    const { svgX, svgY } = useMousePositionSVG("svg-timeline");
    return {
mouseX,
mouseY,
svgX,
svgY
    };
  },
});
</script>

<style>
.bottom-panel {
    position: absolute;
    bottom: 0;
    width: 100vw
}
</style>
