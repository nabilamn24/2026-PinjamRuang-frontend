import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CreatePeminjaman from './components/CreatePeminjaman';

function App() {
  return (
    <BrowserRouter>
      {/* Navbar Tetap Muncul di Semua Halaman */}
      <nav className="navbar navbar-dark bg-primary mb-4 px-4">
        <span className="navbar-brand mb-0 h1">PinjamRuang App 🏢</span>
      </nav>

      {/* Area yang Berubah-ubah */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tambah" element={<CreatePeminjaman />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App