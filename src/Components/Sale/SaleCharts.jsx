import React, { useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  handleGetSalesChart,
  selectYearChartTypeNames,
  selectMonthChartTypeNames,
  selectMonthChartTypeValues,
  selectYearChartTypeValues,
  selectProvinceChartTypeNames,
  selectProvinceChartTypeValues,
  selectSeasonChartTypeNames,
  selectSeasonChartTypeValues,
  selectCustomerChartTypeNames,
  selectCustomerChartTypeValues,
} from "../Slices/chart/chartSlices";

const SaleCharts = () => {
  const dispatch = useDispatch();
  const yearChartTypeNames = useSelector(selectYearChartTypeNames);
  const yearChartTypeValues = useSelector(selectYearChartTypeValues);
  const monthChartTypeNames = useSelector(selectMonthChartTypeNames);
  const monthChartTypeValues = useSelector(selectMonthChartTypeValues);
  const provinceChartTypeNames = useSelector(selectProvinceChartTypeNames);
  const provinceChartTypeValues = useSelector(selectProvinceChartTypeValues);
  const seasonChartTypeNames = useSelector(selectSeasonChartTypeNames);
  const seasonChartTypeValues = useSelector(selectSeasonChartTypeValues);
  const customerChartTypeNames = useSelector(selectCustomerChartTypeNames);
  const customerChartTypeValues = useSelector(selectCustomerChartTypeValues);
  const series = [
    {
      name: "فروش سال جاری",
      data: [50, 350, 80, 160, 220, 22, 310, 230, 120, 90, 180, 280, 120],
    },
  ];
  const options = {
    chart: {
      height: 350,
      type: "bar",
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        columnWidth: "10%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 1,
    },

    grid: {
      row: {
        colors: ["#fff", "#f2f2f2"],
      },
    },
    xaxis: {
      labels: {
        rotate: -75,
        style: {
          fontSize: "5px",
          fontFamily: "iranSans",
        },
      },
      categories: [
        "مظروف یزد",
        "ساچی",
        "بلور تابان",
        "فلوت دماوند",
        "ایران فلوت",
        "فلوت کاویان",
        "کربنات",
        "بلور کاوه",
        "کاوه فلوت",
        "کاوه سیلیس",
        "متانول",
        "ایران تول",
        "آسا فلوت",
      ],
      tickPlacement: "on",
    },
    yaxis: {
      labels: {
        offsetX: -30,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.85,
        opacityTo: 0.85,
        stops: [50, 0, 100],
      },
    },
    responsive: [
      {
        breakpoint: 950,
        options: {
          chart: {
            height: 500,
          },
          xaxis: {
            labels: {
              rotate: -75,
              offsetY: 50,
              offsetX: -10,
            },
          },
        },
      },
    ],
  };
  const series2 = [
    {
      name: "1400",
      data: [1500, 800, 1200, 970, 660, 1600, 780],
    },
    {
      name: "1401",
      data: [1800, 900, 700, 1100, 600, 1900, 920],
    },
  ];
  const options2 = {
    chart: {
      height: 350,
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      labels: {
        rotate: -45,
        style: {
          fontSize: "5px",
          fontFamily: "iranSans",
        },
      },
      categories: [
        "ایران فلوت",
        "بلور تابان",
        "کاوه سودا",
        "کربنات",
        "مظروف یزد",
        "کاوه فلوت",
        "بلور ساچی",
      ],
    },
    yaxis: {
      labels: {
        offsetX: -30,
      },
    },
    responsive: [
      {
        breakpoint: 950,
        options: {
          xaxis: {
            labels: {
              rotate: -75,
              offsetY: 50,
              offsetX: -10,
            },
          },
        },
      },
    ],
  };
  const series44 = monthChartTypeValues;
  const options44 = {
    chart: {
      height: 350,
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      labels: {
        rotate: -45,
        style: {
          fontSize: "5px",
          fontFamily: "iranSans",
        },
      },
      categories: [
        "فروردین",
        "اردیبهشت",
        "خرداد",
        "تیر",
        "مرداد",
        "شهریور",
        "مهر",
        "آبان",
        "آذر",
        "دی",
        "بهمن",
        "اسفند",
      ],
      // categories: monthChartTypeNames
    },
    yaxis: {
      labels: {
        offsetX: -30,
      },
    },
  };
  const provinceSeries = provinceChartTypeValues;
  const provinceOptions = {
    labels: provinceChartTypeNames,
    chart: {
      width: 400,
      height: 350,
      type: "donut",
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
      },
    },
    colors: [
      "#7266ba",
      "#41a4f5",
      "#7ed320",
      "#f65c81",
      "#ffda07",
      "#f00d5b",
      "#50296f",
      "#fa8c2d",
      "#ED6A5E",
      "#D291BC",
    ],
    dataLabels: {
      enabled: true,
    },
    fill: {
      type: "gradient",
    },
    legend: {
      horizontalAlign: "center",
      fontFamily: "iranSans",
      customLegendItems: provinceChartTypeNames,
    },
    responsive: [
      {
        breakpoint: 1850,
        options: {
          chart: {
            width: 400,
          },
          legend: {
            position: "bottom",
          },
        },
      },
      {
        breakpoint: 1450,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
      {
        breakpoint: 1400,
        options: {
          chart: {
            width: 500,
          },
          legend: {
            position: "right",
          },
        },
      },
      {
        breakpoint: 550,
        options: {
          chart: {
            width: 400,
          },
          legend: {
            position: "bottom",
          },
        },
      },
      {
        breakpoint: 400,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };
  const seasonSeries = seasonChartTypeValues;
  const seasonOptions = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      stackType: "100%",
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    colors: ["#f65c81", "#7ed320", "#ffc107", "#3c91d9"],
    title: {
      text: "100% Stacked Bar",
    },
    xaxis: {
      categories: seasonChartTypeNames,
    },
    yaxis: {
      labels: {
        offsetX: -30,
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "K";
        },
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      horizontalAlign: "center",
      fontFamily: "iranSans",
      position: "top",
      offsetX: 40,
    },
  };

  const proSeries = [
    {
      name: "استکان آلازیا پنجره ای سفید",
      data: [3000, 3200, 3850, 3800, 4000, 5200],
    },
    {
      name: "استکان پارس فله آبی",
      data: [3500, 2000, 2100, 2500, 2600, 3900],
    },
    {
      name: "بستنی خوری آیس سفید",
      data: [2800, 2800, 2050, 2600, 2650, 2700],
    },
    {
      name: "استکان عینکی فله سفید",
      data: [3100, 3110, 2300, 2600, 2800, 3600],
    },
    {
      name: "استکان گلجام سفید",
      data: [2200, 2250, 2200, 2100, 2150, 2400],
    },
  ];
  const proOptions = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      stackType: "100%",
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    title: {
      text: "100% Stacked Bar",
    },
    xaxis: {
      categories: [1398, 1399, 1400, 1401, 1402],
    },
    yaxis: {
      labels: {
        offsetX: -30,
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "K";
        },
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      horizontalAlign: "center",
      fontFamily: "iranSans",
      position: "top",
      offsetX: 40,
    },
  };
  const customerSeries = [
    {
      name: "",
      data: customerChartTypeValues,
    },
  ];
  const customerOptions = {
    annotations: {
      points: [
        {
          x: "Bananas",
          seriesIndex: 0,
          label: {
            borderColor: "#775DD0",
            offsetY: 0,
            style: {
              color: "#fff",
              background: "#775DD0",
            },
            text: "Bananas are good",
          },
        },
      ],
    },
    chart: {
      height: 350,
      type: "bar",
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: "50%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 2,
    },

    grid: {
      row: {
        colors: ["#fff", "#f2f2f2"],
      },
    },
    xaxis: {
      labels: {
        rotate: -45,
        style: {
          fontSize: "5px",
          fontFamily: "iranSans",
        },
      },
      categories: customerChartTypeNames,
      tickPlacement: "on",
    },
    yaxis: {
      title: {
        text: "",
      },
      labels: {
        offsetX: -30,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.85,
        opacityTo: 0.85,
        stops: [50, 0, 100],
      },
    },
  };

  const yearSeries = yearChartTypeValues;
  const yearOptions = {
    labels: yearChartTypeNames,
    chart: {
      width: 400,
      height: 350,
      type: "donut",
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
      },
    },
    dataLabels: {
      enabled: true,
    },
    fill: {
      type: "gradient",
    },
    legend: {
      horizontalAlign: "center",
      fontFamily: "iranSans",
      customLegendItems: yearChartTypeNames,
    },
    responsive: [
      {
        breakpoint: 1850,
        options: {
          chart: {
            width: 400,
          },
          legend: {
            position: "bottom",
          },
        },
      },
      {
        breakpoint: 1450,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
      {
        breakpoint: 1400,
        options: {
          chart: {
            width: 500,
          },
          legend: {
            position: "right",
          },
        },
      },
      {
        breakpoint: 550,
        options: {
          chart: {
            width: 400,
          },
          legend: {
            position: "bottom",
          },
        },
      },
      {
        breakpoint: 400,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  useEffect(() => {
    dispatch(
      handleGetSalesChart({
        financeYear: "",
        chartType: "Month",
        numberOfRows: 10,
      })
    );
    dispatch(
      handleGetSalesChart({
        financeYear: "",
        chartType: "Products",
        numberOfRows: 10,
      })
    );
    dispatch(
      handleGetSalesChart({
        financeYear: "",
        chartType: "FinanceYear",
        numberOfRows: 10,
      })
    );
    dispatch(
      handleGetSalesChart({
        financeYear: "",
        chartType: "Customers",
        numberOfRows: 10,
      })
    );
    dispatch(
      handleGetSalesChart({
        financeYear: "1401",
        chartType: "Season",
        numberOfRows: 10,
      })
    );
  }, []);

  return (
    <Container fluid>
      <Row className="py-5">
        <Col md="12">
          <div className="my-4 text-center fw-bold">
            فروش ماهانه بلور به تفکیک 5 سال اخیر
          </div>
          <ReactApexChart
            options={options44}
            series={series44}
            type="area"
            height={350}
          />
        </Col>
      </Row>
      <hr className="my-5" />
      <Row className="py-5">
        <Col md="6">
          <div className="my-4 text-start fw-bold">10 سال پر فروش بلور</div>
          <ReactApexChart
            options={yearOptions}
            series={yearSeries}
            type="pie"
            height={350}
          />
        </Col>
        <Col md="6">
          <div className="my-4 fw-bold">10 محصول پر فروش بلور</div>
          <ReactApexChart
            options={provinceOptions}
            series={provinceSeries}
            type="donut"
            height={350}
          />
        </Col>
      </Row>
      <hr className="my-5" />
      <Row className="py-5">
        <Col md="12">
          <div className="my-4 text-center fw-bold">10 مشتری برتر بلور</div>
          <ReactApexChart
            options={customerOptions}
            series={customerSeries}
            type="bar"
            height={350}
          />
        </Col>
      </Row>
      <hr className="my-5" />
      <Row className="py-5">
        <Col md="12">
          <div className="my-4 text-center fw-bold">
            فروش فصلی 5 سال اخیر بلور
          </div>
          <ReactApexChart
            options={seasonOptions}
            series={seasonSeries}
            type="bar"
            height={350}
          />
        </Col>
      </Row>
      {/* <Row>
                <Col md='12' className="mb-5">
                    <ReactApexChart options={options} series={series} type="bar" height={350} />
                </Col>
                <Col lg='6' className="mb-5 mb-lg-0">
                    <ReactApexChart options={options2} series={series2} type="area" height={350} />
                </Col>
                <Col lg='6'>
                    <ReactApexChart options={options2} series={series2} type="area" height={350} />
                </Col>
            </Row> */}
    </Container>
  );
};

export default SaleCharts;
