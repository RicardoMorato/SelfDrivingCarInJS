const canvas = document.getElementById("myCanvas");
canvas.width = 200;

const ctx = canvas.getContext("2d");

const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "keyboardListener");
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "trafficObstacle", 2),
];

animate();

function animate() {
  canvas.height = window.innerHeight;

  ctx.save();
  ctx.translate(0, -car.yOffset + canvas.height * 0.7);

  road.draw(ctx);
  traffic.forEach((trafficCar) => {
    trafficCar.draw(ctx, "red");
    trafficCar.update(road.borders, []);
  });
  car.draw(ctx, "blue");
  car.update(road.borders, traffic);

  ctx.restore();
  requestAnimationFrame(animate);
}
