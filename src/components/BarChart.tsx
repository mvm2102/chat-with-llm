import {Bar} from "react-chartjs-2";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip,} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
    data: number[];
    labels: string[];
    title: string;
}

export default function BarChart({ data, labels, title }: BarChartProps) {
    const chartData = {
        labels,
        datasets: [
            {
                label: "Dữ liệu",
                data,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" as const },
            title: { display: true, text: title },
        },
    };

    return <Bar data={chartData} options={options} />;
}