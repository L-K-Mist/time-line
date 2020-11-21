<template>
  <dev-panel></dev-panel>
  <TimeLine @click="moveYearTopLeft" />
  <div class="test-spot"></div>
</template>

<script>
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */

import { defineComponent, onMounted, watchEffect } from "vue";
import { gsap } from "gsap";

import TimeLine from "@/components/TimeLine";
import DevPanel from "@/components/DevPanel";

export default defineComponent({
  name: "App",
  components: {
    TimeLine,
    DevPanel
  },
  setup() {
    function viewBoxString(frame) {
      return `${frame.x} ${frame.y} ${frame.width} ${frame.height}`;
    }
    let svg;
    let tl = gsap.timeline(); //create the timeline
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
      const yearBox = document.getElementById("year2020").getBBox()
      console.log("moveYearTopLeft -> yearBox", yearBox)
      tl.to("#year2020", {
        attr: { x: svgPosition.x , y: svgPosition.y + yearBox.height * 0.75 },
      })
      .to("#year2020", {
        scale: 0.6
      }, 0.1);
      debugger;
    }

    onMounted(() => {
      svg = document.getElementById("svg-timeline");
      // gsap.set("#year2020", {
      //   transformOrigin: "top left"
      // })
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
#year2020 {
  border: 1px dotted pink;
  /* transform: translateX(-100%); */
}
.test-spot {
  width: 10px;
  height: 10px;
  position: absolute;
  top: 30px;
  left: 30px;
  background-color: darkblue;
}
</style>
