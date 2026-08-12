import  LoginPage  from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage.tsx'
import ProfilePage from './Pages/ProfilePage'
import LibraryPage from './Pages/LibraryPage'
import ShelfPage from './Pages/ShelfPage'
import StatsPage from './Pages/StatsPage'
import ReflectionsPage from './Pages/ReflectionsPage'
import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/library" element={<PrivateRoute><LibraryPage /></PrivateRoute>} />
      <Route path="/shelf" element={<PrivateRoute><ShelfPage /></PrivateRoute>} />
      <Route path="/stats" element={<PrivateRoute><StatsPage /></PrivateRoute>} />
      <Route path="/reflections" element={<PrivateRoute><ReflectionsPage /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
    </Routes>
  )
}

export default App
