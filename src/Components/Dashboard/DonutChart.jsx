import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { handleCompaniesEmployees, selectLessThan500CoNames, selectLessThan500Staff } from '../Slices/chartsSlice';
import ReactApexChart from "react-apexcharts";


const DonutChart = () => {
    const dispatch =  useDispatch();
    const lessThan500CoNames = useSelector(selectLessThan500CoNames);
    const lessThan500Staff = useSelector(selectLessThan500Staff);
    useEffect(()=>{
        const minmaxValues = {
            min: 150,
            max: 400
        }
        dispatch(handleCompaniesEmployees(minmaxValues));
    },[])

    const series = lessThan500Staff;
    const options = {
        labels: lessThan500CoNames,
        chart: {
            width: 400,
            height: 350,
            type: 'donut',
        },
        plotOptions: {
            pie: {
                startAngle: -90,
                endAngle: 270
            }
        },
        dataLabels: {
            enabled: true
        },
        fill: {
            type: 'gradient',
        },
        legend: {
            horizontalAlign: 'center', 
            fontFamily: 'iranSans',
            customLegendItems: lessThan500CoNames,
        },
        responsive: [
            {breakpoint: 1850,
                options: {
                    chart: {
                        width: 400
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            },
            {breakpoint: 1450,
                options: {
                    chart: {
                        width: 300
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            },
            {breakpoint: 1400,
                options: {
                    chart: {
                        width: 500
                    },
                    legend: {
                        position: 'right'
                    }
                }
            },
            {breakpoint: 550,
                options: {
                    chart: {
                        width: 400
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            },
            {breakpoint: 400,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        ]
    }

    return (
        <ReactApexChart className='bg-white p-3 shadow01 rounded d-flex justify-content-center align-items-center h-100' options={options} series={series} type="donut" width={500} height={320} />
    )
}

export default DonutChart;