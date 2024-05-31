import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/Cms.css';
import '../css/Cmsuser.css';
import '../css/PatientDetail.css';
import CmsSidebar from './CmsSidebar';
import axios from 'axios';

const PatientDiagnosisList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);
  const [medications, setMedications] = useState([]);

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

  const handleCancel = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div className="cms-container">
      <CmsSidebar />
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
              {diagnoses.map((diagnosis, index) => (
                <li key={index} className="enhanced-list-item">{diagnosis.diagnosis}</li>
              ))}
            </ul>
          </div>
          <div className="Cms-medication-container enhanced-section">
            <h3 className="section-title">복용 중인 약물</h3>
            <ul className="enhanced-list">
              {medications.map((medication, index) => (
                <li key={index} className="enhanced-list-item">
                  {medication.name} (용량: {medication.dosage}, 복용 횟수: {medication.frequency})
                </li>
              ))}
            </ul>
          </div>
          <div className="button-container">
            <button className='button primary' onClick={handleAddDiagnosis}>진단명 추가</button>
            <button className='button' onClick={handleCancel}>목록</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDiagnosisList;
