import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TopBar from './components/TopBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { useEffect } from 'react';
import { listen } from './app/listener';
import { useSelector } from 'react-redux';
import Cart from './pages/Cart';
import Account from './pages/Account';
import Checkout from './pages/Checkout';
import Invoices from './pages/Invoices';
import AddAddress from './components/AddAddress'; // Pastikan path ini benar

function App() {
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    listen();
  }, []);

  return (
    <Router>
      <TopBar />
      <Routes>
        <Route path="/invoices/:id" element={<Invoices />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/account" element={<Account />} />
        <Route path="/account/address" element={<AddAddress />} /> {/* Rute untuk halaman AddAddress */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/login" 
          element={auth.user ? <Navigate to="/" /> : <Login />} 
        />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
