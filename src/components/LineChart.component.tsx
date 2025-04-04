import { FC } from "react";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  ChartData,
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
  Legend
);

export type TLineChartData = {
  label: string;
  data: number[];
  borderColor: string;
};

interface IProps {
  labels: string[];
  data: TLineChartData[];
  isDarkMode: boolean;
}

const LineChart: FC<IProps> = ({ labels, data, isDarkMode }) => {
  const dataset: ChartData<"line", number[], string> = {
    labels,
    datasets: data,
  };

  const options: any = {
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? "#ececec" : "#4d4d4d",
        },
      },
    },
    scales: {
      y: {
        ticks: { color: isDarkMode ? "#ececec" : "#4d4d4d" },
      },
      x: {
        ticks: { color: isDarkMode ? "#ececec" : "#4d4d4d" },
      },
    },
  };

  return <Line data={dataset} options={options} />;
};

export default LineChart;
