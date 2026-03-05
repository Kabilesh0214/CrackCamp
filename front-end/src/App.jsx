import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Verify from './pages/verify';
import SelectRole from './pages/select-role';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/select-role" element={<SelectRole />} />
    </Routes>
  )
}

export default App;
