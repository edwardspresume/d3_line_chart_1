'use client';

import LineChart from './components/LineChart';
import LineChartRe from './components/LineChartRe';

export default function Home() {
    return (
        <div className='grid gap-10'>
            <LineChart />

            <LineChartRe />
        </div>
    );
}
