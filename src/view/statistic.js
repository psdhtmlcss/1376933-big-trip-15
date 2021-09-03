import AbstractView from './abstract';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {types} from '../mock/offers';
import {calcEventDuration} from '../utils/common';
import {TimeMetric, Color, CurrencySigns} from '../const';
import {calcCostPointsByType, calcTypesCount, calcTimeSpend, sortData} from '../utils/statistic';

const BAR_HEIGHT = 55;
const ChartOption = {
  TYPE: 'horizontalBar',
  START: 'start',
  END: 'end',
  LEFT: 'left',
  FONT_SIZE_TITLE: 23,
  FONT_SIZE: 13,
  PADDING: 5,
  BAR_THICKNESS: 44,
  MIN_BAR_LENGTH: 50,
};

const ChartName = {
  MONEY: 'MONEY',
  TYPE: 'TYPE',
  TIME_SPEND: 'TIME-SPEND',
};

const renderMoneyChart = (container, sortTypes, sortPrices) => {
  new Chart(container, {
    plugins: [ChartDataLabels],
    type: ChartOption.TYPE,
    data: {
      labels: sortTypes,
      datasets: [{
        data: sortPrices,
        backgroundColor: Color.WHITE,
        hoverBackgroundColor: Color.WHITE,
        anchor: ChartOption.START,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: ChartOption.FONT_SIZE,
          },
          color: Color.BLACK,
          anchor: ChartOption.END,
          align: ChartOption.START,
          formatter: (val) => `${CurrencySigns.EURO} ${val}`,
        },
      },
      title: {
        display: true,
        text: ChartName.MONEY,
        fontColor: Color.BLACK,
        fontSize: ChartOption.FONT_SIZE_TITLE,
        position: ChartOption.LEFT,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: Color.BLACK,
            padding: ChartOption.PADDING,
            fontSize: ChartOption.FONT_SIZE,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: ChartOption.BAR_THICKNESS,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: ChartOption.MIN_BAR_LENGTH,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTypeChart = (container, sortTypes, sortCount) => {
  new Chart(container, {
    plugins: [ChartDataLabels],
    type: ChartOption.TYPE,
    data: {
      labels: sortTypes,
      datasets: [{
        data: sortCount,
        backgroundColor: Color.WHITE,
        hoverBackgroundColor: Color.WHITE,
        anchor: ChartOption.START,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: ChartOption.FONT_SIZE,
          },
          color: Color.BLACK,
          anchor: ChartOption.END,
          align: ChartOption.START,
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: ChartName.TYPE,
        fontColor: Color.BLACK,
        fontSize: ChartOption.FONT_SIZE_TITLE,
        position: ChartOption.LEFT,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: Color.BLACK,
            padding: ChartOption.PADDING,
            fontSize: ChartOption.FONT_SIZE,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: ChartOption.BAR_THICKNESS,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: ChartOption.MIN_BAR_LENGTH,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTimeChart = (container, sortTypes, sortTime) => {
  new Chart(container, {
    plugins: [ChartDataLabels],
    type: ChartOption.TYPE,
    data: {
      labels: sortTypes,
      datasets: [{
        data: sortTime,
        backgroundColor: Color.WHITE,
        hoverBackgroundColor: Color.WHITE,
        anchor: ChartOption.START,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: ChartOption.FONT_SIZE,
          },
          color: Color.BLACK,
          anchor: ChartOption.END,
          align: ChartOption.START,
          formatter: (val) => calcEventDuration(Math.round(val / TimeMetric.MS_IN_MINUTE)),
        },
      },
      title: {
        display: true,
        text: ChartName.TIME_SPEND,
        fontColor: Color.BLACK,
        fontSize: ChartOption.FONT_SIZE_TITLE,
        position: ChartOption.LEFT,
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: Color.BLACK,
            padding: ChartOption.PADDING,
            fontSize: ChartOption.FONT_SIZE,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: ChartOption.BAR_THICKNESS,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: ChartOption.MIN_BAR_LENGTH,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticTemplate = () => (
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="money" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="type" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="time-spend" width="900"></canvas>
    </div>
  </section>`
);

export default class StatisticTemplate extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
    this._moneyChart = null;
    this._typeChart = null;
    this._timeChart = null;
    this._setCharts();
  }

  _setCharts() {
    if (this._moneyChart !== null || this._typeChart !== null || this._timeChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }

    const prices = types.map((type) => calcCostPointsByType(type, this._points));
    sortData(prices);

    const typeCounts = types.map((type) => calcTypesCount(type, this._points));
    sortData(typeCounts);

    const timeIndicators = types.map((type) => calcTimeSpend(type, this._points));
    sortData(timeIndicators);

    const moneyCtx = this.getElement().querySelector('#money');
    const typeCtx = this.getElement().querySelector('#type');
    const timeCtx = this.getElement().querySelector('#time-spend');

    moneyCtx.height = BAR_HEIGHT * prices.length;
    typeCtx.height = BAR_HEIGHT * typeCounts.length;
    timeCtx.height = BAR_HEIGHT * timeIndicators.length;

    this._moneyChart = renderMoneyChart(moneyCtx, prices.map((item) => Object.keys(item)[0]), prices.map((item) => Object.values(item)[0]));
    this._typeChart = renderTypeChart(typeCtx, typeCounts.map((item) => Object.keys(item)[0]), typeCounts.map((item) => Object.values(item)[0]));
    this._timeChart = renderTimeChart(timeCtx, timeIndicators.map((item) => Object.keys(item)[0]), timeIndicators.map((item) => Object.values(item)[0]));
  }

  getTemplate() {
    return createStatisticTemplate();
  }
}
