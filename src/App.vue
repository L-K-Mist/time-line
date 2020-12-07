<template>
  <dev-panel></dev-panel>
  <TimeLine @click="zoomTo2020" />
  <div class="test-spot"></div>
</template>

<script>
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
// TODO next: Must split flag into rect(path) and line 
import { defineComponent, onMounted, watchEffect } from "vue";
import { gsap } from "gsap";

import { screenToSVGPoint } from "@/helpers"
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
    

    function arrangeElements2020(year) {
      let layoutTimeLine = gsap.timeline(); //create the timeline

      const screenPosition = { x: 30, y: 30 };
      const svgPosition = screenToSVGPoint(screenPosition, svg);

      const yearBox = document.getElementById(`year${year}`).getBBox()
      const screenBox = {
        topLeftPoint: screenToSVGPoint({ x: 0, y: windowHeight.value }, svg), 
        topRightPoint: screenToSVGPoint({ x: windowWidth.value, y: windowHeight.value }, svg),
        bottomRightPoint: screenToSVGPoint({ x: windowWidth.value, y: 0 }, svg),
        bottomLeftPoint:  screenToSVGPoint({ x: 0, y: 0 }, svg),
      }

      layoutTimeLine
      .to(`#flag${year}`, {
        attr: {
          d: `M ${screenBox.topLeftPoint.x},${screenBox.topLeftPoint.y} ${screenBox.topRightPoint.x},${screenBox.topRightPoint.y} ${screenBox.bottomRightPoint.x},${screenBox.bottomRightPoint.y} ${screenBox.bottomLeftPoint.x},${screenBox.bottomLeftPoint.y} Z`,    
          ["stroke-width"]: 10,
        },
        opacity: 0.7,
        duration: 1
      }, 1)
      .to(`#flag-pole${year}`, {
        x: 100,
        y: 80,
        opacity: 0
      }, 1)
      .to(`#year${year}`, {
        attr: { 
          x: svgPosition.x,
          y: svgPosition.y + yearBox.height * 0.8,
        },
      })
      .to(`#year${year}Scale`, {
        scale: 0.4,
      })
      .to("#test-pixel", {
        attr: {
          x: svgPosition.x,
          
        }
      })
    }



    function zoomToView(elementId) {
        const element = document.getElementById(elementId);
      const box = element.getBBox();
      return gsap.to(svg, {
          duration: 1,
        attr: { viewBox: viewBoxString(box) },
      });
    }


    async function zoomTo2020() {
      // This and arrangeElements needed to operate from two different timelines, because in between we need to convert the screen co-ords into svg co-ords.
      // eg Because we're moving the year to the top left corner of the user's screen; we need to first zoom in finished so that the correct svg point to move the heading to, can be "snap-shotted".
      const element = document.getElementById("rect968");
      await zoomToView("rect968")
      arrangeElements2020("2020")
    }

    onMounted(() => {
      svg = document.getElementById("svg-timeline");
    });
    return {
      zoomTo2020,
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
