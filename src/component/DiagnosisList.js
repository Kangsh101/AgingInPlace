import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/DiagnosisList.css';

function DiagnosisList({ onAddClick }) {
    const [userDetails, setUserDetails] = useState({ role: '', name: '', patientId: null });
    const [patientDetails, setPatientDetails] = useState({ patientName: '', diagnoses: [], medications: [] });

    useEffect(() => {
        // 사용자 정보 가져오기
        axios.get('/api/getUserDetails')
            .then(response => {
                if (response.data) {
                    setUserDetails(response.data);
                    // 환자 정보 가져오기
                    const patientId = response.data.role === '보호자' ? response.data.patientId : response.data.id;
                    axios.get(`/api/getPatientDetails?patientId=${patientId}`)
                        .then(response => {
                            if (response.data) {
                                setPatientDetails(response.data);
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
                    <li key={index}>{diagnosis}</li>
                ))}
            </ul>
            <div className='medication-list-title'>
                <strong>복용 중인 약물</strong>
            </div>
            <ul className='medication-list'>
                {patientDetails.medications.map((med, index) => (
                    <li key={index}>
                        {med.medication} (용량: {med.dosage}, 복용 횟수: {med.frequency})
                    </li>
                ))}
            </ul>
            <button className='button' onClick={onAddClick}>진단명 추가</button>
        </div>
    );
}

export default DiagnosisList;
