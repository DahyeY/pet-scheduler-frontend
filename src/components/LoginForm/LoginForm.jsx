import React, { useState } from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import  cookie from 'react-cookies'; 

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); // 폼의 기본 제출 동작을 막음

    const response = await fetch('http://13.124.35.7:8080/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': `${cookie.load('token')}`
      },
      body: JSON.stringify({ email, password }), // JSON 형식으로 이메일과 비밀번호를 요청 본문에 포함
      credentials: 'include' // 쿠키를 포함한 요청을 허용
    });
    console.log('로그인 : ', email, password);

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      cookie.save('token', data.token, {
        path: '/',
        // sameSite: 'None',
        // secure: false
      });

      if(data.mypage){
        navigate(`/mypage`);
      } else {
        // 로그인 성공 시, 원하는 페이지로 리디렉션
        navigate(`/calendar/${data.id}`);
      }
    } else {
      // 로그인 실패 시, 에러 처리
      alert('이메일과 비밀번호를 확인해주세요');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>펫 스케줄러</h1>
      <div className="input-box">
        <FaUser className='icon'/>
        <input
          type="text"
          placeholder='email@domain.com'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="input-box">
        <FaLock className='icon'/>
        <input
          type="password"
          placeholder='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit">로그인</button>
      
      <div className="register-link">
        <p>Don't have an account? <a href="/join" className="link-button">가입하기</a></p>
      </div>
    </form>
  );
}

export default LoginForm;
