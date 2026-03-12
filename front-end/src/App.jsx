import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/verify';
import SelectRole from './pages/SelectRole';
import SelfIntro from './pages/SelfIntro';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/select-role" element={<SelectRole />} />
      <Route path="/self-intro" element={<SelfIntro />} />
    </Routes>
  )
}

export default App;
