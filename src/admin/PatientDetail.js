import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/Cms.css';
import '../css/Cmsuser.css';
import '../css/PatientDetail.css';
import CmsSidebar from './CmsSidebar';
import axios from 'axios';
import CmsNavipanel from './CmsNavipanel';

const PatientDetail = ({ userRole }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diagnoses, setDiagnoses] = useState([{ id: Date.now(), name: '' }]);
  const [medications, setMedications] = useState([{
    id: Date.now(),
    name: '',
    dosage: '',
    frequency: '',
    alarmTime: { hour: '', minute: '', second: '' }
  }]);
  const [enteredBy, setEnteredBy] = useState(null);

  useEffect(() => {
    if (userRole !== 'admin' && userRole !== 'doctor') {
      navigate('/notfound');
    }
  }, [userRole, navigate]);

  useEffect(() => {
    axios.get('/api/currentUser')
      .then(response => setEnteredBy(response.data.userId))
      .catch(error => console.error('Error fetching current user:', error));
  }, []);

  const removeDiagnosis = (id) => {
    setDiagnoses(diagnoses.filter(diagnosis => diagnosis.id !== id));
  };

  const removeMedication = (id) => {
    setMedications(medications.filter(medication => medication.id !== id));
  };

  const handleAlarmTimeChange = (index, field, value) => {
    const updated = medications.map((med, idx) => {
      if (idx === index) {
        return { ...med, alarmTime: { ...med.alarmTime, [field]: value } };
      }
      return med;
    });
    setMedications(updated);
  };

  const handleSaveAll = async () => {
    if (!enteredBy) {
      alert('로그인 정보를 확인할 수 없습니다.');
      return;
    }

    try {
      const diagnosisNames = diagnoses.map(diagnosis => diagnosis.name);
      const medicationDetails = medications.map(medication => ({
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
        alarmTime: `${medication.alarmTime.hour}:${medication.alarmTime.minute}:${medication.alarmTime.second}`
      }));

      await axios.post('/api/addDiagnosisByAdmin', {
        patientId: id,
        diagnoses: diagnosisNames,
        enteredBy,
      });

      await axios.post('/api/addMedicationsByAdmin', {
        patientId: id,
        medications: medicationDetails,
        enteredBy,
      });

      alert('모든 정보가 성공적으로 저장되었습니다.');
      navigate(`/patient/${id}`);
    } catch (error) {
      console.error('정보를 저장하는 데 실패했습니다.', error);
      alert('정보를 저장하는 데 실패했습니다.');
    }
  };

  const handleCancel = () => {
    navigate(`/cmsadddiagnosis`);
  };

  return (
    <div className="cms-container">
      <CmsSidebar userRole={userRole} />
      <CmsNavipanel userRole={userRole} />
      <div className="cms-main-content">
        <div className="Cmss-header">
          <header className="major">
            <h2>진단명 및 약물 정보 추가</h2>
          </header>
        </div>
        <div className="Cmss-content" id="CmsAdd-container">
          
          {/* 진단명 입력 섹션 */}
          <div className="Cms-diagnosis-container">
            <h3>진단받은 질환</h3>
            {diagnoses.map((diagnosis, index) => (
              <div key={diagnosis.id} className="diagnosis-item">
                <input
                  id="Patient-input"
                  type="text"
                  value={diagnosis.name}
                  placeholder="질환명 입력"
                  onChange={(e) =>
                    setDiagnoses(
                      diagnoses.map((d, idx) =>
                        idx === index ? { ...d, name: e.target.value } : d
                      )
                    )
                  }
                />
                {/* <button className="X-Button" onClick={() => removeDiagnosis(diagnosis.id)}>X</button> */}
              </div>
            ))}
          </div>

          {/* 약물 정보 입력 섹션 */}
          <div className="Cms-medication-container">
            <h3>복용 중인 약물</h3>
            {medications.map((medication, index) => (
              <div key={medication.id} className="medication-item">
                <input
                  id='medica-css'
                  type="text"
                  value={medication.name}
                  placeholder="약명"
                  onChange={(e) =>
                    setMedications(
                      medications.map((m, idx) =>
                        idx === index ? { ...m, name: e.target.value } : m
                      )
                    )
                  }
                />
                <input
                 id='medica-css'
                  type="text"
                  value={medication.dosage}
                  placeholder="용량"
                  onChange={(e) =>
                    setMedications(
                      medications.map((m, idx) =>
                        idx === index ? { ...m, dosage: e.target.value } : m
                      )
                    )
                  }
                />
                <input
                 id='medica-css'
                  type="text"
                  value={medication.frequency}
                  placeholder="복용 횟수"
                  onChange={(e) =>
                    setMedications(
                      medications.map((m, idx) =>
                        idx === index ? { ...m, frequency: e.target.value } : m
                      )
                    )
                  }
                />
                {/* <button className="X-Button" onClick={() => removeMedication(medication.id)}>X</button> */}
              </div>
            ))}
          </div>

          {/* 알람 시간 입력 섹션 */}
          <div className="Cms-alarm-container">
            <h3>알람 시간 설정</h3>
            {medications.map((medication, index) => (
              <div key={index} className="alarm-time-inputs">
                <input
                  type="number"
                  placeholder="시"
                  min="0"
                  max="23"
                  value={medication.alarmTime.hour}
                  onChange={(e) =>
                    handleAlarmTimeChange(index, 'hour', e.target.value)
                  } 
                /> : 
                <input
                  type="number"
                  placeholder="분"
                  min="0"
                  max="59"
                  value={medication.alarmTime.minute}
                  onChange={(e) =>
                    handleAlarmTimeChange(index, 'minute', e.target.value)
                  }
                /> : 
                <input
                  type="number"
                  placeholder="초"
                  min="0"
                  max="59"
                  value={medication.alarmTime.second}
                  onChange={(e) =>
                    handleAlarmTimeChange(index, 'second', e.target.value)
                  }
                />
              </div>
            ))}
          </div>

          {/* 저장 및 취소 버튼 */}
          <div className="saveBtt">
            <button className="button primary" onClick={handleSaveAll}>저장</button>
            <button className="button" onClick={handleCancel}>취소</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;