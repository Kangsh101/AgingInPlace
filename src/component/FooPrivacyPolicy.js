import React from 'react';
import '../css/FooMenu.css';
import '../css/Footer-Sub.css';

const FooPrivacyPolicy = () => {
  return (
    <div id="main">
      <div className="FooMenu-container">
        <div className="privacy-policy-container">
          <h2 className='Fooh2CSS'>개인정보처리방침</h2>
          
          <h5 className='Foo-Maintxt'>1. 총칙</h5>
          <p className='Foo-subtxt'>본 기관은 이용자의 개인정보를 중요시하며, 관련 법령을 준수하여 개인정보를 보호하고 있습니다.</p>
          
          <h5 className='Foo-Maintxt'>2. 개인정보의 수집 및 이용목적</h5>

          <p  className='Foo-subtxt'>본 기관은 다음의 목적을 위해 개인정보를 수집합니다.
            <br/>- 회원가입 및 이용자 식별
            <br/>- 서비스 제공 및 개선
            <br/>- 연구 및 통계 분석
            <br/>- 법령 및 이용약관 준수</p>      
          <h5 className='Foo-Maintxt'>3. 수집하는 개인정보 항목</h5>
          <ul>
            <li className='Foo-subtxt' >예) 귀하의 성명, 성별, 나이</li>
            <li className='Foo-subtxt'> 예) 연락처(전화번호, 이메일)</li>
            <li className='Foo-subtxt'> 예) 연구 과정에서 발생하는 건강 관련 정보 (연구 대상자의 경우)</li>
          </ul>
          

          <h5 className='Foo-Maintxt'>4. 개인정보의 보유 및 이용 기간</h5>
          <p className='Foo-subtxt'>본 연구의 참여로 귀하에게서 수집되는 개인정보는 3 년간 사용되며 수집된 정보는 개인정보 보호법에 따라 적절히 관리됩니다.
            관련 정보는 잠금 장치가 있는 연구자의 연구실에 보관되며 참여 연구자들만이 접근 가능합니다. 연구를 통해 얻은 모든 개인 정보의 비밀 보장을 위해 최선을 다할 것입니다. 
          </p>
          
          <h5 className='Foo-Maintxt'>5. 개인정보의 제공 및 공유</h5>
          <p className='Foo-subtxt'>이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
            <br/>1.  수집된 자료는 연구의 목적으로만 사용되고, 연구 참여는 연구대상자들의 자율적 의사에 따르며, 연구 참여 및 중단 여부에 따라 불이익이 발생하지 않고 연구진행과정에서 언제든지 참여를 중단할 수 있음을 설명하고, 이를 연구동의서에 명시한다.
            
            <br/>2.  자료수집은 해당 기관 비밀이 보장되는 곳에서 시행할 것이며, 연구대상자의 신원이 노출되지 않도록 수집된 자료는 고유식별번호를 부여하고 무기명으로 관리하며, 수집자료와 동의서는 분리하여 이중 잠금 장치가 된 연구자의 연구실 보관함에 따로 보관한다.
            <br/>3. 연구 종료 후 연구 관련 자료는 3 년간 보관되며 이후 연세의료원 문서 규정 제 47 조에 의거하여 보존 연한이 경과된 문서를 총무팀으로 이송하여 폐기한다.
            <br/>
            <br/>다만, 법률에 따라 요구되는 경우 제공될 수 있습니다.
            </p>

          
          <h5 className='Foo-Maintxt'>6. 개인정보 보호를 위한 조치</h5>
          <ul>
            <li className='Foo-subtxt'>- 개인정보 접근 권한 제한</li>
            <li className='Foo-subtxt'>- 보안 시스템 운영 및 점검</li>
            <li className='Foo-subtxt'>- 암호화 기술 적용</li>
          </ul>
          
          <h5 className='Foo-Maintxt'>7. 개인정보 보호책임자 및 연락처</h5>
          <p className='Foo-subtxt'>개인정보 보호 관련 문의는 아래 연락처로 문의해 주시기 바랍니다.<br/>- 담당자: 신진희<br/>- 연락처: 010-2387-1617</p>
        </div>
      </div>
    </div>
  );
};

export default FooPrivacyPolicy;

