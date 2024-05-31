import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/Cms.css';
import '../css/Cmsuser.css';
import '../css/AddPatientCriteria.css';
import CmsSidebar from './CmsSidebar';

const AddPatientCriteria = () => {
  const { id } = useParams();
  const [sleepTime, setSleepTime] = useState('');
  const [exerciseAmount, setExerciseAmount] = useState('');
  const [patient, setPatient] = useState(null);
  const [savedCriteria, setSavedCriteria] = useState(null);

  useEffect(() => {
    fetch(`/api/patient/${id}`)
      .then(response => response.json())
      .then(data => setPatient(data))
      .catch(error => console.error('Error fetching patient:', error));

    fetch(`/api/patientcriteria/${id}`)
      .then(response => response.json())
      .then(data => setSavedCriteria(data))
      .catch(error => console.error('Error fetching patient criteria:', error));
  }, [id]);

  const handleSave = () => {
    const roundedExerciseAmount = parseFloat(exerciseAmount).toFixed(1);

    const criteria = {
      patient_id: id,
      sleep_time: sleepTime,
      exercise_amount: roundedExerciseAmount,
      added_date: new Date().toISOString()
    };

    fetch('/api/patientcriteria', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(criteria),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error saving patient criteria');
      }
      return response.json();
    })
    .then(data => {
      if (data.message === 'Patient criteria updated successfully') {
        alert('수정되었습니다.');
      } else {
        alert('저장되었습니다.');
      }
      fetch(`/api/patientcriteria/${id}`)
        .then(response => response.json())
        .then(data => setSavedCriteria(data))
        .catch(error => console.error('Error fetching patient criteria:', error));
    })
    .catch(error => {
      console.error('Error saving patient criteria:', error);
    });
  };

  return (
    <div className='Cms-AddPatientCriteria'>
      <CmsSidebar />
      <div className="cms-container">
        <div className="cms-AddPatient-content">
          <div className="Cmss-header">
            <header className='major' id='major-rest'>
              <h2>{patient ? `${patient.name}의 수면 시간 및 운동량 기준 설정` : 'Loading...'}</h2>
            </header>
          </div>
          <div className="Cmss-content">
            {patient && (
              <div className="criteria-container">
                <div className="criteria-item">
                  <label htmlFor="sleepTime">수면 시간 (HH:MM):</label>
                  <input
                    type="time"
                    id="sleepTime"
                    value={sleepTime}
                    onChange={(e) => setSleepTime(e.target.value)}
                    placeholder="수면 시간을 입력하세요"
                  />
                </div>
                <div className="criteria-item">
                  <label htmlFor="exerciseAmount">운동량 (칼로리):</label>
                  <input
                    type="number"
                    step="0.1"
                    id="exerciseAmount"
                    value={exerciseAmount}
                    onChange={(e) => setExerciseAmount(e.target.value)}
                    placeholder="운동량을 입력하세요"
                  />
                </div>
                <button className="button primary" onClick={handleSave}>저장</button>
              </div>
            )}
            {savedCriteria && (
              <div className="saved-criteria">
                <h3>저장된 환자 데이터 :</h3>
                <p>수면 시간 : {savedCriteria.sleep_time || '없음'}</p>
                <p>운동량(칼로리) : {savedCriteria.exercise_amount || '없음'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPatientCriteria;
