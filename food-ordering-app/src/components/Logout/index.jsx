import React, { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';  
import { logoutUser } from '../../app/api/auth';
import { userLogout } from '../../app/features/Auth/action';

export default function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();  

  useEffect(() => {
    logoutUser()
      .then(() => dispatch(userLogout()))
      .then(() => navigate('/'));  // Gunakan navigate untuk berpindah halaman
  }, [dispatch, navigate]);  // Ganti history dengan navigate di array dependensi

  return (
    <div className="d-flex justify-content-center">
      <div className="text-center">
        <Spinner animation="grow" variant="danger" />
        <p className="text-muted">Logging out...</p>  {/* Perbaiki typo "Loging" menjadi "Logging" */}
      </div>
    </div>
  );
}
