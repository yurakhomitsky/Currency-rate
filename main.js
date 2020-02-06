function getDate() {
  temp_date = new Date();
  day = temp_date.getDate();
  month = temp_date.getMonth() + 1;
  year = temp_date.getFullYear();

  document.getElementById("today").innerHTML = `${day}:${month}:${year}`;
  return temp_date;
}
setInterval(getDate, 0);


const CurrencyRateObj = {
  USD: "",
  EUR: "",
  PLN: ""
};

var currenc = document.getElementById("currency");
var currencyTwo = document.getElementById("currencyTwo");
var search = document.getElementById("search");
var startdate = document.getElementById("cdate");
var enddate = document.getElementById("bdate");

search.addEventListener("click", currency, false);


var exchange = document.getElementById("exchange");
exchange.addEventListener(
  "click",
  function(e) {
    var numberOne = document.getElementById("numberOne").value;
    var numberTwo = document.getElementById("numberTwo");
    var currencyOne = document.getElementById("currencyOne").value;
    var currencyTwo = document.getElementById("currencyTwo").value;
    if (currencyOne == "UAH") {
      numberTwo.value = (numberOne / CurrencyRateObj[currencyTwo]).toFixed(2);
    } else if (currencyTwo == "UAH") {
      numberTwo.value = (numberOne * CurrencyRateObj[currencyOne]).toFixed(2);
    }
  },
  false
);

async function currency(e) {
  let now = getDate();
  StartDate = new Date(startdate.value);
  EndDate = new Date(enddate.value);

  chartData.series[0].name = currenc.value;
  chartData.xAxis.categories = [];
  chartData.series[0].data = [];

  if (currenc.value == "" || startdate.value == "" || enddate.value == "") {
    alert("Не вибрані дані в обовязкових полях");
    return;
  } else if (StartDate > now || EndDate > now || EndDate < StartDate) {
    alert("Не корректно вибрана дата");
    return;
  }
  StartDate = Date.parse(StartDate);
  EndDate = Date.parse(EndDate);
  for (let i = StartDate; i <= EndDate; i = i + 24 * 60 * 60 * 1000) {
    let url = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${
      currenc.value
    }&date=${new Date(i)
      .toISOString()
      .substr(0, 10)
      .split("-")
      .join("")}&json`;
    let response = await fetch(url);
    let data = await response.json();
    var itemObj = {
      rate: data[0].rate,
      exchangedate: data[0].exchangedate
    };
    chartData.series[0].data.push(Number(itemObj.rate.toFixed(2)));
    chartData.xAxis.categories.push(new Date(i).toGMTString().substr(5, 6));
  }
  Highcharts.chart("container", chartData);
}

async function manipulDom(e) {
  let nowDate = getDate();
  const URItwo = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${nowDate
    .toISOString()
    .substr(0, 10)
    .split("-")
    .join("")}&json`;
  let response = await fetch(URItwo);
  var data = await response.json();
  data.forEach(function(key) {
    if (CurrencyRateObj.hasOwnProperty(key.cc)) {
      CurrencyRateObj[key.cc] = key.rate.toFixed(2);
    }
  });
  rateone.textContent = `Долар США ${CurrencyRateObj.USD} грн`;
  ratetwo.textContent = `Євро ${CurrencyRateObj.EUR}грн`;
  ratetree.textContent = `Злоті ${CurrencyRateObj.PLN}грн`;
}

function onLoad() {
  manipulDom();
}

window.onload = onLoad;

var chartData = {
  title: {
    text: "Графік курса валют НБУ."
  },

  subtitle: {
    text: ""
  },
  xAxis: {
    categories: []
  },
  yAxis: {
    title: {
      text: "Курс"
    }
  },
  legend: {
    layout: "vertical",
    align: "right",
    verticalAlign: "middle"
  },

  // plotOptions: {
  //   series: {
  //     label: {
  //       connectorAllowed: false
  //     },
  //     pointStart: 0
  //   }
  // },

  series: [
    {
      name: "",
      data: []
    }
  ],

  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          legend: {
            layout: "horizontal",
            align: "center",
            verticalAlign: "bottom"
          }
        }
      }
    ]
  }
};

Highcharts.chart("container", chartData);
