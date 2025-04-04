import { FC } from "react";
import { Pie } from "react-chartjs-2";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export type TDoughnutChartData = {
  label: string;
  data: number[];
  backgroundColor: string[];
};

interface IProps {
  labels: string[];
  data: TDoughnutChartData;
  isDarkMode: boolean;
}

const DoughnutChart: FC<IProps> = ({ labels, data, isDarkMode }) => {
  const dataset = {
    labels,
    datasets: [data],
  };

  const options: any = {
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? "#ececec" : "#4d4d4d",
        },
      },
    },
    scales: {},
  };

  return <Pie data={dataset} options={options} />;
};

export default DoughnutChart;
