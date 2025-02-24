import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/Cms.css';
import '../css/Cmsuser.css';
import '../css/PatientDetail.css';
import '../css/PatientDiagnosisList.css';
import CmsSidebar from './CmsSidebar';
import axios from 'axios';
import CmsNavipanel from './CmsNavipanel';
import NotFound from '../component/NotFound'; 

const PatientDiagnosisList = ({ userRole }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);
  const [medications, setMedications] = useState([]);
  const [userRole2, setUserRole] = useState(null);

  const [editingMedId, setEditingMedId] = useState(null);
  const [editData, setEditData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    alarmTimes: []
  });

  useEffect(() => {
    fetch('/api/user/role', {
      method: 'GET',
      credentials: 'include'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('권한이 없습니다.');
        }
        return response.json();
      })
      .then((data) => {
        if (data.role === 'admin' || data.role === 'doctor') {
          setUserRole(data.role);
        } else {
          navigate('/notfound');
        }
      })
      .catch((error) => {
        console.error('API 호출 오류:', error);
        navigate('/notfound');
      });
  }, [navigate]);

  useEffect(() => {
    axios.get(`/api/patient/${id}`)
      .then(response => setPatient(response.data))
      .catch(error => console.error('Error fetching patient:', error));

    axios.get(`/api/patient/${id}/diagnoses`)
      .then(response => {
        if (Array.isArray(response.data)) {
          setDiagnoses(response.data);
        }
      })
      .catch(error => console.error('Error fetching diagnoses:', error));

    axios.get(`/api/patient/${id}/medications`)
      .then(response => {
        if (Array.isArray(response.data)) {
          const meds = response.data.map(med => {
            let alarmTimes = [];
            if (med.alarm_time) {
              try {
                alarmTimes = JSON.parse(med.alarm_time);
              } catch (e) {
                console.error('Error parsing alarm_time:', e);
              }
            }
            return { ...med, alarmTimes };
          });
          setMedications(meds);
        }
      })
      .catch(error => console.error('Error fetching medications:', error));
  }, [id, navigate]);

  const handleAddDiagnosis = () => {
    navigate(`/patient/${id}/add-diagnosis`);
  };

  const handleDeleteDiagnosis = async (diagnosisId) => {
    if (window.confirm('정말 이 진단명을 삭제하시겠습니까?')) {
      try {
        const response = await axios.delete(`/api/diagnoses/${diagnosisId}`);
        if (response.status === 200) {
          setDiagnoses(diagnoses.filter(d => d.id !== diagnosisId));
        }
      } catch (error) {
        console.error('Error deleting diagnosis:', error);
      }
    }
  };

  const handleDeleteMedication = async (medicationId) => {
    if (window.confirm('정말 이 약물 정보를 삭제하시겠습니까?')) {
      try {
        const response = await axios.delete(`/api/medications/${medicationId}`);
        if (response.status === 200) {
          setMedications(medications.filter(m => m.id !== medicationId));
        }
      } catch (error) {
        console.error('Error deleting medication:', error);
      }
    }
  };

  const handleEditMedication = (med) => {
    setEditingMedId(med.id);
    setEditData({
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,

      alarmTimes: med.alarmTimes.map(timeStr => {
        const [h, m, s] = timeStr.split(':');
        return { hour: h, minute: m, second: s };
      })
    });
  };

  const handleCancelEdit = () => {
    setEditingMedId(null);
    setEditData({ name: '', dosage: '', frequency: '', alarmTimes: [] });
  };

  const handleAddAlarmInEdit = () => {
    setEditData(prev => ({
      ...prev,
      alarmTimes: [...prev.alarmTimes, { hour: '', minute: '', second: '' }]
    }));
  };

  const handleChangeAlarm = (index, field, value) => {
    setEditData(prev => {
      const newAlarms = [...prev.alarmTimes];
      newAlarms[index] = { ...newAlarms[index], [field]: value };
      return { ...prev, alarmTimes: newAlarms };
    });
  };

  const handleRemoveAlarm = (index) => {
    setEditData(prev => {
      const newAlarms = [...prev.alarmTimes];
      newAlarms.splice(index, 1);
      return { ...prev, alarmTimes: newAlarms };
    });
  };

  const handleUpdateMedication = async (medId) => {
    for (let i = 0; i < editData.alarmTimes.length; i++) {
      const { hour, minute, second } = editData.alarmTimes[i];
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

    const validAlarms = editData.alarmTimes
      .filter(a => a.hour !== '' && a.minute !== '' && a.second !== '')
      .map(a => {
        const hh = a.hour.padStart(2, '0');
        const mm = a.minute.padStart(2, '0');
        const ss = a.second.padStart(2, '0');
        return `${hh}:${mm}:${ss}`;
      });

    try {
      await axios.put(`/api/medications/${medId}`, {
        name: editData.name,
        dosage: editData.dosage,
        frequency: editData.frequency,
        alarmTimes: validAlarms,
      });

      axios.get(`/api/patient/${id}/medications`)
        .then(response => {
          if (Array.isArray(response.data)) {
            const meds = response.data.map(med => {
              let alarmTimes = [];
              if (med.alarm_time) {
                try {
                  alarmTimes = JSON.parse(med.alarm_time);
                } catch (e) {
                  console.error('Error parsing alarm_time:', e);
                }
              }
              return { ...med, alarmTimes };
            });
            setMedications(meds);
          }
        })
        .catch(error => console.error('Error fetching medications:', error));

      alert('약물이 성공적으로 수정되었습니다.');
      handleCancelEdit();
    } catch (error) {
      console.error('Error updating medication:', error);
      alert('약물을 수정하는 데 실패했습니다.');
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!userRole2) {
    return null;
  }

  return (
    <div className="cms-container">
      <CmsSidebar userRole={userRole} />
      <CmsNavipanel userRole={userRole} />
      <div className="cms-main-content">
        <div className="Cmss-header">
          <header className='major' id='major-rest'>
            <h2>
              {patient 
                ? `${patient.name}의 진단 및 약물 정보` 
                : 'Loading...'
              }
            </h2>
          </header>
        </div>

        <div className="DiagnosisList-content">
          <div className="Cms-diagnosis-container enhanced-section">
            <h3 className="section-title">진단받은 질환</h3>
            <ul className="enhanced-list">
              {diagnoses.map((diagnosis) => (
                <li key={diagnosis.id} className="enhanced-list-item">
                  <span>{diagnosis.diagnosis}</span>
                  <button 
                    className='X-Button' 
                    onClick={() => handleDeleteDiagnosis(diagnosis.id)}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="Cms-medication-container enhanced-section">
            <h3 className="section-title">복용 중인 약물</h3>
            <ul className="enhanced-list">
              {medications.map((med) => {
                const isEditing = (editingMedId === med.id);

                return (
                  <li 
                    key={med.id} 
                    className="enhanced-list-item"
                    style={{
                      borderBottom: '1px solid #ccc',
                      padding: '10px 0'
                    }}
                  >
                    {!isEditing ? (
                      <div>
                        <span>
                          {med.name} (용량: {med.dosage}, 복용 횟수: {med.frequency})
                        </span>
                        {med.alarmTimes && med.alarmTimes.length > 0 && (
                          <div style={{ marginTop: '5px' }}>
                            <strong>알람 시간:</strong>
                            <ul>
                              {med.alarmTimes.map((timeStr, idx) => (
                                <li key={idx}>{timeStr}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div>
                          <button 
                            onClick={() => handleEditMedication(med)}
                            style={{ marginRight: '10px' }}
                          >
                            편집
                          </button>
                          <button 
                            className='X-Button' 
                            onClick={() => handleDeleteMedication(med.id)}
                          >
                            X
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ marginBottom: '8px' }}>
                          <label>약명: </label>
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          />
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <label>용량: </label>
                          <input
                            type="text"
                            value={editData.dosage}
                            onChange={(e) => setEditData({ ...editData, dosage: e.target.value })}
                          />
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <label>복용 횟수: </label>
                          <input
                            type="text"
                            value={editData.frequency}
                            onChange={(e) => setEditData({ ...editData, frequency: e.target.value })}
                          />
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                          <strong>알람 시간:</strong>
                          {editData.alarmTimes.map((alarm, idx) => (
                            <div 
                              key={idx} 
                              style={{ 
                                display: 'flex', 
                                gap: '5px', 
                                marginTop: '5px' 
                              }}
                            >
                              <input
                                type="number"
                                placeholder="시"
                                min="0"
                                max="24"
                                value={alarm.hour}
                                onChange={(e) => handleChangeAlarm(idx, 'hour', e.target.value)}
                                style={{ width: '50px' }}
                              />
                              :
                              <input
                                type="number"
                                placeholder="분"
                                min="0"
                                max="59"
                                value={alarm.minute}
                                onChange={(e) => handleChangeAlarm(idx, 'minute', e.target.value)}
                                style={{ width: '50px' }}
                              />
                              :
                              <input
                                type="number"
                                placeholder="초"
                                min="0"
                                max="59"
                                value={alarm.second}
                                onChange={(e) => handleChangeAlarm(idx, 'second', e.target.value)}
                                style={{ width: '50px' }}
                              />
                              <button
                                className='X-Button'
                                onClick={() => handleRemoveAlarm(idx)}
                              >
                                X
                              </button>
                            </div>
                          ))}
                          <button onClick={handleAddAlarmInEdit}>+ 알람 추가</button>
                        </div>

                        <div>
                          <button 
                            onClick={() => handleUpdateMedication(med.id)}
                            style={{ marginRight: '10px' }}
                          >
                            저장
                          </button>
                          <button onClick={handleCancelEdit}>취소</button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="button-container">
            <button 
              id='Diagnosis-addBtt' 
              className='button primary' 
              onClick={handleAddDiagnosis}
            >
              진단명 추가
            </button>
            <button className='button' onClick={handleCancel}>
              목록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDiagnosisList;
