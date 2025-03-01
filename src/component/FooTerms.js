import React from 'react';
import '../css/FooMenu.css';
import '../css/Footer-Sub.css';

const FooTerms = () => {
  return (
    <div id="main">
      <div className="FooMenu-container">
        <div className="terms-container">              
          <h2 className='Fooh2CSS'>이용약관</h2>
          <h5 className='Foo-Maintxt'>제1조 (목적)</h5>
          <p className='Foo-subtxt'>본 약관은 이용자가 본 기관이 제공하는 서비스를 이용함에 있어 필요한 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.</p>
          
          <h5 className='Foo-Maintxt'>제2조 (용어의 정의)</h5>
          <p className='Foo-subtxt'>- "이용자"란 본 기관의 서비스를 이용하는 자를 말합니다.<br/>- "서비스"란 본 기관이 제공하는 온라인 및 오프라인 프로그램을 포함합니다.</p>
          
          <h5 className='Foo-Maintxt'>제3조 (이용계약의 성립)</h5>
          <p  className='Foo-subtxt'>서비스 이용 신청자는 본 약관에 동의하고 회원가입 절차를 완료함으로써 이용 계약이 성립됩니다.</p>
          
          <h5 className='Foo-Maintxt'>제4조 (서비스 제공 및 변경)</h5>
          <p  className='Foo-subtxt'>본 기관은 이용자에게 원활한 서비스를 제공하며, 필요한 경우 서비스 내용을 변경할 수 있습니다.</p>
          
          <h5 className='Foo-Maintxt'>제5조 (이용자의 의무)</h5>
          <ul>
            <li  className='Foo-subtxt'>타인의 정보를 도용하지 않습니다.</li>
            <li  className='Foo-subtxt'>법령 및 본 약관을 준수합니다.</li>
          </ul>
          
          <h5 className='Foo-Maintxt'>제6조 (서비스의 중단 및 이용제한)</h5>
          <p  className='Foo-subtxt'>본 기관은 다음과 같은 경우 서비스 이용을 제한할 수 있습니다.<br/>- 이용자가 본 약관을 위반한 경우<br/>- 기술적 문제가 발생한 경우</p>
          
          <h5 className='Foo-Maintxt'>제7조 (면책조항)</h5>
          <p  className='Foo-subtxt'>본 기관은 천재지변, 기술적 문제 등 불가항력적인 사유로 서비스 제공이 불가능한 경우 책임을 지지 않습니다.</p>
          
          <h5 className='Foo-Maintxt'>제8조 (약관 변경 및 공지)</h5>
          <p  className='Foo-subtxt'>본 기관은 필요한 경우 약관을 변경할 수 있으며, 변경 사항은 공지사항을 통해 안내됩니다.</p>
          
          <h5 className='Foo-Maintxt'>제9조 (문의처)</h5>
          <p  className='Foo-subtxt'>이용약관에 대한 문의는 아래 연락처로 문의해 주시기 바랍니다.<br/>- 담당자: 신진희<br/>- 연락처: 010-2387-1617</p>
        </div>
      </div>
    </div>
  );
};

export default FooTerms;

