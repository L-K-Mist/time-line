import { ref, onMounted, onUnmounted, watchEffect } from "vue";
import { throttle } from "lodash";
import { angleBetweenPoints } from "@/helpers";

export function useMousePositionScreen() {
  const x = ref(0);
  const y = ref(0);

  function handler(event) {
    x.value = event.clientX;
    y.value = event.clientY;
  }

  const throttledHandler = throttle(handler, 200);
  onMounted(() => {
    window.addEventListener("mousemove", throttledHandler);
  });

  onUnmounted(() => {
    window.removeEventListener("mousemove", throttledHandler);
  });

  return {
    x,
    y
  };
}

function screenToSVGPoint(screenPoint, svgElement) {
  const point = svgElement.createSVGPoint();
  point.x = screenPoint.x;
  point.y = screenPoint.y;
  const svgPoint = point.matrixTransform(svgElement.getScreenCTM().inverse());
  return svgPoint;
}

export function useMousePositionSVG(svgId) {
  const svgX = ref(0);
  const svgY = ref(0);
  let svg;
  function handler(event) {
    const svgPoint = screenToSVGPoint(
      { x: event.clientX, y: event.clientY },
      svg
    );
    const { x, y } = svgPoint;
    svgX.value = Number.parseFloat(x).toFixed(2);
    // console.log("handler -> svgX.value", svgX.value);
    svgY.value = Number.parseFloat(y).toFixed(2);
    // console.log("handler -> svgY.value", svgY.value);
  }

  const throttledHandler = throttle(handler, 200);
  onMounted(() => {
    svg = document.getElementById(svgId);
    svg.addEventListener("mousemove", throttledHandler);
  });

  onUnmounted(() => {
    svg.removeEventListener("mousemove", throttledHandler);
  });

  return {
    svgX,
    svgY
  };
}

function getCenterPoint(elementId) {
  const box = document.getElementById(elementId).getBBox();
  console.log("getCenterPoint -> box", box);
  return {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2
  };
}

export function useAngleBetweenMouseAndCenter(svgX, svgY, elementId) {
  const angle = ref(0);
  onMounted(() => {
    const centerPoint = getCenterPoint(elementId);
    console.log("useAngleBetweenMouseAndCenter -> centerPoint", centerPoint);
    // const centerPoint = {
    //   x: 477,
    //   y: 481
    // };
    watchEffect(() => {
      // console.log("useAngleBetweenMouseAndCenter -> centerPoint", centerPoint);
      angle.value = angleBetweenPoints(centerPoint, {
        x: svgX.value,
        y: svgY.value
      });
    });
  });
  return { angle };
}
