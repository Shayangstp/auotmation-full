import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { handleCompaniesEmployees, selectMoreThan500CoNames, selectMoreThan500Staff } from '../Slices/chartsSlice';
import ReactApexChart from "react-apexcharts";

const LineChart = () => {
    const dispatch =  useDispatch();
    const moreThan500CoNames = useSelector(selectMoreThan500CoNames);
    const moreThan500Staff = useSelector(selectMoreThan500Staff);
    useEffect(()=>{
        const minmaxValues = {
            min: 400,
            max: 2000
        }
        dispatch(handleCompaniesEmployees(minmaxValues));
    },[])
    const series = [
        {
            name: "تعداد پرسنل",
            data: moreThan500Staff,
        }
    ]
    const options = {
        chart: {
            type: 'line',
            dropShadow: {
                enabled: true,
                color: '#000',
                top: 18,
                left: 7,
                blur: 10,
                opacity: 0.2
            },
            toolbar: {
                show: false
            },
        },
        colors: ['#77B6EA', '#545454'],
        dataLabels: {
            enabled: true,
        },
        stroke: {
            curve: 'smooth'
        },
        grid: {
            borderColor: '#e7e7e7',
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        markers: {
            size: 1
        },
        xaxis: {
            fontFamily: 'iranSans',
            categories: moreThan500CoNames,
            labels: {
                style: {
                    fontFamily: 'iranSans',
                },
            },
        },
        yaxis: {
            min: 31,
            max: 1300,
            labels: {
                offsetX: -30,
            },
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            floating: true,
            offsetY: -5,
            offsetX: -5,
        }
    }

    return (
        <ReactApexChart className='bg-white p-3 shadow01 rounded d-flex justify-content-center overflow-scroll' options={options} series={series} type="line" height={550}/>
    )
}

export default LineChart