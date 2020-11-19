<template>
  <TimeLine />
</template>

<script>
import { defineComponent, onMounted } from "vue";
import { gsap } from "gsap";

import TimeLine from "@/components/TimeLine";
export default defineComponent({
  name: "App",
  components: {
    TimeLine,
  },
  setup() {
    function viewBoxString(frame) {
      return `${frame.x} ${frame.y} ${frame.width} ${frame.height}`;
    }

    function zoomToView(elementId) {
      const element = document.getElementById(elementId);
      const box = element.getBBox();
      return gsap.to("#svg-timeline", {
        duration: 1,
        attr: { viewBox: viewBoxString(box) },
      });
    }
    onMounted(() => {
      setTimeout(() => {
        zoomToView("rect968");
      }, 500);
      // test zoom
    });
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
svg {
  border: 2px dotted blue;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
}
</style>
