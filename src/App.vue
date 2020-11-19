<template>
  <TimeLine @click="moveYearTopLeft" />
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
    let svg;
    function zoomToView(elementId) {
      const element = document.getElementById(elementId);
      const box = element.getBBox();
      return gsap.to(svg, {
        duration: 1,
        attr: { viewBox: viewBoxString(box) },
      });
    }

    function screenToSVGPoint(screenPoint, svgElement) {
      const point = svgElement.createSVGPoint();
      point.x = screenPoint.x;
      point.y = screenPoint.y;
      const svgPoint = point.matrixTransform(
        svgElement.getScreenCTM().inverse()
      );
      return svgPoint;
    }

    function moveYearTopLeft() {
      const screenPosition = { x: 30, y: 30 };
      const svgPosition = screenToSVGPoint(screenPosition, svg);
      gsap.to("#year2020", {
        x: svgPosition.x,
        y: svgPosition.y,
      });
    }

    onMounted(() => {
      svg = document.getElementById("svg-timeline");
      setTimeout(() => {
        zoomToView("rect968");
      }, 500);
      // test zoom
    });
    return {
      moveYearTopLeft,
    };
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
