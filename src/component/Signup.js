import React, { useState } from 'react';
import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';
import axios from 'axios';

const Signup = () => {
  const [section, setSection] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
    birthdate: '',
    gender: 'male',
    nationality: 'domestic',
    phoneNumber: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleAgree = () => {
    setAgreed(true);
  };

  const handleNext = async () => {
    if (section === 1) { 
      if (agreed) {
        alert('약관에 동의해주세요.');
        return;
      }
      setSection(section + 1); 
      return;
    }
    
    if (section === 2) { 
      if (!checkAllInputs()) {
        return;
      }
      if (userData.password !== userData.confirmPassword) {
        setPasswordMatch(false);
        return;
      }
      try {
        const response = await axios.post('/api/signup', userData); 
        console.log('User signed up successfully:', response.data);
        setSection(section + 1); 
      } catch (error) {
        console.error('Error signing up:', error.response.data.error);
      }
    }
  };

  const checkAllInputs = () => {
    return (
      userData.username !== '' &&
      userData.password !== '' &&
      userData.confirmPassword !== '' &&
      userData.email !== '' &&
      userData.role !== '' &&
      userData.gender !== '' &&
      userData.name !== '' &&
      userData.birthdate !== '' &&
      userData.phoneNumber !== ''
    );
  };

  return (
    <div>
      {section === 1 && <Section1 agreed={agreed} handleAgree={handleAgree} handleNext={handleNext} />}
      {section === 2 && <Section2 userData={userData} passwordMatch={passwordMatch} handleInputChange={handleInputChange} handleNext={handleNext} />}
      {section === 3 && <Section3 />}
    </div>
  );
};

export default Signup;
