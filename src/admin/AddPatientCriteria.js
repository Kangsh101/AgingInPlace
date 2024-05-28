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

  useEffect(() => {
    fetch(`/api/patient/${id}`)
      .then(response => response.json())
      .then(data => setPatient(data))
      .catch(error => console.error('Error fetching patient:', error));
  }, [id]);

  const handleSave = () => {
    console.log('Sleep Time:', sleepTime);
    console.log('Exercise Amount:', exerciseAmount);
    // Add logic to save sleepTime and exerciseAmount for the patient
  };

  return (
    <div className='Cms-AddPatientCriteria'>
    <CmsSidebar/>
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
                    <label htmlFor="sleepTime">수면 시간 (시간):</label>
                    <input
                    type="number"
                    id="sleepTime"
                    value={sleepTime}
                    onChange={(e) => setSleepTime(e.target.value)}
                    placeholder="수면 시간을 입력하세요"
                    />
                </div>
                <div className="criteria-item">
                    <label htmlFor="exerciseAmount">운동량 (분):</label>
                    <input
                    type="number"
                    id="exerciseAmount"
                    value={exerciseAmount}
                    onChange={(e) => setExerciseAmount(e.target.value)}
                    placeholder="운동량을 입력하세요"
                    />
                </div>
                <button className="button primary" onClick={handleSave}>저장</button>
                </div>
            )}
            </div>
        </div>
        </div>
    </div>
  );
};

export default AddPatientCriteria;
