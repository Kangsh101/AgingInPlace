import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import '../css/PatientChart.css';
import Footer from './Footer';

const PatientChart = () => {
  const [patientData, setPatientData] = useState(null);
  const [volatilitySeries, setVolatilitySeries] = useState([67]);
  const [donutSeries, setDonutSeries] = useState([44, 55, 13, 33]);

  const patientOptions = {
    chart: {
      height: 350,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '70%',
        },
      },
    },
    labels: ['수면 시간'],
  };

  const volatilityOptions = {
    chart: {
      height: 350,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 15,
          size: '70%',
          image: '/images/sicla.png',
          imageWidth: 64,
          imageHeight: 64,
          imageClipped: false,
        },
        dataLabels: {
          name: {
            show: false,
            color: '#fff',
          },
          value: {
            show: true,
            color: '#333',
            offsetY: 70,
            fontSize: '22px',
          },
        },
      },
    },
    fill: {
      type: 'image',
      image: {
        src: ['/images/chartgas.jpg'],
      },
    },
    stroke: {
      lineCap: 'round',
    },
    labels: ['Volatility'],
  };

  const donutOptions = {
    chart: {
      width: 380,
      type: 'donut',
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
    legend: {
      position: 'right',
      offsetY: 0,
      height: 230,
    },
  };

  useEffect(() => {
    fetch('/api/patient-data')
      .then((response) => response.json())
      .then((data) => {
        setPatientData(data);
      })
      .catch((error) => console.error('Error fetching patient data:', error));
  }, []);

  const patientSeries = patientData ? [patientData.value] : [0];

  return (
    <>
      <div className="chart-container">
        <div className="chart-row">
          <div className="chart-item">
            <ReactApexChart options={patientOptions} series={patientSeries} type="radialBar" height={350} />
          </div>
          <div className="chart-item">
            <ReactApexChart options={volatilityOptions} series={volatilitySeries} type="radialBar" height={350} />
          </div>
        </div>
        <div className="chart-row">
          <div className="chart-item">
            <div className="chart-wrap">
              <ReactApexChart options={donutOptions} series={donutSeries} type="donut" width={380} />
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default PatientChart;
