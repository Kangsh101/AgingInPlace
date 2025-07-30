import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CmsSidebar from './CmsSidebar';
import CmsNavipanel from './CmsNavipanel';
import '../css/Cms.css';

const CmsScoreList = ({ userRole }) => {
  const [scores, setScores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [editingId, setEditingId] = useState(null);
  const [editingScore, setEditingScore] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserRole();
    fetchScores();
  }, []);

  const fetchUserRole = () => {
    fetch('/api/user/role', { method: 'GET', credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.role !== 'admin' && data.role !== 'doctor') {
          navigate('/notfound');
        }
      })
      .catch(() => navigate('/notfound'));
  };

  const fetchScores = () => {
    fetch('/api/mmse_score')
      .then(res => res.json())
      .then(data => setScores(data))
      .catch(err => console.error('점수 목록 로드 실패:', err));
  };

  const handleDelete = (id) => {
    if (window.confirm('삭제하시겠습니까?')) {
      fetch(`/api/mmse_score/${id}`, { method: 'DELETE' })
        .then(() => fetchScores())
        .catch(err => alert('삭제 실패'));
    }
  };

  const startEdit = (id, currentScore) => {
    setEditingId(id);
    setEditingScore(currentScore);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingScore('');
  };

  const saveEdit = (id) => {
    fetch(`/api/mmse_score/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: editingScore })
    })
      .then(res => {
        if (!res.ok) throw new Error('수정 실패');
        return res.json();
      })
      .then(() => {
        fetchScores();
        cancelEdit();
      })
      .catch(err => {
        console.error('수정 오류:', err);
        alert('수정 실패');
      });
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentScores = scores.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="cms-container">
      <CmsSidebar userRole={userRole} />
      <CmsNavipanel userRole={userRole} />
      <div className="cms-main-content">
        <header className="major">
          <h2>인지선별 검사 점수</h2>
        </header>
            <button className="add-button" onClick={() => navigate('/CmsAddOfflineScore')}>
            오프라인 검사 추가
          </button>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>성함</th>
                <th>점수</th>
                <th>검사방식</th>
                <th>등록일</th>
                <th>수정/삭제</th>
              </tr>
            </thead>
            <tbody>
              {currentScores.map((item, idx) => (
                <tr key={item.id}>
                  <td>{indexOfFirstPost + idx + 1}</td>
                  <td>{item.member_name}</td>
                  <td>
                    {editingId === item.id ? (
                      <input
                        type="number"
                        value={editingScore}
                        onChange={(e) => setEditingScore(e.target.value)}
                        min="0"
                        max="1000"
                        style={{ width: '60px' }}
                      />
                    ) : (
                      item.mmse
                    )}
                  </td>
                  <td>{item.test_type === 1 ? '오프라인 검사' : '모바일 검사'}</td>
                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                  <td>
                    {editingId === item.id ? (
                      <>
                        <button onClick={() => saveEdit(item.id)}>저장</button>
                        <button onClick={cancelEdit}>취소</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(item.id, item.mmse)}>수정</button>
                        <button onClick={() => handleDelete(item.id)}>삭제</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={scores.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`page-button ${number === currentPage ? 'active' : ''}`}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default CmsScoreList;
