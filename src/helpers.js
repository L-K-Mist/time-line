export function angleBetweenPoints(p1, p2) {
  const angle = Math.PI + Math.atan2(-p2.x + p1.x, p2.y - p1.y);
  return angle * 180 / Math.PI;
}
