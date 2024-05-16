import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format, subDays, isAfter } from 'date-fns';
import '../css/ChartComponent.css'; // 추가된 CSS 파일

// Chart.js 모듈을 등록합니다.
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartComponent = () => {
  const [calorieData, setCalorieData] = useState(null);
  const [stepsData, setStepsData] = useState(null);
  const [sleepData, setSleepData] = useState(null);
  const [remData, setRemData] = useState(null);

  useEffect(() => {
    fetchCalorieData();
    fetchStepsData();
    fetchSleepData();
    fetchRemData();
  }, []);

  const fetchCalorieData = async () => {
    try {
      const response = await axios.post('/chart/calories', { username: 'Lee' });
      const activityData = response.data;

      const chartData = {
        labels: activityData.map(item => format(new Date(item['activity_data.create_date'] * 1000), 'yyyy-MM-dd')),
        datasets: [
          {
            label: 'Calories Burned',
            data: activityData.map(item => item['activity_data.activity_cal_total']),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      };

      setCalorieData(chartData);
    } catch (error) {
      console.error('Error fetching calorie data:', error);
    }
  };

  const fetchStepsData = async () => {
    try {
      const response = await axios.post('/chart/steps', { username: 'Lee' });
      const activityData = response.data;

      const chartData = {
        labels: activityData.map(item => format(new Date(item['activity_data.create_date'] * 1000), 'yyyy-MM-dd')),
        datasets: [
          {
            label: 'Steps',
            data: activityData.map(item => item['activity_data.activity_steps']),
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          }
        ]
      };

      setStepsData(chartData);
    } catch (error) {
      console.error('Error fetching steps data:', error);
    }
  };

  const fetchSleepData = async () => {
    try {
      const response = await axios.post('/chart/sleep_duration', { username: 'ChartTest2' });
      const sleepData = response.data;

      const sevenDaysAgo = subDays(new Date(), 7);

      const filteredData = sleepData.filter(item =>
        isAfter(new Date(item['sleep_data.create_date'] * 1000), sevenDaysAgo)
      );

      const chartData = {
        labels: filteredData.map(item => format(new Date(item['sleep_data.create_date'] * 1000), 'yyyy-MM-dd')),
        datasets: [
          {
            label: 'Sleep Total',
            data: filteredData.map(item => item['sleep_data.sleep_duration']),
            backgroundColor: 'rgba(255, 159, 64, 0.6)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1
          }
        ]
      };

      setSleepData(chartData);
    } catch (error) {
      console.error('Error fetching sleep data:', error);
    }
  };

  const fetchRemData = async () => {
    try {
      const response = await axios.post('/chart/rem', { username: 'ChartTest2' });
      const sleepData = response.data;

      const sevenDaysAgo = subDays(new Date(), 7);

      const filteredData = sleepData.filter(item =>
        isAfter(new Date(item['sleep_data.create_date'] * 1000), sevenDaysAgo)
      );

      const chartData = {
        labels: filteredData.map(item => format(new Date(item['sleep_data.create_date'] * 1000), 'yyyy-MM-dd')),
        datasets: [
          {
            label: 'REM Sleep',
            data: filteredData.map(item => item['sleep_data.sleep_rem']),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      };

      setRemData(chartData);
    } catch (error) {
      console.error('Error fetching REM sleep data:', error);
    }
  };

  const chartOptions = {
    aspectRatio: 2,
    plugins: {
      legend: {
        labels: {
          color: 'white'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'white',
          maxRotation: 45,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10
        }
      },
      y: {
        ticks: {
          color: 'white'
        }
      }
    },
    background: {
      color: 'transparent'
    }
  };
  return (
    <div className='content-main'>
      <div className='charts-wrapper'>
        <div className='chart-container'>
          <h2>일일 칼로리 소모량</h2>
          {calorieData && <Bar data={calorieData} options={chartOptions} />}
        </div>
        <div className='chart-container'>
          <h2>일일 걸음 수</h2>
          {stepsData && <Bar data={stepsData} options={chartOptions} />}
        </div>
        <div className='chart-container'>
          <h2>수면</h2>
          {sleepData && <Bar data={sleepData} options={chartOptions} />}
        </div>
        <div className='chart-container'>
          <h2>램 수면</h2>
          {remData && <Bar data={remData} options={chartOptions} />}
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
