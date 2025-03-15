import React, { useState, useEffect } from 'react';
import '../css/AddDiagnosis.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddDiagnosis({ isGuardian = true, onCancel }) {
  const navigate = useNavigate();

  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState(null);
  const [userId, setUserId] = useState(null);

  const [diseases, setDiseases] = useState([]);
  const [medications, setMedications] = useState([]);

  useEffect(() => {
    axios.get('/api/getUserId')
      .then(response => {
        setUserId(response.data.userId);
      })
      .catch(error => {
        console.error('사용자 정보를 가져오는 데 실패했습니다.', error);
      });

    if (isGuardian) {
      axios.get('/api/getPatientInfo')
        .then(response => {
          setPatientName(response.data.patientName);
          setPatientId(response.data.patientId);
        })
        .catch(error => {
          console.error('환자 정보를 가져오는 데 실패했습니다.', error);
        });
    } else {
      axios.get('/api/getUserDetails')
        .then(response => {
          setPatientName(response.data.name);
          setPatientId(response.data.id);
        })
        .catch(error => {
          console.error('사용자 정보를 가져오는 데 실패했습니다.', error);
        });
    }
  }, [isGuardian]);

  // 질환 관련
  const addDiseaseField = () => {
    setDiseases(prev => [...prev, { id: Date.now(), name: '' }]);
  };
  const handleDiseaseChange = (index, value) => {
    setDiseases(prev =>
      prev.map((d, idx) => (idx === index ? { ...d, name: value } : d))
    );
  };
  const removeDisease = (diseaseId) => {
    setDiseases(prev => prev.filter(d => d.id !== diseaseId));
  };

  const handleSaveDiagnoses = async () => {
    if (!patientId || !userId) {
      alert('환자 정보나 사용자 정보를 확인할 수 없습니다.');
      return;
    }
    const diagnosisNames = diseases
      .map(d => d.name.trim())
      .filter(name => name !== '');
    if (diagnosisNames.length === 0) {
      alert('추가할 진단명이 없습니다.');
      return;
    }
    try {
      await axios.post('/api/addDiagnosisByAdmin', {
        patientId,
        diagnoses: diagnosisNames,
        enteredBy: userId,
      });
      alert('진단명이 성공적으로 저장되었습니다.');
      // 이전 페이지로 이동
      onCancel();
    } catch (error) {
      console.error('진단명을 저장하는 데 실패했습니다.', error);
      alert('진단명을 저장하는 데 실패했습니다.');
    }
  };

  // 약물 관련
  const addMedicationField = () => {
    setMedications(prev => [
      ...prev,
      {
        id: Date.now(),
        name: '',
        dosage: '',
        frequency: '',
        alarmTimes: [
          { id: Date.now(), hour: '', minute: '', second: '' }
        ]
      }
    ]);
  };
  const removeMedication = (medId) => {
    setMedications(prev => prev.filter(m => m.id !== medId));
  };
  const handleMedicationChange = (medIndex, field, value) => {
    setMedications(prev => {
      const updated = [...prev];
      updated[medIndex] = { ...updated[medIndex], [field]: value };
      return updated;
    });
  };
  const addAlarmTime = (medIndex) => {
    setMedications(prev => {
      const updated = [...prev];
      updated[medIndex].alarmTimes.push({
        id: Date.now(),
        hour: '',
        minute: '',
        second: ''
      });
      return updated;
    });
  };
  const removeAlarmTime = (medIndex, alarmId) => {
    setMedications(prev => {
      const updated = [...prev];
      updated[medIndex].alarmTimes = updated[medIndex].alarmTimes.filter(
        (alarm) => alarm.id !== alarmId
      );
      return updated;
    });
  };
  const handleAlarmTimeChange = (medIndex, alarmId, field, value) => {
    setMedications(prev => {
      const updated = [...prev];
      updated[medIndex].alarmTimes = updated[medIndex].alarmTimes.map(alarm => {
        if (alarm.id === alarmId) {
          return { ...alarm, [field]: value };
        }
        return alarm;
      });
      return updated;
    });
  };

  const handleSaveMedications = async () => {
    if (!patientId || !userId) {
      alert('환자 정보나 사용자 정보를 확인할 수 없습니다.');
      return;
    }

    try {
      for (const med of medications) {
        if (!med.name.trim() || !med.dosage.trim() || !med.frequency.trim()) {
          alert('약물 정보를 모두 입력해주세요 (약명, 용량, 횟수).');
          return;
        }
        for (const alarm of med.alarmTimes) {
          const { hour, minute, second } = alarm;
          const isAllEmpty = (hour === '' && minute === '' && second === '');
          const isAllFilled = (hour !== '' && minute !== '' && second !== '');
          if (!isAllEmpty && !isAllFilled) {
            alert('알람 시간을 모두 입력하거나 모두 비워주세요.');
            return;
          }
          if (isAllFilled) {
            const h = parseInt(hour, 10);
            const m = parseInt(minute, 10);
            const s = parseInt(second, 10);
            if (h < 0 || h > 24) {
              alert('시(hour)는 0 이상 24 이하만 가능합니다.');
              return;
            }
            if (h === 24 && (m !== 0 || s !== 0)) {
              alert('24시일 경우 분, 초는 0이어야 합니다. (예: 24:00:00)');
              return;
            }
            if (m < 0 || m > 59) {
              alert('분(minute)는 0 이상 59 이하만 가능합니다.');
              return;
            }
            if (s < 0 || s > 59) {
              alert('초(second)는 0 이상 59 이하만 가능합니다.');
              return;
            }
          }
        }
      }

      const medicationDetails = medications.map(m => {
        const validAlarms = m.alarmTimes.filter(a => 
          a.hour !== '' && a.minute !== '' && a.second !== ''
        );
        const alarmTimeArray = validAlarms.map(a => {
          const hh = a.hour.padStart(2, '0');
          const mm = a.minute.padStart(2, '0');
          const ss = a.second.padStart(2, '0');
          return `${hh}:${mm}:${ss}`;
        });

        return {
          name: m.name.trim(),
          dosage: m.dosage.trim(),
          frequency: m.frequency.trim(),
          alarmTimes: alarmTimeArray
        };
      });

      await axios.post('/api/addMedicationsByAdmin', {
        patientId,
        medications: medicationDetails,
        enteredBy: userId
      });

      alert('약물이 성공적으로 저장되었습니다.');
      // 이전 페이지로 이동
      onCancel();
    } catch (error) {
      console.error('약물을 저장하는 데 실패했습니다.', error);
      alert('약물을 저장하는 데 실패했습니다.');
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className='diagnosis-container'>
      <div className='diagnosis-title'>
        <strong>진단명 및 약물 추가</strong>
      </div>

      <div className='patient-div'>
        <span className='patient-name'>
          <span id='patientNaem'>환자 성함 : </span> {patientName}
        </span>
      </div>

      {/* 질환 입력 섹션 */}
      <div className='diagnosis-box' style={{ marginBottom: '20px', width: '400px'}}>
        <h4>진단받은 질환</h4>
        {diseases.map((disease, index) => (
          <div key={disease.id} style={{ marginBottom: '8px' }}>
            <input
              type="text"
              placeholder="질환명 입력"
              value={disease.name}
              onChange={(e) => handleDiseaseChange(index, e.target.value)}
              style={{ width: '16em' }}
            />
            <button
              className='X-Button'
              style={{ marginLeft: '8px' }}
              onClick={() => removeDisease(disease.id)}
            >
              X
            </button>
          </div>
        ))}
        <button
          className='button small'
          onClick={addDiseaseField}
          style={{ marginRight: '10px' }}
        >
          + 질환 추가
        </button>
        <button
          className='button primary'
          onClick={handleSaveDiagnoses}
        >
          진단명 저장
        </button>
      </div>

      {/* 약물 입력 섹션 */}
      <div className='diagnosis-box' style={{width: '400px'}}>
        <h4>복용 중인 약물</h4>
        {medications.map((med, medIndex) => (
          <div
            key={med.id}
            style={{
              borderBottom: '1px solid #ccc',
              paddingBottom: '10px',
              marginBottom: '10px'
            }}
          >
            <div style={{ marginBottom: '5px' }}>
              <label>약명: </label>
              <input
                type="text"
                style={{ width: '16em' }}
                value={med.name}
                onChange={(e) => handleMedicationChange(medIndex, 'name', e.target.value)}
              />
              <label style={{ marginLeft: '10px' }}>용량: </label>
              <input
                type="text"
                style={{ width: '16em' }}
                value={med.dosage}
                onChange={(e) => handleMedicationChange(medIndex, 'dosage', e.target.value)}
              />
              <label style={{ marginLeft: '10px' }}>횟수: </label>
              <input
                type="text"
                style={{ width: '16em' }}
                value={med.frequency}
                onChange={(e) => handleMedicationChange(medIndex, 'frequency', e.target.value)}
              />
              <button
                className='X-Button'
                style={{ marginLeft: '10px' }}
                onClick={() => removeMedication(med.id)}
              >
                X
              </button>
            </div>

            <div>
              <strong>알람 시간</strong>
              {med.alarmTimes.map((alarm, aIndex) => (
                <div key={alarm.id} style={{ display: 'flex', alignItems: 'center', marginTop: '5px' ,marginbottom:'5px'}}>
                  <input
                    type="number"
                    placeholder="시"
                    min="0"
                    max="24"
                    value={alarm.hour}
                    onChange={(e) => handleAlarmTimeChange(medIndex, alarm.id, 'hour', e.target.value)}
                    style={{ width: '70px', border: '1px solid' }}
                  /> : 
                  <input
                    type="number"
                    placeholder="분"
                    min="0"
                    max="59"
                    value={alarm.minute}
                    onChange={(e) => handleAlarmTimeChange(medIndex, alarm.id, 'minute', e.target.value)}
                    style={{width: '70px', border: '1px solid',marginLeft: '5px' }}
                  /> : 
                  <input
                    type="number"
                    placeholder="초"
                    min="0"
                    max="59"
                    value={alarm.second}
                    onChange={(e) => handleAlarmTimeChange(medIndex, alarm.id, 'second', e.target.value)}
                    style={{ width: '70px', border: '1px solid',marginLeft: '5px' }}
                  />
                  <button
                    className='X-Button'
                    style={{ marginLeft: '8px' }}
                    onClick={() => removeAlarmTime(medIndex, alarm.id)}
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                className='button small'
                style={{ marginTop: '5px' }}
                onClick={() => addAlarmTime(medIndex)}
              >
                + 알람 추가
              </button>
            </div>
          </div>
        ))}

        <button
          className='button'
          onClick={addMedicationField}
          style={{ marginRight: '10px' }}
        >
          + 약물 추가
        </button>
        <button
          className='button primary'
          onClick={handleSaveMedications}
        >
          약물 저장
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button
          className='button'
          onClick={handleCancel}
        >
          취소
        </button>
      </div>
    </div>
  );
}

export default AddDiagnosis;
