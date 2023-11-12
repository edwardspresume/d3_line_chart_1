import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

const chartMargin = { top: 50, right: 50, bottom: 50, left: 70 };
const chartWidth = 900 - chartMargin.left - chartMargin.right;
const chartHeight = 900 - chartMargin.top - chartMargin.bottom;

export default function LineChart() {
    const chartContainerRef = useRef(null);
    const hasChartBeenCreatedRef = useRef(false);

    useEffect(() => {
        // Function to fetch and parse data
        const fetchDataAndCreateChart = async () => {
            try {
                const data = await d3.json('data/XRP-USD.json');
                const parseDate = d3.timeParse('%Y-%m-%d');
                const xrp_data = data.map(({ Date, Close }) => ({
                    date: parseDate(Date),
                    close: +Close,
                }));

                if (!hasChartBeenCreatedRef.current) {
                    createChart(xrp_data);

                    hasChartBeenCreatedRef.current = true;
                }
            } catch (error) {
                console.error('Error fetching the data: ', error);
            }
        };

        // Function to create the chart
        const createChart = (xrp_data) => {
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
                const xScale = d3
                    .scaleTime()
                    .domain(d3.extent(xrp_data, (d) => d.date))
                    .range([0, chartWidth]);

                // Define the y-axis scale
                const yScale = d3
                    .scaleLinear()
                    .domain([0, d3.max(xrp_data, (d) => d.close)])
                    .range([chartHeight, 0]);

                // Draw the x-axis on the chart
                const xAxis = svgContainer
                    .append('g')
                    .attr('transform', `translate(0,${chartHeight})`)
                    .call(d3.axisBottom(xScale))
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
                    .call(d3.axisLeft(yScale))
                    .append('text')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', -50)
                    .attr('x', -chartHeight / 2)
                    .attr('fill', 'black') // Adjust label color to improve visibility
                    .style('text-anchor', 'middle')
                    .style('font-size', '16px')
                    .style('font-weight', 'bold')
                    .text('Volume');

                // Draw the line
                const line = d3
                    .line()
                    .x((d) => xScale(d.date))
                    .y((d) => yScale(d.close));

                svgContainer
                    .append('path')
                    .datum(xrp_data)
                    .attr('fill', 'none')
                    .attr('stroke', 'steelblue')
                    .attr('stroke-width', 2)
                    .attr('d', line);
            }
        };

        if (!hasChartBeenCreatedRef.current) {
            fetchDataAndCreateChart();
        }
    }, []); // Dependency array is empty to ensure effect runs only once
    return <div ref={chartContainerRef} className='bg-slate-800 rounded'></div>;
}
