'use client';
import 'chartjs-adapter-date-fns';

import { Line } from 'react-chartjs-2';
import xrpData from '../../../public/data/XRP-USD.json';

import {
    Chart as ChartJS,
    LineElement,
    LinearScale,
    PointElement,
    TimeScale,
    Tooltip,
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, TimeScale);

export default function LineChartRe() {
    const data = {
        labels: xrpData.map((item) => new Date(item.Date)),
        datasets: [
            {
                label: 'Closing Price',
                data: xrpData.map((item) => item.Close),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    const options = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'month',
                },
            },
        },
    };
    return (
        <div>
            <h2 className='text-center font-bold text-2xl mb-2'>
                Line Chart with chart.js
            </h2>

            <Line options={options} data={data} />
        </div>
    );
}
