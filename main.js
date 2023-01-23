const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const laneCount = 3;
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, laneCount);

const numberOfCars = 100;
const cars = generateCars(numberOfCars);

let bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));

    if (i !== 0) NeuralNetwork.mutate(cars[i].brain, 0.15);
  }
}

const traffic = generateTraffic();

// [
//   new Car(
//     road.getLaneCenter(1),
//     -100,
//     30,
//     50,
//     controlsTypes.trafficObstacle,
//     2
//   ),
//   new Car(
//     road.getLaneCenter(0),
//     -300,
//     30,
//     50,
//     controlsTypes.trafficObstacle,
//     2
//   ),
//   new Car(
//     road.getLaneCenter(2),
//     -300,
//     30,
//     50,
//     controlsTypes.trafficObstacle,
//     2
//   ),

//   new Car(
//     road.getLaneCenter(0),
//     -500,
//     30,
//     50,
//     controlsTypes.trafficObstacle,
//     2
//   ),

//   new Car(
//     road.getLaneCenter(2),
//     -500,
//     30,
//     50,
//     controlsTypes.trafficObstacle,
//     2
//   ),

//   new Car(
//     road.getLaneCenter(1),
//     -700,
//     30,
//     50,
//     controlsTypes.trafficObstacle,
//     2
//   ),

//   new Car(
//     road.getLaneCenter(0),
//     -700,
//     30,
//     50,
//     controlsTypes.trafficObstacle,
//     2
//   ),
// ];

animate();

function saveToLocalStorage() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function removeFromLocalStorage() {
  localStorage.removeItem("bestBrain");
}

function generateCars(numberOfCars) {
  const cars = [];

  for (i = 1; i < numberOfCars; i++)
    cars.push(
      new Car(road.getLaneCenter(1), 100, 30, 50, controlsTypes.aiController)
    );

  return cars;
}

function generateTraffic() {
  const numberOfCars = Math.ceil(Math.random() * 200);
  const cars = [];

  for (let i = 0; i < numberOfCars; i++) {
    const car = new Car(
      road.getLaneCenter(Math.round(Math.random() * (laneCount - 1))),
      i * -200,
      30,
      50,
      controlsTypes.trafficObstacle,
      2
    );

    cars.push(car);

    if (Math.random() > 0.6) {
      const secondCar = new Car(
        road.getLaneCenter(Math.round(Math.random() * (laneCount - 1))),
        i * -200,
        30,
        50,
        controlsTypes.trafficObstacle,
        2
      );

      cars.push(secondCar);
    }
  }

  return cars;
}

function animate(time) {
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  const minCarsYOffset = Math.min(...cars.map((car) => car.yOffset));
  bestCar = cars.find((car) => car.yOffset === minCarsYOffset);

  carCtx.save();
  carCtx.translate(0, -bestCar.yOffset + carCanvas.height * 0.7);

  road.draw(carCtx);

  traffic.forEach((trafficCar) => {
    trafficCar.draw(carCtx, "red");
    trafficCar.update(road.borders, []);
  });

  carCtx.globalAlpha = 0.2;

  cars.forEach((car) => {
    car.draw(carCtx, "blue");
    car.update(road.borders, traffic);
  });

  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;

  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}
