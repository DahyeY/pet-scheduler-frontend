import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './MainPage.css';

// Fetch information data from the backend
const getInformation = async (pet_id, year, month) => {
  const response = await fetch(`http://localhost:8080/calendar/${pet_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ year, month }),
    credentials: 'include'
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    alert('메인페이지 접속 오류');
    return null;
  }
};

const MainPage = () => {
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState(null);
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [todoLog, setTodoLog] = useState([]);

  const { id } = useParams();
  const pet_id = parseInt(id);
  const navigate = useNavigate();

  const fetchData = async (pet_id, year, month) => {
    const data = await getInformation(pet_id, year, month);
    if (data) {
      setData(data);
      setPets(data.pets);
      setSelectedPetId(data.selected_pet_id);
      setSchedule(data.schedule);
      setTodoLog(data.todo_log);
    }
  };

  useEffect(() => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    fetchData(pet_id, year, month);
  }, [pet_id, date]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    navigate(`/calendar/${selectedPetId}/daily/${newDate.toISOString().split('T')[0]}`);
  };

  const handlePetClick = (id) => {
    setSelectedPetId(id);
    console.log(id);
    navigate(`/calendar/${id}`);
  };

  const handleActiveStartDateChange = ({ activeStartDate }) => {
    const year = activeStartDate.getFullYear();
    const month = activeStartDate.getMonth() + 1;
    fetchData(pet_id, year, month);
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <header className="header">
        <div className="profile">
          {pets.map((pet) => (
            <div key={pet.id} className="profile-item" onClick={() => handlePetClick(pet.id)}>
              {/* <img src={pet.image} alt={pet.name} className="profile-image" /> */}
              <div className="profile-name">{pet.name}</div>
            </div>
          ))}
        </div>
        <Link to="/mypage"><button className="my-page-button">마이페이지</button></Link>
      </header>
      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={date}
          locale="en-KR"
          nextLabel=">"
          prevLabel="<"
          next2Label={null}
          prev2Label={null}
          onActiveStartDateChange={handleActiveStartDateChange}
          formatShortWeekday={(locale, date) =>
            ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
          }
          tileContent={({ date, view }) => {
            if (view === 'month' && selectedPetId) {
              const dateString = date.toISOString().split('T')[0];
              const scheduleDates = schedule.filter(sch => sch.schedule_date === dateString);
              const todoLogDates = todoLog.filter(todo => todo.completed_at === dateString);

              return (
                <div className="tile-content">
                  {scheduleDates.map((sch, index) => (
                    <span key={index} className="schedule-dot red-dot"></span>
                  ))}
                  {todoLogDates.map((todo, index) => (
                    <span key={index} className="schedule-dot" style={{ backgroundColor: todo.color }}></span>
                  ))}
                </div>
              );
            }
            return null;
          }}
          tileClassName={({ date, view }) => {
            if (view === 'month') {
              const day = date.getDay();
              if (day === 0) return 'sunday';
              if (day === 6) return 'saturday';
            }
            return null;
          }}
        />
      </div>
    </div>
  );
};

export default MainPage;