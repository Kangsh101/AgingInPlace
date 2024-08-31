import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/DiagnosisList.css';

function DiagnosisList({ onAddClick }) {
    const [userDetails, setUserDetails] = useState({ role: '', name: '', patientId: null });
    const [patientDetails, setPatientDetails] = useState({ patientName: '', diagnoses: [], medications: [] });

    useEffect(() => {
        axios.get('/api/getUserDetails')
            .then(response => {
                if (response.data) {
                    setUserDetails(response.data);
                    const patientId = response.data.role === '보호자' ? response.data.patientId : response.data.id;
                    axios.get(`/api/getPatientDetails?patientId=${patientId}`)
                        .then(response => {
                            if (response.data) {
                                setPatientDetails(response.data);  // 기존 상태를 덮어쓰는 방식으로 초기화
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

    // 진단명 삭제 핸들러
    const handleDeleteDiagnosis = (index) => {
        const confirmed = window.confirm('정말 이 진단명을 삭제하시겠습니까?');
        if (confirmed) {
            const diagnosisId = patientDetails.diagnoses[index].id;
            const updatedDiagnoses = patientDetails.diagnoses.filter((_, i) => i !== index);
            setPatientDetails({ ...patientDetails, diagnoses: updatedDiagnoses });

            // 서버로 삭제 요청 보내기
            axios.delete(`/api/deleteDiagnosis`, { data: { diagnosisId } })
                .then(response => {
                    console.log(response.data.message);
                })
                .catch(error => console.error('진단명 삭제에 실패했습니다.', error));
        }
    };

    // 약물 삭제 핸들러
    const handleDeleteMedication = (index) => {
        const confirmed = window.confirm('정말 이 약물을 삭제하시겠습니까?');
        if (confirmed) {
            const medicationId = patientDetails.medications[index].id; 
            if (!medicationId) {
                console.error('약물 ID를 찾을 수 없습니다.');
                return;
            }

            const updatedMedications = patientDetails.medications.filter((_, i) => i !== index);
            setPatientDetails({ ...patientDetails, medications: updatedMedications });
            axios.delete(`/api/deleteMedication`, { data: { medicationId } })
                .then(response => {
                    console.log(response.data.message);
                })
                .catch(error => console.error('약물 삭제에 실패했습니다.', error));
        }
    };

    return (
        <div className='diagnosis-list-container'>
            <div className='patient-info'>
                <strong className='patient-list-name'>환자 성함:</strong><strong className='patient-name-list'> {patientDetails.patientName}</strong>
            </div>
            <div className='diagnosis-list-title'>
                <strong>기존 진단명</strong>
            </div>
            <ul className='diagnosis-list'>
                {patientDetails.diagnoses.map((diagnosis, index) => (
                    <li key={diagnosis.id}> 
                        {diagnosis.name}
                        <button className='X-Button' onClick={() => handleDeleteDiagnosis(index)}>X</button>
                    </li>
                ))}
            </ul>
            <div className='medication-list-title'>
                <strong>복용 중인 약물</strong>
            </div>
            <ul className='medication-list'>
                {patientDetails.medications.map((med, index) => (
                    <li key={med.id}> 
                        {med.medication} (용량: {med.dosage}, 복용 횟수: {med.frequency})
                        <button className='X-Button' onClick={() => handleDeleteMedication(index)}>X</button>
                    </li>
                ))}
            </ul>
            <button className='button' onClick={onAddClick}>진단명 추가</button>
        </div>
    );
}

export default DiagnosisList;
