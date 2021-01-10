<template>
  <dev-panel></dev-panel>
  <TimeLine @click="zoomTo2020" />
  <div class="test-spot"></div>
  <div class="video-selection"></div>
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
      
      const screenPosition = { x: 60, y: 30 };
      const svgPosition = screenToSVGPoint(screenPosition, svg);

      const yearBox = document.getElementById(`year${year}`).getBBox()
      console.log("🚀 ~ file: App.vue ~ line 46 ~ arrangeElements2020 ~ yearBox", yearBox)
      const screenBox = {
        topLeftPoint: screenToSVGPoint({ x: 0, y: windowHeight.value }, svg), 
        topRightPoint: screenToSVGPoint({ x: windowWidth.value, y: windowHeight.value }, svg),
        bottomRightPoint: screenToSVGPoint({ x: windowWidth.value, y: 0 }, svg),
        bottomLeftPoint:  screenToSVGPoint({ x: 0, y: 0 }, svg),
      }

      let layoutTimeLine = gsap.timeline({ defaults: {duration: 0.5} } ); //create the timeline
      layoutTimeLine
        .to(`#flag-pole${year}`, {
          x: 100,
          y: 80,
          opacity: 0
        })
      .to(`#flag${year}`, {
        attr: {
          d: `M ${screenBox.topLeftPoint.x},${screenBox.topLeftPoint.y} ${screenBox.topRightPoint.x},${screenBox.topRightPoint.y} ${screenBox.bottomRightPoint.x},${screenBox.bottomRightPoint.y} ${screenBox.bottomLeftPoint.x},${screenBox.bottomLeftPoint.y} Z`,    
          ["stroke-width"]: 10,
        },
        opacity: 0.7,
      }, 0.1)
      .to(`#year${year}`, {
        attr: { 
          x: svgPosition.x - 137,
          y: svgPosition.y + 39,
        },
      }, 1.2)

        .to(`#year${year}Scale`, {
          scale: 0.4,
          // transformOrigin: "top left"
        }, 1.2)
      .to("#test-pixel", {
        attr: {
          x: svgPosition.x,
        }
      })

      .to(`#customer${year}`, {
        attr: {
            x: svgPosition.x + 24 , 
            y: svgPosition.y + 6
          }
        }, 1.6)
      .to(`#customer${year}Scale`, {
        scale: 0.84
      }, 1.6)
      .to(`#projectName${year}`, {
        attr: {
          x: svgPosition.x + 40 , 
          y: svgPosition.y + 63,
        }
      }, 1.2)
      .to(`#projectName${year}Scale`, {
        scale: 1.7
      }, 1.2)
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

.video-selection{
   border: 2px dotted green;
   position: absolute;
   top: 25%;
   width: 100%;
   height: 75%;
}
</style>
