import  LoginPage  from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage.tsx'
import ProfilePage from './Pages/ProfilePage'
import LibraryPage from './Pages/LibraryPage'
import ShelfPage from './Pages/ShelfPage'
import StatsPage from './Pages/StatsPage'
import ReflectionsPage from './Pages/ReflectionsPage'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/library" element={<LibraryPage />} />
      <Route path="/shelf" element={<ShelfPage />} />
      <Route path="/stats" element={<StatsPage />} />
      <Route path="/reflections" element={<ReflectionsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  )
}

export default App
