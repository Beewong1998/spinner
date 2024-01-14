const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");
const inputs = document.getElementById("inputs");
//Object that stores values of minimum and maximum angle for a value
let rotationValues = [
  { minDegree: 0, maxDegree: 60, value: 6 },
  { minDegree: 61, maxDegree: 120, value: 5 },
  { minDegree: 121, maxDegree: 180, value: 4 },
  { minDegree: 181, maxDegree: 240, value: 3 },
  { minDegree: 241, maxDegree: 300, value: 2 },
  { minDegree: 301, maxDegree: 360, value: 1 },
];
//Size of each piece
let data = [1, 1, 1, 1, 1, 1];
//background color for each piece
var pieColors = [
  "#8b35bc",
  "#b163da",
  "#8b35bc",
  "#b163da",
  "#8b35bc",
  "#b163da",
];
//Create chart
let myChart = new Chart(wheel, {
  //Plugin for displaying text on pie chart
  plugins: [ChartDataLabels],
  //Chart Type Pie
  type: "pie",
  data: {
    //Labels(values which are to be displayed on chart)
    labels: [1, 2, 3, 4, 5, 6],
    //Settings for dataset/pie
    datasets: [
      {
        backgroundColor: pieColors,
        data: data,
      },
    ],
  },
  options: {
    //Responsive chart
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      //hide tooltip and legend
      tooltip: false,
      legend: {
        display: false,
      },
      //display labels inside pie chart
      datalabels: {
        color: "#ffffff",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 24 },
      },
    },
  },
});
//display value based on the randomAngle
const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    //if the angleValue is between min and max then display it
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      finalValue.innerHTML = `<p>Value: ${i.value}</p>`;
      spinBtn.disabled = false;
      return;
    } 
  };
  finalValue.innerHTML = `You've landed on the line, spin again!`;
  spinBtn.disabled = false;


};

//Spinner count
let count = 0;
//60 rotations for animation and last rotation for result
let resultValue = 15;
//Start spinning
spinBtn.addEventListener("click", () => {
    let arrayOfStrings = inputs.value.split(',')
    console.log(arrayOfStrings)

    let copyOfArrayOfStrings = arrayOfStrings.slice()

    rotationValues = copyOfArrayOfStrings.reverse().map((string, i) => {
        return {
            minDegree: i * 360 / arrayOfStrings.length + 1,
            maxDegree: i * 360 / arrayOfStrings.length + 360 / arrayOfStrings.length - 1,
            value: copyOfArrayOfStrings[i]
        }
    })
    console.log(`copy after reverse() ${copyOfArrayOfStrings}`)
    console.log(rotationValues)

      //Size of each piece
      data = Array(arrayOfStrings.length).fill(1);
      console.log(data)
      //background color for each piece
      const originalColors = ["#8b35bc", "#b163da",]
      var pieColors = data.map((item, index) => {
        const patternIndex = index % originalColors.length;
        return originalColors[patternIndex]
      })
      console.log(pieColors)
      //Create chart
      myChart.data = {
          //Labels(values which are to be displayed on chart)
          labels: arrayOfStrings,
          //Settings for dataset/pie
          datasets: [
            {
              backgroundColor: pieColors,
              data: data,
            },
          ],
        }

  spinBtn.disabled = true;
  //Empty final value
  finalValue.innerHTML = `<p>Good Luck!</p>`;
  //Generate random degrees to stop at
  let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
  console.log(`the random degree is ${randomDegree}`)
  //Interval for rotation animation
  let rotationInterval = window.setInterval(() => {
    //Set rotation for piechart
    /*
    Initially to make the piechart rotate faster we set resultValue to 101 so it rotates 101 degrees at a time and this reduces by 1 with every count. Eventually on last rotation we rotate by 1 degree at a time.
    */
    myChart.options.rotation = myChart.options.rotation + resultValue;
    //Update chart with new value;
    myChart.update();
    //If rotation>360 reset it back to 0
    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 2;
      myChart.options.rotation = 0;
      console.log(`count: ${count} resultValue: ${resultValue}`)
    } else if (count > 6 && myChart.options.rotation == randomDegree || resultValue <= 0) {
      valueGenerator(randomDegree);
      clearInterval(rotationInterval);
      console.log(`end-count: ${count} end-resultValue: ${resultValue}`)
      count = 0;
      resultValue = 15;
    }
  }, 10);
});