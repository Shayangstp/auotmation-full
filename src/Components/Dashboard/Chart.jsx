import React from "react";

import PieChart, {
  Series,
  Label,
  Connector,
  Size,
} from "devextreme-react/pie-chart";

const Chart = () => {
  const areas = [
    {
      country: "دفتر مرکزی",
      area: 12,
    },
    {
      country: "ایران فلوت",
      area: 7,
    },
    {
      country: "ساچی",
      area: 7,
    },
    {
      country: "کاغذسازی",
      area: 7,
    },
    {
      country: "مظروف یزد",
      area: 6,
    },
    {
      country: "بلور شیشه تابان",
      area: 5,
    },
    {
      country: "کاوه سودا",
      area: 2,
    },
    {
      country: "ابهر سیلیس",
      area: 55,
    },
  ];

  return (
    <PieChart
      className="bg-white rounded shadow01 p-3"
      id="pie"
      dataSource={areas}
      palette="Bright"
      onPointClick={(e) => pointClickHandler(e)}
      onLegendClick={(e) => legendClickHandler(e)}
    >
      <Series argumentField="country" valueField="area">
        <Label visible={true}>
          <Connector visible={true} width={0.5} />
        </Label>
      </Series>

      <Size width={300} />
    </PieChart>
  );
};

const pointClickHandler = (e) => {
  toggleVisibility(e.target);
};

const legendClickHandler = (e) => {
  const arg = e.target;
  const item = e.component.getAllSeries()[0].getPointsByArg(arg)[0];

  toggleVisibility(item);
};

const toggleVisibility = (item) => {
  item.isVisible() ? item.hide() : item.show();
};

export default Chart;
