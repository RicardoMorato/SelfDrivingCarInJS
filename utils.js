const controlsTypes = {
  keyboardListener: "keyboardListener",
  aiController: "aiController",
  trafficObstacle: "trafficObstacle",
};

// Also known as Linear Interpolation
// https://en.wikipedia.org/wiki/Linear_interpolation
function lerp(pointA, pointB, t) {
  return pointA + (pointB - pointA) * t;
}

function getIntersection(A, B, C, D) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom !== 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1)
      return {
        touch: {
          x: lerp(A.x, B.x, t),
          y: lerp(A.y, B.y, t),
          offset: t,
        },
        hasIntersection: true,
      };
  }

  return { touch: null, hasIntersection: false };
}

function polysIntersect(polygonA, polygonB) {
  for (let i = 0; i < polygonA.length; i++) {
    for (let j = 0; j < polygonB.length; j++) {
      const { hasIntersection, touch } = getIntersection(
        polygonA[i],
        polygonA[(i + 1) % polygonA.length],
        polygonB[j],
        polygonB[(j + 1) % polygonB.length]
      );

      if (hasIntersection) return true;
    }
  }

  return false;
}

function getRGBA(value) {
  const alpha = Math.abs(value);
  const R = value < 0 ? 0 : 255;
  const G = R;
  const B = value > 0 ? 0 : 255;
  return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}
