import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Tables from './pages/Tables';
import Menu from './pages/Menu';
import NewOrder from './pages/NewOrder';
import Orders from './pages/Orders';
import Kitchen from './pages/Kitchen';
import Bill from './pages/Bill';
import Admin from './pages/Admin';
import Reports from './pages/Reports';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/tables" element={
              <PrivateRoute roles={['admin', 'waiter']}><Tables /></PrivateRoute>
            } />
            <Route path="/menu" element={
              <PrivateRoute roles={['admin', 'waiter']}><Menu /></PrivateRoute>
            } />
            <Route path="/orders/new/:tableId" element={
              <PrivateRoute roles={['admin', 'waiter']}><NewOrder /></PrivateRoute>
            } />
            <Route path="/orders" element={
              <PrivateRoute roles={['admin', 'waiter']}><Orders /></PrivateRoute>
            } />
            <Route path="/kitchen" element={
              <PrivateRoute roles={['admin', 'kitchen']}><Kitchen /></PrivateRoute>
            } />
            <Route path="/bill/:orderId" element={
              <PrivateRoute roles={['admin', 'waiter']}><Bill /></PrivateRoute>
            } />
            <Route path="/admin" element={
              <PrivateRoute roles={['admin']}><Admin /></PrivateRoute>
            } />
            <Route path="/reports" element={
              <PrivateRoute roles={['admin']}><Reports /></PrivateRoute>
            } />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;
