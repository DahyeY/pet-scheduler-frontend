import React, { useState, useEffect, useContext } from 'react';
import './MyPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';
import cookie from 'react-cookies';


const getInformation = async () => {
  const response = await fetch(`http://13.124.35.7:8080/users/mypage`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'token': `${cookie.load('token')}`
    },
    credentials: 'include'
  });

  if (response.ok) {
    const data = await response.json();
    console.log(data);
    return data;
  } else {
    alert('마이페이지 접속 오류');
    return null;
  }
};

function MyPage() {
  const [userName, setUserName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [email, setEmail] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [pets, setPets] = useState([]);
  const [newPetName, setNewPetName] = useState('');
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [firstPetId, setFirstPetId] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getInformation();
      if (data) {
        setUserName(data.user_name);
        setEmail(data.email);
        setPets(data.pets);
        if (data.pets.length > 0) {
          setFirstPetId(Math.min(...data.pets.map(pet => pet.pet_id)));
        }
      }
    };

    fetchData();
  }, []);

  const handleEditName = () => {
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    setIsEditingName(false);
  };

  const handleNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handleEditEmail = () => {
    setIsEditingEmail(true);
  };

  const handleSaveEmail = () => {
    setIsEditingEmail(false);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleAddPet = () => {
    setIsAddingPet(true);
  };

  const handleSavePet = async () => {
    const response = await fetch(`http://13.124.35.7:8080/pets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': `${cookie.load('token')}`
      },
      body: JSON.stringify({ name: newPetName }),
      credentials: 'include'
    });

    if (response.ok) {
      const data = await response.json();
      const newPet = {
        pet_id: data.insertId,
        pet_name: newPetName,
      };
      console.log(newPet);
      setFirstPetId(prevFirstPetId => (prevFirstPetId === 0 || newPet.pet_id < prevFirstPetId) ? newPet.pet_id : prevFirstPetId);
      setPets([...pets, newPet]);
      setIsAddingPet(false);
      setNewPetName('');
    } else {
      alert('반려동물 추가 오류');
    }
  };

  const handlePetNameChange = (e) => {
    setNewPetName(e.target.value);
  };

  const handleRemovePet = async (id) => {
    console.log('삭제 id :', id);
    const response = await fetch(`http://13.124.35.7:8080/pets`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'token': `${cookie.load('token')}`
      },
      body: JSON.stringify({ pet_id: id }),
      credentials: 'include'
    });

    if (response.ok) {
      setPets(pets.filter(pet => pet.pet_id !== id));
      setFirstPetId(prevFirstPetId => (prevFirstPetId === id ? (pets.filter(pet => pet.pet_id !== id).reduce((minId, pet) => pet.pet_id < minId ? pet.pet_id : minId, 0)) : prevFirstPetId));
    } else {
      alert('반려동물 삭제 오류');
    }
  };

  const handleCalendarClick = () => {
    if (firstPetId === 0) {
      alert('첫번째 반려동물을 추가해주세요.');
    } else {
      navigate(`/calendar/${firstPetId}`);
    }
  };

  return (
    <div className="my-page">
      <header className="header">
        <span className="back-arrow" onClick={handleCalendarClick}><FaCalendarAlt /> </span>
        <span className="header-title">마이페이지</span>
      </header>
      <div className="content">
        <div className="item">
          <span className="label">이름</span>
          {isEditingName ? (
            <>
              <input
                className="input-field"
                value={userName}
                onChange={handleNameChange}
              />
              <button className="save-button" onClick={handleSaveName}>저장</button>
            </>
          ) : (
            <>
              <span className="value">{userName}</span>
              <button className="edit-button" onClick={handleEditName}>수정</button>
            </>
          )}
        </div>
        <div className="item">
          <span className="label">Email</span>
          {isEditingEmail ? (
            <>
              <input
                className="input-field"
                value={email}
                onChange={handleEmailChange}
              />
              <button className="save-button" onClick={handleSaveEmail}>저장</button>
            </>
          ) : (
            <>
              <span className="value">{email}</span>
              <button className="edit-button" onClick={handleEditEmail}>수정</button>
            </>
          )}
        </div>

        <div className="pet-container">
          <span className="label">나의 반려동물</span>
            <div>
            {pets.map((pet, index) => (
              <div key={index} className="pet-item">
                <span className="value">{pet.pet_name}</span>
                <Link to={`/pets/${pet.pet_id}`} className="setting-link">설정</Link>
                <button className="delete-button" onClick={() => handleRemovePet(pet.pet_id)}>삭제</button>
              </div>
            ))}
        {isAddingPet ? (
          <div className="item">
            <input
              className="input-field"
              value={newPetName}
              onChange={handlePetNameChange}
              placeholder="반려동물 이름"
              />
            <button className="save-button" onClick={handleSavePet}>저장</button>
          </div>
        ) : (
          <button className="add-button" onClick={handleAddPet}>+ 추가하기</button>
        )}
      </div>
    </div>
        </div>
    </div>
  );
}

export default MyPage;
