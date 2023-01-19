class Car {
  constructor(xOffset, yOffset, width, height) {
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = 3;
    this.maxReverseSpeed = -this.maxSpeed / 2;
    this.friction = 0.05;
    this.angle = 0;

    this.polygon = this.#createPolygon();
    this.damage = false;

    this.controls = new Controls();
    this.sensor = new Sensor(this);
  }

  #createPolygon() {
    const points = [];

    const radius = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    points.push({
      x: this.xOffset + Math.sin(this.angle - alpha) * radius,
      y: this.yOffset - Math.cos(this.angle - alpha) * radius,
    });
    points.push({
      x: this.xOffset + Math.sin(this.angle + alpha) * radius,
      y: this.yOffset - Math.cos(this.angle + alpha) * radius,
    });
    points.push({
      x: this.xOffset + Math.sin(Math.PI + this.angle - alpha) * radius,
      y: this.yOffset - Math.cos(Math.PI + this.angle - alpha) * radius,
    });
    points.push({
      x: this.xOffset + Math.sin(Math.PI + this.angle + alpha) * radius,
      y: this.yOffset - Math.cos(Math.PI + this.angle + alpha) * radius,
    });

    return points;
  }

  #assessDamage(roadBorders) {
    let hasCarBeenDamaged = false;

    roadBorders.forEach((roadBoard) => {
      if (polysIntersect(this.polygon, roadBoard)) hasCarBeenDamaged = true;
    });

    return hasCarBeenDamaged;
  }

  #updateY() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    } else if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
    else if (this.speed < this.maxReverseSpeed)
      this.speed = this.maxReverseSpeed;

    if (this.speed > 0) this.speed -= this.friction;
    else if (this.speed < 0) this.speed += this.friction;

    if (Math.abs(this.speed) < this.friction) this.speed = 0;
  }

  #updateX() {
    if (this.speed !== 0) {
      const reverse = this.speed > 0 ? 1 : -1;

      if (this.controls.left) this.angle -= 0.03 * reverse;
      else if (this.controls.right) this.angle += 0.03 * reverse;
    }
  }

  #move() {
    this.#updateY();
    this.#updateX();

    this.xOffset += Math.sin(this.angle) * this.speed;
    this.yOffset -= Math.cos(this.angle) * this.speed;
  }

  update(roadBorders) {
    if (!this.damage) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damage = this.#assessDamage(roadBorders);
    }

    this.sensor.update(roadBorders);
  }

  draw(ctx) {
    if (this.damage) ctx.fillStyle = "gray";
    else ctx.fillStyle = "black";

    ctx.beginPath();

    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();

    this.sensor.draw(ctx);
  }
}
