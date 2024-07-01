import React, { useState, useEffect } from 'react';
import '../css/AddDiagnosis.css';
import axios from 'axios';

function AddDiagnosis({ isGuardian = true, onCancel }) {
    const [patientName, setPatientName] = useState('');
    const [patientId, setPatientId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [diseases, setDiseases] = useState(['']);
    const [medications, setMedications] = useState([{ name: '', dosage: '', frequency: '' }]);

    useEffect(() => {
        if (isGuardian) {
            axios.get('/api/getPatientInfo')
                .then(response => {
                    console.log('환자 정보:', response.data); // 확인용 로그
                    setPatientName(response.data.patientName);
                    setPatientId(response.data.patientId); // 환자 ID 설정
                })
                .catch(error => {
                    console.error('환자 정보를 가져오는 데 실패했습니다.', error);
                });
        }

        axios.get('/api/getUserId')
            .then(response => {
                setUserId(response.data.userId); // 사용자 ID 설정
            })
            .catch(error => {
                console.error('사용자 정보를 가져오는 데 실패했습니다.', error);
            });
    }, [isGuardian]);

    const handleAddDisease = () => {
        setDiseases([...diseases, '']);
    };

    const handleDiseaseChange = (index, value) => {
        const updated = diseases.map((disease, idx) => idx === index ? value : disease);
        setDiseases(updated);
    };

    const handleAddMedication = () => {
        setMedications([...medications, { name: '', dosage: '', frequency: '' }]);
    };

    const handleMedicationChange = (index, field, value) => {
        const updated = medications.map((med, idx) => {
            if (idx === index) {
                return { ...med, [field]: value };
            }
            return med;
        });
        setMedications(updated);
    };

    const handleSubmit = async () => {
        if (!patientId) {
            alert('환자 ID를 확인할 수 없습니다.');
            return;
        }
    
        try {
            await axios.post('/api/addDiagnosis', {
                patientId,
                diagnoses: diseases,
                enteredBy: userId // 현재 사용자 ID
            });
    
            await axios.post('/api/addMedications', {
                patientId,
                medications,
                enteredBy: userId // 현재 사용자 ID
            });
    
            alert('정보가 성공적으로 저장되었습니다.');
            onCancel(); // 추가 후 취소(이전 페이지로 이동)
        } catch (error) {
            console.error('정보를 저장하는 데 실패했습니다.', error);
            alert('정보를 저장하는 데 실패했습니다.');
        }
    };

    return (
        <div>
            <div className='diagnosis-container'>
                <div className='diagnosis-title'>
                    <strong>진단명 추가</strong>
                </div>
                {isGuardian && (
                    <div className='patient-div'>
                        <span className='patient-name'><span id='patientNaem'>환자 성함 : </span> {patientName}</span>
                    </div>
                )}
                <div className='diagnosis-box'>
                    <div>
                        <label>진단받은 질환</label>
                        {diseases.map((disease, index) => (
                            <div key={index}>
                                <input type="text" id='disease-input' value={disease} onChange={(e) => handleDiseaseChange(index, e.target.value)} placeholder="질환명 입력" />
                            </div>
                        ))}
                        <button className='button' id='disease-btt' onClick={handleAddDisease}>질환 추가</button>
                    </div>
                    <div>
                        <button className='button primary' id='Diagnosis-btt' onClick={handleSubmit}>추가</button>
                    </div>
                    <div className='Drug-name'>
                        <label>복용 중인 약물</label>
                        {medications.map((med, index) => (
                            <div key={index}>
                                <input type="text" id='Drug-width2' className='medication-name' value={med.name} onChange={(e) => handleMedicationChange(index, 'name', e.target.value)} placeholder="약명" />
                                <div>
                                    <input type="text" id='Drug-width' className='dosage' value={med.dosage} onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)} placeholder="용량" />
                                    <input type="text" id='Drug-width' className='frequency' value={med.frequency} onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)} placeholder="복용 횟수" />
                                </div>
                            </div>
                        ))}
                        <button className='button' onClick={handleAddMedication}>약물 추가</button>
                    </div>
                    <button className='button primary' id='Medication-btt' onClick={handleSubmit}>추가</button>
                    <div>
                        <button id='cancel-btt' className='button' onClick={onCancel}>취소</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddDiagnosis;
