import '../css/MyInfo.css';

function MyInfo({ userInfo }) {
    function formatBirthdate(birthdate) {
        const date = new Date(birthdate);
        return date.toISOString().split('T')[0];
    }

    return (
        <div className='myinfo-container'>
            <div className='myinfo-title'>
                <strong>내 정보 페이지</strong>
            </div>
            <div className='myinfo-context-container'>
                {userInfo ? (
                    <>
                        <div className='myinfo-context'>
                            <p><strong>성 별</strong><span>{userInfo.gender}</span></p>
                        </div>
                        <div className='myinfo-context'>
                            <p><strong>이 름</strong><span>{userInfo.name}</span></p>
                        </div>
                        <div className='myinfo-context'>
                            <p><strong>역 할</strong><span>{userInfo.role}</span></p>
                        </div>
                        <div className='myinfo-context'>
                            <p><strong>번 호</strong><span>{userInfo.phoneNumber}</span></p>
                        </div>
                        <div className='myinfo-context'>
                            <p><strong>생 일</strong><span>{formatBirthdate(userInfo.birthdate)}</span></p>
                        </div>
                    </>
                ) : (
                    <div style={{ color: 'red', fontSize: '25px', fontWeight: 'bold' }}>
                        로그인 해주세요 유저정보를 찾을 수 없음.
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyInfo;
