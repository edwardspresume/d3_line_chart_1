'use client';

import LineChart from './components/LineChart';

export default function Home() {
    return (
        <div className='grid gap-2 p-2 content-center justify-items-center h-[100vh]'>
            <LineChart />
        </div>
    );
}
