import {Line} from "react-chartjs-2";
const LineChart = ({ data }) => {
    const chartData = {
        labels: data.map(entry => entry.activity_date),
        datasets: [
            {
                label: 'Lượt truy cập',
                data: data.map(entry => entry.activity_count),
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                },
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Lượt truy cập',
                },
            },
        },
    };

    return <Line data={chartData} options={chartOptions} />;
};

export default LineChart;