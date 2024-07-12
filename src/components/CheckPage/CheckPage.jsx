import React, { useState, useEffect } from 'react';
import './CheckPage.css';
import { useParams, Link } from 'react-router-dom';

const getInformation = async (pet_id, date) => {
  const response = await fetch(`http://13.124.35.7:8080/calendar/${pet_id}/daily/${date}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    alert('체크페이지 접속 오류');
    return null;
  }
};

const CheckPage = () => {
  const { date: dateString, id: paramId } = useParams();
  const [date, setDate] = useState(new Date(dateString));
  const [todos, setTodos] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [newScheduleTitle, setNewScheduleTitle] = useState('');
  const [petId, setPetId] = useState(parseInt(paramId));

  useEffect(() => {
    const fetchData = async () => {
      const data = await getInformation(petId, dateString);
      if (data) {
        setTodos(data.todos);
        setSchedule(data.schedule);
      }
    };

    fetchData();
  }, [petId, dateString]);

  const handleCheckboxChange = async (todo_id, pet_id, date, completed) => {
    const method = completed ? 'DELETE' : 'POST';
    const response = await fetch(`http://13.124.35.7:8080/calendar/${pet_id}/todos`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ daily_todo_id: todo_id, date: date }),
      credentials: 'include'
    });

    if (response.ok) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === todo_id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } else {
      alert('체크박스 상태 변경 실패');
    }
  };

  const handleAddSchedule = async (pet_id, date) => {
    if (newScheduleTitle.trim()) {
      const response = await fetch(`http://13.124.35.7:8080/calendar/${pet_id}/schedules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newScheduleTitle, date: date }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        const newItem = { 
          id : data.insertId,
          schedule_title: newScheduleTitle,
          completed: 0
        };
        console.log(newItem);
        setSchedule([...schedule, newItem]);
        setNewScheduleTitle('')
      } else {
        alert('일정 추가 실패');
      }
    }
  };

  const handleRemoveSchedule = async (pet_id, schedule_id) => {
    const response = await fetch(`http://13.124.35.7:8080/calendar/${petId}/schedules`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ schedule_id }),
      credentials: 'include'
    });

    if (response.ok) {
      setSchedule((prevSchedule) => prevSchedule.filter((item) => item.id !== schedule_id));
    } else {
      alert('일정 삭제 실패');
    }
  };

  const formattedDate = date.toISOString().split('T')[0]; // Date 객체를 문자열로 변환

  return (
    <div className="check-page">
      <header className="header">
        <Link to={`/calendar/${petId}`}><span className="back-arrow">←</span></Link>
        <span className="header-title">체크 페이지</span>
      </header>
      <div className="content">
        <h2 className="formatted-date">{formattedDate}</h2>
        <div className="goals">
          {todos.length === 0 ? (
            <p>하루 목표를 불러오는 중...</p>
          ) : (
            todos.map((todo, index) => (
              <div key={todo.id} className={`todo ${todo.completed ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleCheckboxChange(todo.id, petId, formattedDate, todo.completed)}
                />
                <span className={`goal-color ${todo.color}`}></span>
                <span className="goal-text">{todo.todo_title}</span>
              </div>
            ))
          )}
        </div>
        <div className="schedule">
          <div className="schedule-title">오늘의 일정</div>
          {schedule.map((item, index) => (
            <div key={item.id} className="schedule-item">
              <span>{index + 1}. {item.schedule_title}</span>
              <button className="remove-schedule" onClick={() => handleRemoveSchedule(petId, item.id)}>−</button>
            </div>
          ))}
          <div className="add-schedule">
            <input
              className="input-field"
              value={newScheduleTitle}
              onChange={(e) => setNewScheduleTitle(e.target.value)}
              placeholder="일정 추가"
            />
            <button className="add-button" onClick={() => handleAddSchedule(petId, formattedDate)}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckPage;
