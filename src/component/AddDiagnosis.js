import React, { useState } from 'react';
import '../css/AddDiagnosis.css';

function HealthInfoForm({ isGuardian = false }) {
    const [diseases, setDiseases] = useState(['']);
    const [medications, setMedications] = useState([{ name: '', dosage: '', frequency: '' }]);
    const [dependentId, setDependentId] = useState('');

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

    return (
        <div>
            <div className='diagnosis-container'>
            <div className='diagnosis-title'>
                <strong>진단명 추가</strong>
            </div>
                {isGuardian && (
                    <div>
                        <label>대상자 ID: </label>
                        <input type="text" value={dependentId} onChange={(e) => setDependentId(e.target.value)} />
                    </div>
                )}
                <div>
                    <label>진단받은 질환</label>
                    {diseases.map((disease, index) => (
                        <div key={index}>
                            <input type="text" id='disease-input'  value={disease} onChange={(e) => handleDiseaseChange(index, e.target.value)} placeholder="질환명 입력"/>
                        </div>
                    ))}
                    <button className='button' id='disease-btt' onClick={handleAddDisease}>질환 추가</button>
                </div>
                <div className='Drug-name'>
                    <label>복용 중인 약물 </label>
                    {medications.map((med, index) => (
                        <div key={index}>                        
                                <input type="text" id='Drug-width2' className='medication-name' value={med.name} onChange={(e) => handleMedicationChange(index, 'name', e.target.value)} placeholder="약명" />
                            <div>
                                <input type="text" id='Drug-width' className='dosage' value={med.dosage} onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)} placeholder="용량"/>
                                <input type="text" id='Drug-width' className='frequency' value={med.frequency} onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)} placeholder="복용 횟수" />
                            </div>
                        </div>
                    ))}
                    <button className='button' onClick={handleAddMedication}>약물 추가</button>
                    <div className='Diagnosis-Addbtt'>
                        <button id='Diagnosis-btt' className='button primary'>추가</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HealthInfoForm;
