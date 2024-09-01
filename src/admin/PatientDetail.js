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
  const [diagnoses, setDiagnoses] = useState([{ id: Date.now(), name: '' }]);
  const [medications, setMedications] = useState([{ id: Date.now(), name: '', dosage: '', frequency: '' }]);
  const [enteredBy, setEnteredBy] = useState(null);

  useEffect(() => {
    axios.get('/api/currentUser')
      .then(response => {
        setEnteredBy(response.data.userId);
      })
      .catch(error => {
        console.error('Error fetching current user:', error);
      });
  }, []);

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

  const handleSaveDiagnosis = async () => {
    if (!enteredBy) {
      alert('로그인 정보를 확인할 수 없습니다.');
      return;
    }

    try {
      const diagnosisNames = diagnoses.map(diagnosis => diagnosis.name);

      await axios.post('/api/addDiagnosisByAdmin', {
        patientId: id,
        diagnoses: diagnosisNames,
        enteredBy,
      });

      alert('진단명이 성공적으로 저장되었습니다.');
      navigate(`/patient/${id}`); 
    } catch (error) {
      console.error('진단명을 저장하는 데 실패했습니다.', error);
      alert('진단명을 저장하는 데 실패했습니다.');
    }
  };

  const handleSaveMedications = async () => {
    if (!enteredBy) {
      alert('로그인 정보를 확인할 수 없습니다.');
      return;
    }

    try {
      const medicationDetails = medications.map(medication => ({
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
      }));

      await axios.post('/api/addMedicationsByAdmin', {
        patientId: id,
        medications: medicationDetails,
        enteredBy,
      });

      alert('약물 정보가 성공적으로 저장되었습니다.');
      navigate(`/patient/${id}`); 
    } catch (error) {
      console.error('약물 정보를 저장하는 데 실패했습니다.', error);
      alert('약물 정보를 저장하는 데 실패했습니다.');
    }
  };

  const handleCancel = () => {
    navigate(`/cmsadddiagnosis`); 
  };

  return (
    <div className="cms-container">
      <CmsSidebar userRole={userRole} />
      <CmsNavipanel userRole={userRole}  />
      <div className="cms-main-content">
        <div className="Cmss-header">
          <header className="major">
            <h2>진단명 및 약물 정보 추가</h2>
          </header>
        </div>
        <div className="Cmss-content" id="CmsAdd-container">
          <div className="Cms-diagnosis-container">
            <h3>진단받은 질환</h3>
            {diagnoses.map((diagnosis) => (
              <div key={diagnosis.id} className="diagnosis-item">
                <input
                  type="text"
                  id="diagnosis"
                  value={diagnosis.name}
                  placeholder="질환명 입력"
                  onChange={(e) =>
                    setDiagnoses(
                      diagnoses.map((d) =>
                        d.id === diagnosis.id ? { ...d, name: e.target.value } : d
                      )
                    )
                  }
                />
                <button className="X-Button" onClick={() => removeDiagnosis(diagnosis.id)}>X</button>
              </div>
            ))}
            <button className="button" id="PatientDetail-Btt" onClick={addDiagnosis}>질환 추가</button>
            <div className="Diagnosis-saveBtt">
              <button className="button primary" id="saveBtt" onClick={handleSaveDiagnosis}>진단명 저장</button>
            </div>
          </div>
          <div className="Cms-medication-container">
            <h3>복용 중인 약물</h3>
            {medications.map((medication) => (
              <div key={medication.id} className="medication-item">
                <input
                  type="text"
                  id="medication"
                  value={medication.name}
                  placeholder="약명"
                  onChange={(e) =>
                    setMedications(
                      medications.map((m) =>
                        m.id === medication.id ? { ...m, name: e.target.value } : m
                      )
                    )
                  }
                />
                <input
                  type="text"
                  id="dosage"
                  name="dosage"
                  value={medication.dosage}
                  placeholder="용량"
                  onChange={(e) =>
                    setMedications(
                      medications.map((m) =>
                        m.id === medication.id ? { ...m, dosage: e.target.value } : m
                      )
                    )
                  }
                />
                <input
                  type="text"
                  id="frequency"
                  name="frequency"
                  value={medication.frequency}
                  placeholder="복용 횟수"
                  onChange={(e) =>
                    setMedications(
                      medications.map((m) =>
                        m.id === medication.id ? { ...m, frequency: e.target.value } : m
                      )
                    )
                  }
                />
                <button className="X-Button" onClick={() => removeMedication(medication.id)}>X</button>
              </div>
            ))}
            <button className="button" id="PatientDetail-Btt" onClick={addMedication}>약물 추가</button>
            <div className="Medication-saveBtt">
              <button className="button primary" id="saveBtt" onClick={handleSaveMedications}>약물 정보 저장</button>
            </div>
          </div>
          <div className="saveBtt">
            <button className="button" id="cancelBtt" onClick={handleCancel}>취소</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
