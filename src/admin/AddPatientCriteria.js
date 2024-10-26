import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/Cms.css';
import '../css/Cmsuser.css';
import '../css/AddPatientCriteria.css';
import CmsSidebar from './CmsSidebar';
import CmsNavipanel from './CmsNavipanel';
import NotFound from '../component/NotFound'; 

const AddPatientCriteria = ({ userRole }) => {
  const { id } = useParams();
  const [sleepStartTime, setSleepStartTime] = useState('');
  const [sleepEndTime, setSleepEndTime] = useState('');
  const [exerciseAmount, setExerciseAmount] = useState('');
  const [patient, setPatient] = useState(null);
  const [savedCriteria, setSavedCriteria] = useState(null);
  const navigate = useNavigate();
  const [userRole2, setUserRole] = useState(null);

useEffect(() => {
    fetch('/api/user/role', {
      method: 'GET',
      credentials: 'include' // 세션 정보 포함
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('권한이 없습니다.');
        }
        return response.json();
      })
      .then((data) => {
        if (data.role === 'admin' || data.role === 'doctor') {
          setUserRole(data.role); // 권한이 admin 또는 doctor일 경우
        } else {
          navigate('/notfound'); // 권한이 없을 경우 접근 제한
        }
      })
      .catch((error) => {
        console.error('API 호출 오류:', error);
        navigate('/notfound'); // 오류 시 접근 제한
      });
  }, [navigate]);

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
    const roundedExerciseAmount = parseInt(exerciseAmount, 10);

    const criteria = {
      patient_id: id,
      sleep_startTime: sleepStartTime,
      sleep_endTime: sleepEndTime,
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
    <div className='cms-container'>
      <CmsSidebar userRole={userRole} />
      <CmsNavipanel userRole={userRole} />
      <div className="cms-main-content">
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
                  <label htmlFor="sleepStartTime">수면 시작 시간 (HH:MM):</label>
                  <input
                    type="time"
                    id="sleepStartTime"
                    value={sleepStartTime}
                    onChange={(e) => setSleepStartTime(e.target.value)}
                    placeholder="수면 시작 시간을 입력하세요"
                  />
                </div>
                <div className="criteria-item">
                  <label htmlFor="sleepEndTime">수면 종료 시간 (HH:MM):</label>
                  <input
                    type="time"
                    id="sleepEndTime"
                    value={sleepEndTime}
                    onChange={(e) => setSleepEndTime(e.target.value)}
                    placeholder="수면 종료 시간을 입력하세요"
                  />
                </div>
                <div className="criteria-item">
                  <label htmlFor="exerciseAmount">운동량 (칼로리):</label>
                  <input
                    type="number"
                    step="1"
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
                <p>수면 시작 시간 : {savedCriteria.sleep_startTime || '없음'}</p>
                <p>수면 종료 시간 : {savedCriteria.sleep_endTime || '없음'}</p>
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
