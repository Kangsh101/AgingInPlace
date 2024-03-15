
import '../css/MyInfo.css';


function MyInfo({ userInfo }) {
    const user = userInfo[0];

    return (
        <div className='myinfo-container'>
            <div className='myinfo-title'>
                <strong>내 정보 페이지</strong>
            </div>
            <div className='myinfo-context-container'>
                {user ? (
                    <>
                        <div>
                            <p><strong>성별 : </strong> <span>{user.gender}</span> </p>
                        </div>
                        <div>
                            <p><strong>이름</strong> <span>{user.name}</span> </p>
                        </div>
                        <div>
                            <p><strong>역할</strong><span>{user.role}</span></p>                 
                        </div>
                        <div>
                            <p><strong>번호</strong> <span>{user.phoneNumber}</span> </p>    
                        </div>
                        <div>
                            <p><strong>생일</strong> <span>{user.birthdate}</span> </p>           
                        </div>
                    </>
                ) : (
                    <div>로그인 해주세요 유저정보를 찾을 수 없음.</div>
                )}
            </div>
            
        </div>
    );
}

export default MyInfo;
