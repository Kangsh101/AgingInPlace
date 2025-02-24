import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/DiagnosisList.css';

function DiagnosisList({ onAddClick }) {
  const [userDetails, setUserDetails] = useState({ role: '', name: '', patientId: null });
  const [patientDetails, setPatientDetails] = useState({ patientName: '', diagnoses: [], medications: [] });
  
  const [editingDiagnosisId, setEditingDiagnosisId] = useState(null);
  const [editDiagnosisData, setEditDiagnosisData] = useState('');

  const [editingMedicationId, setEditingMedicationId] = useState(null);
  const [medicationEditData, setMedicationEditData] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    alarm_time: [] // [{ hour, minute, second }, ...]
  });

  useEffect(() => {
    axios.get('/api/getUserDetails')
      .then(response => {
        if (response.data) {
          setUserDetails(response.data);
          const patientId = response.data.role === '보호자'
            ? response.data.patientId
            : response.data.id;
          
          axios.get(`/api/getPatientDetails?patientId=${patientId}`)
            .then(res => {
              if (res.data) {
                setPatientDetails(res.data);
              } else {
                console.error('Invalid data format');
                setPatientDetails({ patientName: '', diagnoses: [], medications: [] });
              }
            })
            .catch(error => {
              console.error('환자 정보를 가져오는 데 실패했습니다.', error);
              setPatientDetails({ patientName: '', diagnoses: [], medications: [] });
            });
        } else {
          console.error('Invalid user data format');
          setUserDetails({ role: '', name: '', patientId: null });
        }
      })
      .catch(error => {
        console.error('사용자 정보를 가져오는 데 실패했습니다.', error);
        setUserDetails({ role: '', name: '', patientId: null });
      });
  }, []);

  /* ------------------------------
   * 1) 진단 관련
   * ------------------------------ */
  const handleDeleteDiagnosis = (index) => {
    if (!window.confirm('정말 이 진단명을 삭제하시겠습니까?')) return;
    const diagnosisId = patientDetails.diagnoses[index].id;
    const updated = patientDetails.diagnoses.filter((_, i) => i !== index);
    setPatientDetails({ ...patientDetails, diagnoses: updated });

    axios.delete(`/api/deleteDiagnosis`, { data: { diagnosisId } })
      .then(response => console.log(response.data.message))
      .catch(error => console.error('진단명 삭제 실패:', error));
  };

  const handleEditDiagnosis = (id, currentName) => {
    setEditingDiagnosisId(id);
    setEditDiagnosisData(currentName);
  };

  const handleSaveDiagnosis = (id, index) => {
    if (!window.confirm('진단명을 수정하시겠습니까?')) {
      return; // 사용자가 취소하면 중단
    }
    axios.put(`/api/diagnoses/${id}`, { 
      diagnosisId: id, 
      name: editDiagnosisData 
    })
    .then(response => {
      const updated = [...patientDetails.diagnoses];
      updated[index] = { ...updated[index], name: editDiagnosisData };
      setPatientDetails({ ...patientDetails, diagnoses: updated });
      setEditingDiagnosisId(null);
      setEditDiagnosisData('');

      alert('진단명이 수정되었습니다.');
    })
    .catch(error => {
      console.error('진단명 수정 실패:', error);
      alert('진단명 수정 실패');
    });
  };

  const handleCancelEditDiagnosis = () => {
    setEditingDiagnosisId(null);
    setEditDiagnosisData('');
  };

  /* ------------------------------
   * 2) 약물 관련
   * ------------------------------ */
  const handleDeleteMedication = (index) => {
    if (!window.confirm('정말 이 약물을 삭제하시겠습니까?')) return;
    const medicationId = patientDetails.medications[index].id;
    if (!medicationId) return console.error('약물 ID 없음');

    const updated = patientDetails.medications.filter((_, i) => i !== index);
    setPatientDetails({ ...patientDetails, medications: updated });

    axios.delete(`/api/deleteMedication`, { data: { medicationId } })
      .then(res => console.log(res.data.message))
      .catch(err => console.error('약물 삭제 실패:', err));
  };

  const handleEditMedication = (id, medData) => {
    let alarmArray = [];
    // alarm_time이 이미 배열이라면
    if (Array.isArray(medData.alarm_time)) {
      alarmArray = medData.alarm_time.map(str => {
        const [h, m, s] = str.split(':');
        return { hour: h, minute: m, second: s };
      });
    } else if (typeof medData.alarm_time === 'string' && medData.alarm_time.trim() !== '') {
      // JSON parse가 필요한 경우
      try {
        const parsed = JSON.parse(medData.alarm_time);
        if (Array.isArray(parsed)) {
          alarmArray = parsed.map(str => {
            const [h, m, s] = str.split(':');
            return { hour: h, minute: m, second: s };
          });
        }
      } catch (e) {
        console.error('alarm_time 파싱 오류:', e);
      }
    }

    setEditingMedicationId(id);
    setMedicationEditData({
      medication: medData.medication,
      dosage: medData.dosage,
      frequency: medData.frequency,
      alarm_time: alarmArray
    });
  };

  // 알람 입력 변경
  const handleAlarmChange = (idx, field, value) => {
    const newAlarms = medicationEditData.alarm_time.map((a, i) => {
      if (i === idx) return { ...a, [field]: value };
      return a;
    });
    setMedicationEditData({ ...medicationEditData, alarm_time: newAlarms });
  };

  const handleAddAlarm = () => {
    setMedicationEditData({
      ...medicationEditData,
      alarm_time: [...medicationEditData.alarm_time, { hour: '', minute: '', second: '' }]
    });
  };

  const handleSaveMedication = (id, index) => {
    // 1) 알람 시간 검증
    for (let i = 0; i < medicationEditData.alarm_time.length; i++) {
      const { hour, minute, second } = medicationEditData.alarm_time[i];
      const isAllEmpty = (hour === '' && minute === '' && second === '');
      const isAllFilled = (hour !== '' && minute !== '' && second !== '');

      if (!isAllEmpty && !isAllFilled) {
        alert('알람 시간을 모두 입력하거나 모두 비워주세요.');
        return;
      }
      if (isAllFilled) {
        // 범위 체크
        const h = parseInt(hour, 10);
        const m = parseInt(minute, 10);
        const s = parseInt(second, 10);
        if (isNaN(h) || isNaN(m) || isNaN(s)) {
          alert('알람 시간은 숫자만 입력 가능합니다.');
          return;
        }
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

    // 2) 저장 여부 확인
    if (!window.confirm('약물 정보를 저장하시겠습니까?')) {
      return; // 사용자가 취소하면 중단
    }

    // 3) 유효 알람만 "HH:MM:SS" 변환
    const formatted = medicationEditData.alarm_time
      .filter(a => a.hour !== '' && a.minute !== '' && a.second !== '')
      .map(a => {
        const hh = a.hour.toString().padStart(2, '0');
        const mm = a.minute.toString().padStart(2, '0');
        const ss = a.second.toString().padStart(2, '0');
        return `${hh}:${mm}:${ss}`;
      });

    // 4) 서버에 PUT 요청
    axios.put(`/api/medications2/${id}`, {
      medicationId: id,
      medication: medicationEditData.medication,
      dosage: medicationEditData.dosage,
      frequency: medicationEditData.frequency,
      alarm_time: formatted
    })
    .then(response => {
      // state 업데이트
      const updated = [...patientDetails.medications];
      updated[index] = {
        ...updated[index],
        medication: medicationEditData.medication,
        dosage: medicationEditData.dosage,
        frequency: medicationEditData.frequency,
        alarm_time: formatted
      };
      setPatientDetails({ ...patientDetails, medications: updated });

      setEditingMedicationId(null);
      setMedicationEditData({ medication: '', dosage: '', frequency: '', alarm_time: [] });

      // 5) 저장 완료 알림
      alert('약물 정보가 성공적으로 저장되었습니다.');
    })
    .catch(err => {
      console.error('약물 수정 실패:', err);
      alert('약물 수정 실패');
    });
  };

  const handleCancelEditMedication = () => {
    setEditingMedicationId(null);
    setMedicationEditData({ medication: '', dosage: '', frequency: '', alarm_time: [] });
  };

  return (
    <div className='diagnosis-list-container'>
      <div className='patient-info'>
        <strong className='patient-list-name'>환자 성함:</strong>
        <strong className='patient-name-list'> {patientDetails.patientName}</strong>
      </div>

      {/* 진단명 리스트 */}
      <div className='diagnosis-list-title'>
        <strong>진단명</strong>
      </div>
      <ul className='diagnosis-list'>
        {patientDetails.diagnoses.map((diagnosis, idx) => (
          <li key={diagnosis.id}>
            {editingDiagnosisId === diagnosis.id ? (
              <>
                <input
                  type="text"
                  value={editDiagnosisData}
                  onChange={(e) => setEditDiagnosisData(e.target.value)}
                />
                <button onClick={() => handleSaveDiagnosis(diagnosis.id, idx)}>저장</button>
                <button onClick={handleCancelEditDiagnosis}>취소</button>
              </>
            ) : (
              <>
                {diagnosis.name}
                <button className='X-Button' onClick={() => handleDeleteDiagnosis(idx)}>X</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* 약물 리스트 */}
      <div className='medication-list-title'>
        <strong>복용 중인 약물</strong>
      </div>
      <ul className='medication-list'>
        {patientDetails.medications.map((med, idx) => {
          const isEditing = (editingMedicationId === med.id);
          return (
            <li key={med.id}>
              {isEditing ? (
                <div className="edit-container">
                  <div className="edit-row">
                    <label>약명:</label>
                    <input
                      type="text"
                      value={medicationEditData.medication}
                      onChange={(e) => setMedicationEditData({
                        ...medicationEditData,
                        medication: e.target.value
                      })}
                    />
                  </div>
                  <div className="edit-row">
                    <label>용량:</label>
                    <input
                      type="text"
                      value={medicationEditData.dosage}
                      onChange={(e) => setMedicationEditData({
                        ...medicationEditData,
                        dosage: e.target.value
                      })}
                    />
                  </div>
                  <div className="edit-row">
                    <label>횟수:</label>
                    <input
                      type="text"
                      value={medicationEditData.frequency}
                      onChange={(e) => setMedicationEditData({
                        ...medicationEditData,
                        frequency: e.target.value
                      })}
                    />
                  </div>

                  <div className="edit-row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <strong>알람 시간 (시, 분, 초):</strong>
                    {medicationEditData.alarm_time.map((alarm, i) => (
                      <div key={i} style={{ marginLeft: '20px', marginBottom: '5px' }}>
                        <input
                          type="number"
                          placeholder="시"
                          value={alarm.hour}
                          onChange={(e) => handleAlarmChange(i, 'hour', e.target.value)}
                          style={{ width: '50px' }}
                        />
                        <input
                          type="number"
                          placeholder="분"
                          value={alarm.minute}
                          onChange={(e) => handleAlarmChange(i, 'minute', e.target.value)}
                          style={{ width: '50px', marginLeft: '5px' }}
                        />
                        <input
                          type="number"
                          placeholder="초"
                          value={alarm.second}
                          onChange={(e) => handleAlarmChange(i, 'second', e.target.value)}
                          style={{ width: '50px', marginLeft: '5px' }}
                        />
                      </div>
                    ))}
                    <button onClick={handleAddAlarm}>+ 알람 추가</button>
                  </div>

                  <div className="edit-row">
                    <button  id="bttDiagnosisList" onClick={() => handleSaveMedication(med.id, idx)}>저장</button>
                    <button  id="bttDiagnosisList" onClick={handleCancelEditMedication}>취소</button>
                  </div>
                </div>
              ) : (
                <>
                  {med.medication} (용량: {med.dosage}, 횟수: {med.frequency})
                  <button className='X-Button' onClick={() => handleDeleteMedication(idx)}>X</button>
                  <button onClick={() => handleEditMedication(med.id, med)}>편집</button>
                  
                  {Array.isArray(med.alarm_time) && med.alarm_time.length > 0 && (
                    <div style={{ marginTop: '5px' }}>
                      <strong>알람 시간:</strong>
                      {med.alarm_time.map((time, i) => (
                        <div key={i}>{time}</div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>

      <button className='button' onClick={onAddClick}>진단명 추가</button>
    </div>
  );
}

export default DiagnosisList;
