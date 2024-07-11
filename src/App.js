import React from 'react';
import LoginForm from './components/LoginForm/LoginForm';
import JoinForm from './components/JoinForm/JoinForm';
import MainPage from './components/MainPage/MainPage';
import MyPage from './components/MyPage/MyPage';
import MyPet from './components/MyPet/MyPet';
import CheckPage from './components/CheckPage/CheckPage';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { PetProvider } from './components/contexts/PetContext';

function App() {
  return (
    <PetProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />}></Route>
          <Route path="/join" element={<JoinForm />}></Route>
          <Route path="/calendar" element={<MainPage />}></Route>
          <Route path="/calendar/:id" element={<MainPage />}></Route>
          <Route path="/mypage" element={<MyPage />}></Route>
          <Route path="/pets/:id" element={<MyPet />}></Route>
          <Route path="/calendar/:id/daily/:date" element={<CheckPage />}></Route> {/* 수정된 경로 */}
        </Routes>
      </Router>
    </PetProvider>
  )
}

export default App;

