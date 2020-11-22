<template>
  <dev-panel></dev-panel>
  <TimeLine @click="moveYearTopLeft" />
  <div class="test-spot"></div>
</template>

<script>
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
// TODO next: Must split flag into rect(path) and line 
import { defineComponent, onMounted, watchEffect } from "vue";
import { gsap } from "gsap";

import {
  useMousePositionScreen,
  useMousePositionSVG,
  useWindowSize
} from "@/composables/WebApi";

import TimeLine from "@/components/TimeLine";
import DevPanel from "@/components/DevPanel";

export default defineComponent({
  name: "App",
  components: {
    TimeLine,
    DevPanel
  },
  setup() {
    const { windowWidth, windowHeight} = useWindowSize();

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
      const screenBox = {
        topLeftPoint: screenToSVGPoint({ x: 0, y: windowHeight.value }, svg), 
        topRightPoint: screenToSVGPoint({ x: windowWidth.value, y: windowHeight.value }, svg),
        bottomRightPoint: screenToSVGPoint({ x: windowWidth.value, y: 0 }, svg),
        bottomLeftPoint:  screenToSVGPoint({ x: 0, y: 0 }, svg),
    }
      console.log("moveYearTopLeft -> yearBox", yearBox)
      tl
      .to("#flag-pole2020", {
        x: 14,
        y: 180
      }).to("#flag2020", {
        attr: {
          d: `M ${screenBox.topLeftPoint.x},${screenBox.topLeftPoint.y} ${screenBox.topRightPoint.x},${screenBox.topRightPoint.y} ${screenBox.bottomRightPoint.x},${screenBox.bottomRightPoint.y} ${screenBox.bottomLeftPoint.x},${screenBox.bottomLeftPoint.y} Z`
        },
        duration: 1
      }, "-=0.5")
      .to("#year2020", {
        attr: { x: svgPosition.x , y: svgPosition.y + yearBox.height * 0.75 },
      })
      .to("#year2020", {
        scale: 0.4
      }, "-=0.8");
      debugger;
    }

    const aBoxThatNeedsABetterName = {
      topLeftPoint: {
        x: 261.158, 
        y: 670.171
      },
      topRightPoint: {
        x: 477.17598,
        y: 670.17077
      },
      bottomRightPoint: {
        x: 477.176,
        y: 631.449
      },
      bottomLeftPoint: {
        x: 261.15788,
        y: 631.44916
      },
    }

    onMounted(() => {
      svg = document.getElementById("svg-timeline");
      const startingPath = `M ${aBoxThatNeedsABetterName.topLeftPoint.x},${aBoxThatNeedsABetterName.topLeftPoint.y} ${aBoxThatNeedsABetterName.topRightPoint.x},${aBoxThatNeedsABetterName.topRightPoint.y} ${aBoxThatNeedsABetterName.bottomRightPoint.x},${aBoxThatNeedsABetterName.bottomRightPoint.y} ${aBoxThatNeedsABetterName.bottomLeftPoint.x},${aBoxThatNeedsABetterName.bottomLeftPoint.y} Z`
      console.log("setup -> startingPath", startingPath)
      
    gsap.set("#flag2020", {
      attr: {
        // Conceptually deconstructed this path according to what each point means in terms of the goal:  Morphing to the edge of the screen.
        d: startingPath
      }
    })
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
body {

  overflow: hidden;
}
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
#flag2020 {
  opacity: 0.5;
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
