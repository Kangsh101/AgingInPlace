import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/DiagnosisList.css';

function DiagnosisList({ isGuardian = true, onAddClick }) {
    const [patientDetails, setPatientDetails] = useState({ patientName: '', diagnoses: [], medications: [] });

    useEffect(() => {
        // Fetch the patient details
        axios.get('/api/getPatientDetails')
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
    }, []);

    return (
        <div className='diagnosis-list-container'>
            <div className='patient-info'>
                <strong>환자 성함: {patientDetails.patientName}</strong>
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
            {isGuardian && (
                <button className='button' onClick={onAddClick}>진단명 추가</button>
            )}
        </div>
    );
}

export default DiagnosisList;
