import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import './JoinForm.css';

const join = async (name, email, password) => {
    const response = await fetch(`http://localhost:8080/users/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
      credentials: 'include'
    });
  
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      return data;
    } else {
      alert('회원가입 오류가 발생했습니다.');
      return null;
    }
};

const JoinForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        if (username === '' || email === '' || password === '') {
            setError('모든 필드를 입력해주세요.');
            return false;
        }
        
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError('유효한 이메일 주소를 입력해주세요.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (validateForm()) {
            const result = await join(username, email, password);
            if (result) {
                alert('회원 가입이 완료되었습니다.');
                navigate('/login');
            }
        }
    };

    return (
        <div className="wrapper">
            <div className="form-box">
                <form onSubmit={handleSubmit}>
                    <h1>회원 가입</h1>
                    <br/><br/>  
                    <div className="title">이름(별명)</div>
                    <div className="input-box">
                        <FaUser className='icon'/>
                        <input 
                            type="text" 
                            placeholder='username (nickname)' 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="title">ID(email)</div>
                    <div className="input-box">
                        <FaEnvelope className='icon'/>
                        <input 
                            type="text" 
                            placeholder='email@domain.com' 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    <div className="title">PASSWORD</div>
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

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit">가입하기</button>   

                    <div className="register-link">
                        <p>Already have an account? <Link to="/login" className="link-button">로그인하기</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default JoinForm;
