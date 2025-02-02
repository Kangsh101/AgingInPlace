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
  
  useEffect(() => {
    fetch('/api/user/role', {
      method: 'GET',
      credentials: 'include' // 세션 정보 포함
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('권한이 없습니다.');
        }
        return response.json();
      })
      .then((data) => {
        if (data.role === 'admin' || data.role === 'doctor') {
          setUserRole(data.role); // 권한이 admin 또는 doctor일 경우
        } else {
          navigate('/notfound'); // 권한이 없을 경우 접근 제한
        }
      })
      .catch((error) => {
        console.error('API 호출 오류:', error);
        navigate('/notfound'); // 오류 시 접근 제한
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
        } else {
          console.error('Invalid data format for diagnoses');
        }
      })
      .catch(error => console.error('Error fetching diagnoses:', error));

    axios.get(`/api/patient/${id}/medications`)
      .then(response => {
        if (Array.isArray(response.data)) {
          setMedications(response.data);
        } else {
          console.error('Invalid data format for medications');
        }
      })
      .catch(error => console.error('Error fetching medications:', error));
  }, [id]);

  const handleAddDiagnosis = () => {
    navigate(`/patient/${id}/add-diagnosis`);
  };

  const handleDeleteDiagnosis = async (diagnosisId) => {
    const confirmed = window.confirm('정말 이 진단명을 삭제하시겠습니까?');
  
    if (confirmed) {
      try {
        const response = await axios.delete(`/api/diagnoses/${diagnosisId}`);
        if (response.status === 200) {
          setDiagnoses(diagnoses.filter(diagnosis => diagnosis.id !== diagnosisId));
        } else {
          console.error('Error deleting diagnosis:', response.status);
        }
      } catch (error) {
        console.error('Error deleting diagnosis:', error);
      }
    }
  };
  
  const handleDeleteMedication = async (medicationId) => {
    const confirmed = window.confirm('정말 이 약물 정보를 삭제하시겠습니까?');
  
    if (confirmed) {
      try {
        const response = await axios.delete(`/api/medications/${medicationId}`);
        if (response.status === 200) {
          setMedications(medications.filter(medication => medication.id !== medicationId));
        } else {
          console.error('Error deleting medication:', response.status);
        }
      } catch (error) {
        console.error('Error deleting medication:', error);
      }
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="cms-container">
      <CmsSidebar userRole={userRole} />
      <CmsNavipanel userRole={userRole} />
      <div className="cms-main-content">
        <div className="Cmss-header">
          <header className='major' id='major-rest'>
            <h2>{patient ? `${patient.name}의 진단 및 약물 정보` : 'Loading...'}</h2>
          </header>
        </div>
        <div className="DiagnosisList-content">
          <div className="Cms-diagnosis-container enhanced-section">
            <h3 className="section-title">진단받은 질환</h3>
            <ul className="enhanced-list">
              {diagnoses.map((diagnosis) => (
                <li key={diagnosis.id} className="enhanced-list-item">
                  <span>{diagnosis.diagnosis}</span>
                  <button className='X-Button' onClick={() => handleDeleteDiagnosis(diagnosis.id)}>X</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="Cms-medication-container enhanced-section">
            <h3 className="section-title">복용 중인 약물</h3>
            <ul className="enhanced-list">
              {medications.map((medication) => (
                <li key={medication.id} className="enhanced-list-item">
                  <span>{medication.name} (용량: {medication.dosage}, 복용 횟수: {medication.frequency})</span>
                  <button className='X-Button' onClick={() => handleDeleteMedication(medication.id)}>X</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="button-container">
            <button id='Diagnosis-addBtt' className='button primary' onClick={handleAddDiagnosis}>진단명 추가</button>
            <button className='button' onClick={handleCancel}>목록</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDiagnosisList;
