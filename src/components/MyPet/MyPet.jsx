import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MyPet.css';
import cookie from 'react-cookies';


const getInformation = async (pet_id) => {
  const response = await fetch(`http://13.124.35.7:8080/pets/${pet_id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'token': `${cookie.load('token')}`
    },
    credentials: 'include'
  });

  if (response.ok) {
    const data = await response.json();
    console.log("조회", data);
    return data;
  } else {
    alert('반려동물 설정 페이지 접속 오류');
    window.location.href = '/';
    return null;
  }
};

function MyPet() {
  const navigate = useNavigate();
  const { id: pet_id } = useParams();

  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState('yellow');
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchPetData = async () => {
      const data = await getInformation(pet_id);
      if (data) {
        setName(data.name);
        setTodos(data.daily_todo);
        setLoading(false);
      }
    };
    fetchPetData();
  }, [pet_id]); // 의존성 배열에 pet_id 추가

  if (loading) {
    return <div>로딩 중...</div>;
  }

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTodo = async (pet_id, title, color) => {
    const response = await fetch(`http://13.124.35.7:8080/pets/todo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': `${cookie.load('token')}`

      },
      body: JSON.stringify({ pet_id, title, color }),
      credentials: 'include'
    });
    console.log(response);

    if (response.ok) {
      const data = await response.json();
      const newItem = { 
        todo_id : data.insertId,
        title,
        color
      };
      setTodos([...todos, newItem]);
      setNewTodoTitle('');
    } else {
      alert('할 일을 추가하는 데 실패했습니다.');
    }
  };

  const handleRemoveTodo = async (pet_id, todo_id) => {
    const response = await fetch(`http://13.124.35.7:8080/pets/todo`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'token': `${cookie.load('token')}`

      },
      body: JSON.stringify({ pet_id, todo_id }),
      credentials: 'include'
    });

    if (response.ok) {
      setTodos(todos.filter(todo => todo.todo_id !== todo_id));
    } else {
      alert('할 일을 삭제하는 데 실패했습니다.');
    }
  };

  const handleGoalTextChange = (e) => {
    setNewTodoTitle(e.target.value);
  };

  const handleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div className="my-page">
      <header className="header">
        <span className="back-arrow" onClick={handleBackClick}>←</span>
        <span className="header-title">{name}</span>
      </header>
      <div className="content">
        <div className="profile-section">
          <span className="profile-label">프로필사진</span>
          <label htmlFor="profileImageInput" className="profile-image-container">
            {/* <img
              src={profileImage || "https://via.placeholder.com/150"}
              alt="프로필 사진"
              className="profile-image"
            /> */}
            <input
              id="profileImageInput"
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              style={{ display: 'none' }}
            />
          </label>
        </div>
        <div className="item">
          <span className="label">하루 목표</span>
        </div>
        <div className="goals-list">
          {todos.map((todo, index) => (
            <div key={index} className="goal-item">
              <span className={`goal-color ${todo.color}`}></span>
              <span className="goal-text">{todo.title}</span>
              <button className="remove-button" onClick={() => handleRemoveTodo(pet_id, todo.todo_id)}>−</button>
            </div>
          ))}
        </div>
        <div className="add-goal">
          <input
            className="goal-input"
            placeholder="목표 이름"
            value={newTodoTitle}
            onChange={handleGoalTextChange}
          />
          <div className="color-options">
            {['yellow', 'pink', 'purple', 'green', 'blue'].map((color) => (
              <span
                key={color}
                className={`color ${color} ${selectedColor === color ? 'selected' : ''}`}
                onClick={() => setSelectedColor(color)}
              ></span>
            ))}
          </div>
          <button className="add-button" onClick={() => handleAddTodo(pet_id, newTodoTitle, selectedColor)}>+ 추가하기</button>
        </div>
      </div>
    </div>
  );
}

export default MyPet;
