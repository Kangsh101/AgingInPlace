import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Chart = () => {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.post('/chart/steps', { username: 'Lee' });
        const response2 = await axios.post('/chart/calories', { username: 'Lee' });

        if (response1.data && Array.isArray(response1.data)) {
          const formattedData1 = response1.data.map(item => ({
            name: new Date(item['activity_data.create_date']).toLocaleDateString(),
            value: item['activity_data.activity_steps_total']
          }));
          setData1(formattedData1);
        }

        if (response2.data && Array.isArray(response2.data)) {
          const formattedData2 = response2.data.map(item => ({
            name: new Date(item['activity_data.create_date']).toLocaleDateString(),
            value: item['activity_data.activity_cal_total']
          }));
          setData2(formattedData2);
        }
      } catch (error) {
        console.error('데이터 가져오기 오류', error);
        setError('데이터 가져오는 중 오류가 발생했습니다.');
      }
    };
    fetchData();
  }, []);

  return (
    <div className='content-main'>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={Array.isArray(data1) ? data1 : []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={Array.isArray(data2) ? data2 : []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
