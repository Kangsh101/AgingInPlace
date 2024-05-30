import React, { useEffect, useState } from 'react';
import '../css/PatientData.css';

const PatientData = () => {
  const [patientData, setPatientData] = useState({
    exercise: [],
    sleep: [],
    medication: []
  });

  useEffect(() => {
    // API 요청으로 환자 데이터를 가져옴
    fetch('/api/patient-data')
      .then(response => response.json())
      .then(data => setPatientData(data));
  }, []);

  return (
    <div className="patient-data">
      <h1>환자 데이터</h1>
      <div className="data-section">
        <h2>운동량</h2>
        <ul>
          {patientData.exercise.map((session, index) => (
            <li key={index}>날짜: {session.date}, 시간: {session.duration}분</li>
          ))}
        </ul>
      </div>
      <div className="data-section">
        <h2>수면 시간</h2>
        <ul>
          {patientData.sleep.map((session, index) => (
            <li key={index}>날짜: {session.date}, 수면 시간: {session.duration}시간</li>
          ))}
        </ul>
      </div>
      <div className="data-section">
        <h2>약물 섭취</h2>
        <ul>
          {patientData.medication.map((dose, index) => (
            <li key={index}>날짜: {dose.date}, 약물: {dose.medication}, 용량: {dose.dosage}mg</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PatientData;
