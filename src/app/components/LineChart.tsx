import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

const chartMargin = { top: 50, right: 50, bottom: 50, left: 70 };
const chartWidth = 500 - chartMargin.left - chartMargin.right;
const chartHeight = 500 - chartMargin.top - chartMargin.bottom;

const sampleData = [
    { date: new Date(2020, 0, 1), value: 100 },
    { date: new Date(2020, 0, 2), value: 200 },
    { date: new Date(2020, 0, 3), value: 300 },
    { date: new Date(2020, 0, 4), value: 400 },
    { date: new Date(2020, 0, 5), value: 500 },
    { date: new Date(2020, 0, 6), value: 600 },
    { date: new Date(2020, 0, 7), value: 700 },
    { date: new Date(2020, 0, 8), value: 800 },
    { date: new Date(2020, 0, 9), value: 900 },
    { date: new Date(2020, 0, 10), value: 1000 },
];

export default function LineChart() {
    // Reference for the container of the SVG element
    const chartContainerRef = useRef(null);

    useEffect(() => {
        // SVG element to which D3 will append the chart
        const svgElement = chartContainerRef.current;

        // Only create the chart once, but update its data/content when needed.
        if (svgElement && !svgElement.hasChildNodes()) {
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
            const timeScale = d3
                .scaleTime()
                .domain(d3.extent(sampleData, (d) => d.date))
                .range([0, chartWidth]);

            // Define the y-axis scale
            const valueScale = d3
                .scaleLinear()
                .domain([0, d3.max(sampleData, (d) => d.value)])
                .range([chartHeight, 0]);

            // Draw the x-axis on the chart
            const xAxis = svgContainer
                .append('g')
                .attr('transform', `translate(0,${chartHeight})`)
                .call(d3.axisBottom(timeScale))
                .append('text')
                .attr('x', chartWidth / 2)
                .attr('y', 45)
                .attr('fill', 'black') // Adjust label color to improve visibility
                .style('text-anchor', 'middle')
                .style('font-size', '16px')
                .style('font-weight', 'bold')
                .text('Date');

            // Draw the y-axis on the chart
            const yAxis = svgContainer
                .append('g')
                .call(d3.axisLeft(valueScale))
                .append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', -50)
                .attr('x', -chartHeight / 2)
                .attr('fill', 'black') // Adjust label color to improve visibility
                .style('text-anchor', 'middle')
                .style('font-size', '16px')
                .style('font-weight', 'bold')
                .text('Volume');
        }

        // Any additional rendering logic that needs to update the SVG
        // can go here, inside the `useEffect` but outside the `if` block.
    }, []); // Empty dependency array ensures this effect runs only once

    return (
        <div
            ref={chartContainerRef}
            className='bg-slate-600 w-[500px] h-[500px] rounded'></div>
    );
}
