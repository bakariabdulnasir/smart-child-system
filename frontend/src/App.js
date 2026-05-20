import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChildrenProvider } from './context/ChildrenContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Schedule from './pages/Schedule';
import Tasks from './pages/Tasks';
import Family from './pages/Family';
import ChildDetail from './pages/ChildDetail';
import AdminDashboard from './pages/AdminDashboard';
import Amenities from './pages/Amenities';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChildrenProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/family" element={<ProtectedRoute><Family /></ProtectedRoute>} />
<Route path="/child/:id" element={<ProtectedRoute><ChildDetail /></ProtectedRoute>} />
          <Route path="/amenities" element={<ProtectedRoute><Amenities /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
<Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
        </ChildrenProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
