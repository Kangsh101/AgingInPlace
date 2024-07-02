import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/PatientChart.css';

const PatientChart = () => {
  const [patientData, setPatientData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 기준 값 설정
  const sleepStandard = 35449.5;
  const activityStandard = 155.3;

  const sleepOptions = {
    chart: {
      height: 350,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '70%',
        },
        dataLabels: {
          name: {
            show: true,
            color: '#fff',
          },
          value: {
            show: true,
            color: '#fff',
            offsetY: 25,
            fontSize: '22px',
            formatter: function (val) {
              return `${Math.min(Math.round(val), 100)}%`; // 100% 초과하지 않도록 설정
            }
          },
        },
      },
    },
    labels: ['수면 시간'],
  };

  const activityOptions = {
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
            color: '#fff',
            offsetY: 70,
            fontSize: '22px',
            formatter: function (val) {
              return `${Math.min(Math.round(val), 100)}%`; // 100% 초과하지 않도록 설정
            }
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
    labels: ['운동량'],
  };

  const medicationOptions = {
    chart: {
      height: 350,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '70%',
        },
        dataLabels: {
          name: {
            show: true,
            color: '#fff',
          },
          value: {
            show: true,
            color: '#fff',
            offsetY: 25,
            fontSize: '22px',
            formatter: function (val) {
              return `${Math.min(Math.round(val), 100)}%`; // 100% 초과하지 않도록 설정
            }
          },
        },
      },
    },
    labels: ['약 섭취'],
  };

  useEffect(() => {
    const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    fetch(`http://localhost:5000/api/patient-data?date=${localDate}`, {
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched data:', data);
        setPatientData(data);
      })
      .catch((error) => console.error('Error fetching patient data:', error.message));
  }, [selectedDate]);

  // 기준 값을 사용하여 퍼센트로 변환하고 반올림하여 소수점 제거
  const sleepSeries = patientData.map((pd) => Math.min((pd.sleep_duration / sleepStandard) * 100, 100));
  const activitySeries = patientData.map((pd) => Math.min((pd.activity_cal_active / activityStandard) * 100, 100));
  const medicationSeries = patientData.map((pd) => Math.min(pd.medication_taken || 0, 100));

  return (
    <article id='main'>
      <div className='chart-main'>
        <div className='PatientChart-container'>
          <header className='major'>
            <h2 className='chart-title'>환자 데이터</h2>
          </header>
          <div className="chart-container">
            <div className="date-picker-container">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="yyyy-MM-dd"
              />
            </div>
            <div className="chart-row">
              <div className="chart-item">
                <ReactApexChart options={sleepOptions} series={sleepSeries} type="radialBar" height={350} />
              </div>
              <div className="chart-item">
                <ReactApexChart options={activityOptions} series={activitySeries} type="radialBar" height={350} />
              </div>
            </div>
            <div className="chart-row">
              <div className="chart-item">
                <ReactApexChart options={medicationOptions} series={medicationSeries} type="radialBar" height={350} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PatientChart;
