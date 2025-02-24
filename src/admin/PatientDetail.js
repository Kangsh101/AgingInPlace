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

  // 진단명, 약물은 빈 배열로 시작
  const [diagnoses, setDiagnoses] = useState([]);
  const [medications, setMedications] = useState([]);
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

  // 진단명 추가
  const addDiagnosisField = () => {
    setDiagnoses(prev => [
      ...prev,
      { id: Date.now(), name: '' }
    ]);
  };

  // 약물 추가 (alarmTimes 배열을 초기화)
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

  // 진단명 제거
  const removeDiagnosis = (id) => {
    setDiagnoses(diagnoses.filter(d => d.id !== id));
  };

  // 약물 제거
  const removeMedication = (id) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  // 알람 시간 추가
  const addAlarmTime = (medIndex) => {
    setMedications(prev => {
      const updated = [...prev];
      const newAlarm = {
        id: Date.now(),
        hour: '',
        minute: '',
        second: ''
      };
      updated[medIndex].alarmTimes = [...updated[medIndex].alarmTimes, newAlarm];
      return updated;
    });
  };

  // 알람 시간 제거
  const removeAlarmTime = (medIndex, alarmId) => {
    setMedications(prev => {
      const updated = [...prev];
      updated[medIndex].alarmTimes = updated[medIndex].alarmTimes.filter(
        (alarm) => alarm.id !== alarmId
      );
      return updated;
    });
  };

  // 알람 시간 변경
  const handleAlarmTimeChange = (medIndex, alarmId, field, value) => {
    // 입력값을 문자열로 보관 (숫자 외의 입력은 차단하고 싶으면 별도 처리)
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

  /**
   * 1) 진단명 저장
   */
  const handleSaveDiagnoses = async () => {
    if (!enteredBy) {
      alert('로그인 정보를 확인할 수 없습니다.');
      return;
    }

    try {
      // 빈 문자열 제거
      const diagnosisNames = diagnoses
        .map(d => d.name.trim())
        .filter(name => name !== '');

      if (diagnosisNames.length === 0) {
        alert('추가할 진단명이 없습니다.');
        return;
      }

      await axios.post('/api/addDiagnosisByAdmin', {
        patientId: id,
        diagnoses: diagnosisNames,
        enteredBy,
      });

      alert('진단명이 성공적으로 저장되었습니다.');
      // 저장 후 리스트 페이지로 이동
      navigate(`/patient/${id}`);
    } catch (error) {
      console.error('진단명 저장 실패:', error);
      alert('진단명을 저장하는 데 실패했습니다.');
    }
  };

  /**
   * 2) 약물 저장
   */
  const handleSaveMedications = async () => {
    if (!enteredBy) {
      alert('로그인 정보를 확인할 수 없습니다.');
      return;
    }

    try {
      // --------------------
      // 1) 알람 시간 입력값 검증
      // --------------------
      for (const med of medications) {
        for (const alarm of med.alarmTimes) {
          const { hour, minute, second } = alarm;
          const isAllEmpty = (hour === '' && minute === '' && second === '');
          const isAllFilled = (hour !== '' && minute !== '' && second !== '');

          // 부분 입력 (예: hour만 입력하고 minute/second는 비어있는 경우)
          if (!isAllEmpty && !isAllFilled) {
            alert('시간을 모두 입력해주세요 (시, 분, 초를 전부 입력하거나 전부 비우세요).');
            return; // 저장 중단
          }

          // --- 범위 체크 ---
          if (isAllFilled) {
            // 숫자로 변환
            const h = parseInt(hour, 10);
            const m = parseInt(minute, 10);
            const s = parseInt(second, 10);

            // 시(hour)는 0~24
            if (h < 0 || h > 24) {
              alert('시(hour)는 0 이상 24 이하만 가능합니다.');
              return;
            }
            // 24시일 경우, 분/초는 반드시 0이어야 함 (24:00:00만 허용)
            if (h === 24 && (m !== 0 || s !== 0)) {
              alert('24시일 경우 분, 초는 0이어야 합니다. (예: 24:00:00)');
              return;
            }

            // 분, 초는 0~59
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

      // --------------------
      // 2) 실제로 저장할 데이터 가공
      // --------------------
      const medicationDetails = medications
        .filter(m => m.name.trim() !== '')
        .map(m => {
          // 시/분/초 모두 입력된 알람만 변환
          const validAlarms = m.alarmTimes.filter(alarm => {
            const filled = (alarm.hour !== '' && alarm.minute !== '' && alarm.second !== '');
            return filled;
          });

          // "HH:MM:SS" 배열로 만들기
          const alarmTimeArray = validAlarms.map(a => {
            // 여기서도 parseInt한 뒤, 한 자리 수라면 "0"을 붙여도 되고,
            // 그대로 문자열로 합쳐도 됩니다. (예: 8 -> "08")
            // 간단하게 padStart를 쓰면:
            const hh = a.hour.toString().padStart(2, '0');
            const mm = a.minute.toString().padStart(2, '0');
            const ss = a.second.toString().padStart(2, '0');
            return `${hh}:${mm}:${ss}`;
          });

          return {
            name: m.name.trim(),
            dosage: m.dosage.trim(),
            frequency: m.frequency.trim(),
            alarmTimes: alarmTimeArray,
          };
        });

      if (medicationDetails.length === 0) {
        alert('추가할 약물이 없습니다.');
        return;
      }

      // --------------------
      // 3) 서버에 POST
      // --------------------
      await axios.post('/api/addMedicationsByAdmin', {
        patientId: id,
        medications: medicationDetails,
        enteredBy,
      });

      alert('약물이 성공적으로 저장되었습니다.');
      navigate(`/patient/${id}`);
    } catch (error) {
      console.error('약물 저장 실패:', error);
      alert('약물을 저장하는 데 실패했습니다.');
    }
  };

  // 취소 버튼
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
                  placeholder="질환명 입력"
                  value={diagnosis.name}
                  onChange={(e) =>
                    setDiagnoses(diagnoses.map((d, idx) =>
                      idx === index ? { ...d, name: e.target.value } : d
                    ))
                  }
                />
                <button
                  className="X-Button"
                  onClick={() => removeDiagnosis(diagnosis.id)}
                >
                  X
                </button>
              </div>
            ))}
            <button className="button" onClick={addDiagnosisField}>
              + 진단명 추가
            </button>
            <button 
              className="button primary" 
              onClick={handleSaveDiagnoses}
              style={{ marginLeft: '10px' }}
            >
              진단명 저장
            </button>
          </div>

          {/* 약물 정보 입력 섹션 */}
          <div className="Cms-medication-container">
            <h3>복용 중인 약물</h3>

            {medications.map((medication, medIndex) => (
              <div 
                key={medication.id} 
                style={{
                  padding: '10px',
                  marginBottom: '20px'
                }}
              >
                {/* 약물 기본 정보: 한 줄로 배치 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>약명</span>
                  <input
                    style={{ width: '100px' }}
                    type="text"
                    value={medication.name}
                    placeholder="약명"
                    onChange={(e) =>
                      setMedications(meds => meds.map((m, idx) =>
                        idx === medIndex ? { ...m, name: e.target.value } : m
                      ))
                    }
                  />

                  <span>용량</span>
                  <input
                    style={{ width: '100px' }}
                    type="text"
                    value={medication.dosage}
                    placeholder="용량"
                    onChange={(e) =>
                      setMedications(meds => meds.map((m, idx) =>
                        idx === medIndex ? { ...m, dosage: e.target.value } : m
                      ))
                    }
                  />

                  <span>복용 횟수</span>
                  <input
                    style={{ width: '80px' }}
                    type="text"
                    value={medication.frequency}
                    placeholder="횟수"
                    onChange={(e) =>
                      setMedications(meds => meds.map((m, idx) =>
                        idx === medIndex ? { ...m, frequency: e.target.value } : m
                      ))
                    }
                  />

                  <button
                    className="X-Button"
                    onClick={() => removeMedication(medication.id)}
                    style={{ marginLeft: 'auto' }}
                  >
                    X
                  </button>
                </div>

                {/* 알람 시간: 바로 아래 배치 */}
                <div style={{ marginTop: '10px' }}>
                  <span>알람 시간</span>
                  <div style={{ marginTop: '5px' }}>
                    {medication.alarmTimes?.map((alarm, aIndex) => (
                      <div 
                        key={alarm.id} 
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          marginRight: '10px', 
                          marginBottom: '5px'
                        }}
                      >
                        <input
                          type="number"
                          placeholder="시"
                          min="0"
                          max="24"
                          value={alarm.hour}
                          onChange={(e) =>
                            handleAlarmTimeChange(medIndex, alarm.id, 'hour', e.target.value)
                          }
                          style={{ width: '50px' }}
                        />
                        <span>:</span>
                        <input
                          type="number"
                          placeholder="분"
                          min="0"
                          max="59"
                          value={alarm.minute}
                          onChange={(e) =>
                            handleAlarmTimeChange(medIndex, alarm.id, 'minute', e.target.value)
                          }
                          style={{ width: '50px', marginLeft: '5px' }}
                        />
                        <span>:</span>
                        <input
                          type="number"
                          placeholder="초"
                          min="0"
                          max="59"
                          value={alarm.second}
                          onChange={(e) =>
                            handleAlarmTimeChange(medIndex, alarm.id, 'second', e.target.value)
                          }
                          style={{ width: '50px', marginLeft: '5px' }}
                        />
                        <button
                          className="X-Button"
                          style={{ marginLeft: '5px' }}
                          onClick={() => removeAlarmTime(medIndex, alarm.id)}
                        >
                          X
                        </button>
                      </div>
                    ))}
                    <div>
                      <button 
                        className="button small" 
                        onClick={() => addAlarmTime(medIndex)}
                      >
                        + 알람 추가
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button className="button" onClick={addMedicationField}>
              + 약물 추가
            </button>
            <button 
              className="button primary" 
              onClick={handleSaveMedications}
              style={{ marginLeft: '10px' }}
            >
              약물 저장
            </button>
          </div>

          {/* 취소 버튼 */}
          <div className="saveBtt" style={{ marginTop: '20px' }}>
            <button className="button" onClick={handleCancel}>취소</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
