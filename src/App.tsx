import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { PersonalityLibraryPage } from './pages/PersonalityLibraryPage';
import { ComparePage } from './pages/ComparePage';
import { ShortlistPage } from './pages/ShortlistPage';
import { MonitorPage } from './pages/MonitorPage';
import { AdminPage } from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/personalities" element={<PersonalityLibraryPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/shortlist" element={<ShortlistPage />} />
        <Route path="/monitor" element={<MonitorPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
