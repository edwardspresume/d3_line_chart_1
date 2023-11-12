import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

type RawDataPoint = {
    Date: string;
    Close: string;
};

type DataPoint = {
    Date: Date;
    Close: number;
};

const chartMargin = { top: 50, right: 50, bottom: 50, left: 70 };
const chartWidth = 900 - chartMargin.left - chartMargin.right;
const chartHeight = 400 - chartMargin.top - chartMargin.bottom;

async function fetchAndProcessData(): Promise<DataPoint[]> {
    const rawData = await d3.json<RawDataPoint[]>('data/XRP-USD.json');

    if (!rawData) {
        throw new Error('Data load error: No data returned');
    }

    const parseDate = d3.timeParse('%Y-%m-%d');

    return rawData
        .filter(({ Date, Close }) => Date && Close)
        .map(({ Date, Close }) => ({
            Date: parseDate(Date)!,
            Close: parseFloat(Close),
        }));
}

export default function LineChart() {
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Function to fetch and parse data
        const fetchDataAndCreateChart = async () => {
            try {
                const xrpData = await fetchAndProcessData();

                if (xrpData.length > 0 && chartContainerRef.current) {
                    // Clear the container before creating the chart
                    d3.select(chartContainerRef.current)
                        .selectAll('*')
                        .remove();

                    // Create the SVG container inside the div container
                    const svgContainer = d3
                        .select(chartContainerRef.current)
                        .append('svg')
                        .attr(
                            'width',
                            chartWidth + chartMargin.left + chartMargin.right
                        )
                        .attr(
                            'height',
                            chartHeight + chartMargin.top + chartMargin.bottom
                        )
                        .append('g')
                        .attr(
                            'transform',
                            `translate(${chartMargin.left}, ${chartMargin.top})`
                        );

                    // Define the x-axis scale
                    const xScale = d3
                        .scaleTime()
                        .domain(
                            d3.extent(xrpData, (d) => d.Date) as [Date, Date]
                        )
                        .range([0, chartWidth]);

                    // Define the y-axis scale
                    const yScale = d3
                        .scaleLinear()
                        .domain([
                            0.3,
                            d3.max(xrpData, (d) => d.Close) as number,
                        ])
                        .range([chartHeight, 0]);

                    // Draw the x-axis on the chart
                    svgContainer
                        .append('g')
                        .attr('transform', `translate(0,${chartHeight})`)
                        .call(d3.axisBottom(xScale))
                        .append('text')
                        .attr('x', chartWidth / 2)
                        .attr('y', 45)
                        .attr('fill', 'white') // Adjust label color to improve visibility
                        .style('text-anchor', 'middle')
                        .style('font-size', '16px')
                        .style('font-weight', 'bold')
                        .text('Date');

                    // Draw the y-axis on the chart
                    svgContainer
                        .append('g')
                        .call(d3.axisLeft(yScale))
                        .append('text')
                        .attr('transform', 'rotate(-90)')
                        .attr('y', -50)
                        .attr('x', -chartHeight / 2)
                        .attr('fill', 'white') // Adjust label color to improve visibility
                        .style('text-anchor', 'middle')
                        .style('font-size', '16px')
                        .style('font-weight', 'bold')
                        .text('Closing price');

                    svgContainer
                        .selectAll('xGrid')
                        .data(xScale.ticks().slice(1))
                        .join('line')
                        .attr('x1', (d) => xScale(d))
                        .attr('x2', (d) => xScale(d))
                        .attr('y1', 0)
                        .attr('y2', chartHeight)
                        .attr('stroke', 'rgba(255,255,255,0.1)')
                        .attr('stroke-width', 0.5);

                    svgContainer
                        .selectAll('yGrid')
                        .data(yScale.ticks().slice(1))
                        .join('line')
                        .attr('x1', 0)
                        .attr('x2', chartWidth)
                        .attr('y1', (d) => yScale(d))
                        .attr('y2', (d) => yScale(d))
                        .attr('stroke', 'rgba(255,255,255,0.1)')
                        .attr('stroke-width', 0.5);

                    // Draw the line
                    const line = d3
                        .line<DataPoint>()
                        .x((d) => xScale(d.Date))
                        .y((d) => yScale(d.Close));

                    svgContainer
                        .append('path')
                        .datum(xrpData)
                        .attr('fill', 'none')
                        .attr('stroke', 'steelblue')
                        .attr('stroke-width', 2)
                        .attr('d', line);
                }
            } catch (error) {
                console.error('Error fetching the data: ', error);
            }
        };

        fetchDataAndCreateChart();
    }, []); // Dependency array is empty to ensure effect runs only once
    return (
        <>
            <h1 className='text-2xl font-bold'>XRP Closing Price</h1>
            <div ref={chartContainerRef} className='bg-slate-800 rounded'></div>
        </>
    );
}
