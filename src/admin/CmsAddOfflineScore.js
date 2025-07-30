import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CmsSidebar from './CmsSidebar';
import CmsNavipanel from './CmsNavipanel';

const CmsAddOfflineScore = ({ userRole }) => {
  const [selectedId, setSelectedId] = useState('');
  const [selectedUsername, setSelectedUsername] = useState('');
  const [members, setMembers] = useState([]);
  const [score, setScore] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/members')
      .then(res => res.json())
      .then(data => setMembers(data))
      .catch(err => console.error('회원 목록 불러오기 실패:', err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/mmse_score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: selectedId,
        username: selectedUsername,
        score,
        test_type: 1
      })
    })
      .then(res => res.json())
      .then(() => {
        alert('등록 완료');
        navigate('/CmsScoreList');
      })
      .catch(err => {
        console.error('등록 실패:', err);
        alert('등록 실패');
      });
  };

  return (
    <div className="cms-container">
      <CmsSidebar userRole={userRole} />
      <CmsNavipanel userRole={userRole} />
      <div className="cms-main-content">
        <header className="major">
         <h2>오프라인 검사 점수 추가</h2>
        </header>
        <form onSubmit={handleSubmit} className="form-box">
          <label>회원 선택:</label>
          <select
            value={selectedId}
            onChange={(e) => {
              const selectedMember = members.find(m => m.id === Number(e.target.value));
              setSelectedId(selectedMember.id);
              setSelectedUsername(selectedMember.name); 
            }}
            required
          >
            <option value="">-- 선택하세요 --</option>
            {members.map(member => (
              <option
                key={member.id}
                value={member.id}
              >
                {member.name} ({member.role})
              </option>
            ))}
          </select>

          <label>점수 입력:</label>
          <input
            type="number"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            min="0"
            max="1000"
            required
          />

          <button type="submit" className="submit-button">등록</button>
        </form>
      </div>
    </div>
  );
};

export default CmsAddOfflineScore;
