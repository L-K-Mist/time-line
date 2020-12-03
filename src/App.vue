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
    let layoutTimeLine = gsap.timeline(); //create the timeline

    function arrangeElements2020() {
    console.log("arrangeElements2020 TRIGGERED")

      const screenPosition = { x: 30, y: 30 };
      const svgPosition = screenToSVGPoint(screenPosition, svg);

      const yearBox = document.getElementById("year2020").getBBox()
      const screenBox = {
        topLeftPoint: screenToSVGPoint({ x: 0, y: windowHeight.value }, svg), 
        topRightPoint: screenToSVGPoint({ x: windowWidth.value, y: windowHeight.value }, svg),
        bottomRightPoint: screenToSVGPoint({ x: windowWidth.value, y: 0 }, svg),
        bottomLeftPoint:  screenToSVGPoint({ x: 0, y: 0 }, svg),
      }


      layoutTimeLine.to("#customer2020", {
        attr: {x: screenBox.bottomRightPoint.x - 300, y: screenBox.bottomRightPoint.y + 100 }
      })
      .to("#flag-pole2020", {
        x: 14,
        y: 180
      })
      .to("#flag2020", {
        attr: {
          d: `M ${screenBox.topLeftPoint.x},${screenBox.topLeftPoint.y} ${screenBox.topRightPoint.x},${screenBox.topRightPoint.y} ${screenBox.bottomRightPoint.x},${screenBox.bottomRightPoint.y} ${screenBox.bottomLeftPoint.x},${screenBox.bottomLeftPoint.y} Z`
        },
        duration: 1
      })
      .to("#year2020", {
        attr: { 
          x: svgPosition.x,
          y: svgPosition.y + yearBox.height * 0.8,
        },
      })
      .to("#year2020Scale", {
        scale: 0.5,
      })
      .to("#test-pixel", {
        attr: {
          x: svgPosition.x,
          
        }
      })
    }



    // function zoomToView(elementId) {
      //   const element = document.getElementById(elementId);
    //   const box = element.getBBox();
    //   return gsap.to(svg, {
      //     duration: 1,
    //     attr: { viewBox: viewBoxString(box) },
    //   });
    // }


    function zoomTo2020() {
      // This and arrangeElements needed to operate from two different timelines, because in between we need to convert the screen co-ords into svg co-ords.
      // eg Because we're moving the year to the top left corner of the user's screen; we need to first zoom in finished so that the correct svg point to move the heading to, can be "snap-shotted".
      const element = document.getElementById("rect968");
      const zoomBox = element.getBBox();

      let zoomTimeLine = gsap.timeline();
      zoomTimeLine.to(svg, {
        duration: 1,
        attr: { viewBox: viewBoxString(zoomBox) },
      }).then(arrangeElements2020)
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
