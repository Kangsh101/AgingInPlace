import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/Cms.css';
import '../css/Cmsuser.css';
import '../css/PatientDetail.css';
import CmsSidebar from './CmsSidebar';

const PatientDetail = () => {
  const { id } = useParams();
  const [diagnoses, setDiagnoses] = useState([{ id: Date.now(), name: '' }]);
  const [medications, setMedications] = useState([{ id: Date.now(), name: '', dosage: '', frequency: '' }]);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    fetch(`/api/patient/${id}`)
      .then(response => response.json())
      .then(data => setPatient(data))
      .catch(error => console.error('Error fetching patient:', error));
  }, [id]);

  const addDiagnosis = () => {
    setDiagnoses([...diagnoses, { id: Date.now(), name: '' }]);
  };

  const removeDiagnosis = (id) => {
    setDiagnoses(diagnoses.filter(diagnosis => diagnosis.id !== id));
  };

  const addMedication = () => {
    setMedications([...medications, { id: Date.now(), name: '', dosage: '', frequency: '' }]);
  };

  const removeMedication = (id) => {
    setMedications(medications.filter(medication => medication.id !== id));
  };

  return (
    <div id='PatientDetail-container'>
    <CmsSidebar/>
        <div id='CmsAdd-container'>
            <div className="cms-container">
            <div className="cmsadd-main-content">
                <div className="Cmss-header">
                <header className='major'> 
                    <h2>{patient ? `${patient.name}의 진단 및 약물 정보` : 'Loading...'}</h2>
                </header>
                </div>
                {patient && (
                <div className="Cmss-content">
                    <div className="Cms-diagnosis-container">
                    <h3>진단받은 질환</h3>
                    {diagnoses.map((diagnosis) => (
                        <div key={diagnosis.id} className="diagnosis-item">
                        <input type="text" id='diagnosis' value={diagnosis.name} placeholder="질환명 입력" onChange={(e) => setDiagnoses(diagnoses.map(d => d.id === diagnosis.id ? { ...d, name: e.target.value } : d))}/>
                        <button className='X-Button' onClick={() => removeDiagnosis(diagnosis.id)}>X</button>
                        </div>
                    ))}
                    <button className="button" id='PatientDetail-Btt' onClick={addDiagnosis}>질환 추가</button>
                    </div>
                    <div className="Cms-medication-container">
                    <h3>복용 중인 약물</h3>
                    {medications.map((medication) => (
                        <div key={medication.id} className="medication-item">
                        <input type="text" id='medication' value={medication.name} placeholder="약명" onChange={(e) => setMedications(medications.map(m => m.id === medication.id ? { ...m, name: e.target.value } : m))} />
                        <input type="text" id='dosage' name="dosage" value={medication.dosage}  placeholder="용량"  onChange={(e) => setMedications(medications.map(m => m.id === medication.id ? { ...m, dosage: e.target.value } : m))} />
                        <input type="text" id='frequency' name="frequency" value={medication.frequency} placeholder="복용 횟수" onChange={(e) => setMedications(medications.map(m => m.id === medication.id ? { ...m, frequency: e.target.value } : m))} />
                        <button className='X-Button' onClick={() => removeMedication(medication.id)}>X</button>
                        </div>
                    ))}
                    <button className="button" id='PatientDetail-Btt' onClick={addMedication}>약물 추가</button>
                    </div>
                    <div className='saveBtt'>
                        <button className='button primary' id='saveBtt'>저장</button>
                    </div>
                </div>
                )}
            </div>
            </div>
        </div>
    </div>
  );
};

export default PatientDetail;
