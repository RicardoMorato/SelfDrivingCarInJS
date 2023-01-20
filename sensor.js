class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 150;
    this.raySpread = Math.PI / 2;

    this.rays = [];
    this.readings = [];
  }

  #castRays() {
    this.rays = [];

    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
        ) - this.car.angle;

      const start = { x: this.car.xOffset, y: this.car.yOffset };
      const end = {
        x: this.car.xOffset - Math.sin(rayAngle) * this.rayLength,
        y: this.car.yOffset - Math.cos(rayAngle) * this.rayLength,
      };

      this.rays.push([start, end]);
    }
  }

  #getReading(ray, roadBorders, traffic) {
    const touches = [];

    roadBorders.forEach((border) => {
      const { touch, hasIntersection } = getIntersection(
        ray[0],
        ray[1],
        border[0],
        border[1]
      );

      if (hasIntersection) touches.push(touch);
    });

    traffic.forEach((trafficBlock) => {
      const poly = trafficBlock.polygon;

      for (let i = 0; i < poly.length; i++) {
        const { touch, hasIntersection } = getIntersection(
          ray[0],
          ray[1],
          poly[i],
          poly[(i + 1) % poly.length]
        );

        if (hasIntersection) touches.push(touch);
      }
    });

    if (!touches.length) return null;
    else {
      const offsets = touches.map((borderTouch) => borderTouch.offset);
      const minOffset = Math.min(...offsets);

      return touches.find((borderTouch) => borderTouch.offset === minOffset);
    }
  }

  update(roadBorders, traffic) {
    this.#castRays();

    this.readings = [];

    this.rays.forEach((ray) =>
      this.readings.push(this.#getReading(ray, roadBorders, traffic))
    );
  }

  #drawRay(ctx, ray, index) {
    let end = ray[1];
    if (this.readings[index]) end = this.readings[index];

    // Drawing until first intersection
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "yellow";

    ctx.moveTo(ray[0].x, ray[0].y);
    ctx.lineTo(end.x, end.y);

    ctx.stroke();

    // Drawing from first intersection until ray length
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";

    ctx.moveTo(ray[1].x, ray[1].y);
    ctx.lineTo(end.x, end.y);

    ctx.stroke();
  }

  draw(ctx) {
    this.rays.forEach((ray, index) => this.#drawRay(ctx, ray, index));
  }
}
