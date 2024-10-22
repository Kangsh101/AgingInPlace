import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/PatientChart.css';

const PatientChart = () => {
  const [patientData, setPatientData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // const medicationData = [
  //   { medication_name: '약물 A', taken: true },
  //   { medication_name: '약물 B', taken: false },

  // ];

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
              return `${Math.min(Math.round(val), 100)}%`; 
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
              return `${Math.min(Math.round(val), 100)}%`; 
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

  const medicationOptions = (label) => ({
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
              return `${val ? '복용' : '미복용'}`;
            }
          },
        },
      },
    },
    labels: [label],
  });

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

  const sleepSeries = patientData.map((pd) => Math.min((pd.duration / sleepStandard) * 100, 100));
  const activitySeries = patientData.map((pd) => Math.min((pd.calActive / activityStandard) * 100, 100));
  
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
            {/* <div className="chart-row">
              {medicationData.map((med) => (
                <div key={med.medication_name} className="chart-item">
                  <ReactApexChart 
                    options={medicationOptions(med.medication_name)} 
                    series={[med.taken ? 100 : 0]} 
                    type="radialBar" 
                    height={350} 
                  />
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </article>
  );
};

export default PatientChart;
