import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePeminjaman = () => {
  // State Data
  const [namaPeminjam, setNamaPeminjam] = useState('');
  const [ruangan, setRuangan] = useState('');
  const [tanggalPeminjaman, setTanggalPeminjaman] = useState('');
  const [keperluan, setKeperluan] = useState('');
  
  // State Error & Loading
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(''); 
    setLoading(true);

    const dataBaru = {
      namaPeminjam,
      ruangan,
      tanggalPeminjaman,
      keperluan,
      status: 'Pending'
    };

    try {
      // Pastikan URL Backend bener (port 5043)
      await axios.post('http://localhost:5043/api/peminjaman', dataBaru);
      alert('Berhasil menambah data!');
      navigate('/'); 
    } catch (err: any) {
      console.error("Error:", err);
      
      let pesan = "Gagal menyimpan data.";

      if (err.response && err.response.data) {
        const data = err.response.data;

        // 1. Cek Error Validasi ASP.NET (Yang bentuknya object "errors")
        if (data.errors) {
          // Ambil value error-nya aja, terus gabungin jadi kalimat
          // Contoh: "Keperluan minimal 10 karakter ya."
          const errorList = Object.values(data.errors).flat();
          pesan = errorList.join(", ");
        } 
        // 2. Cek Error Manual (biasanya property 'message')
        else if (data.message) {
          pesan = data.message;
        }
        // 3. Cek kalau backend ngirim teks mentah doang
        else if (typeof data === 'string') {
          pesan = data;
        }
      }
      
      setError(pesan);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>➕ Tambah Peminjaman</h2>
        <Button variant="secondary" onClick={() => navigate('/')}>Kembali</Button>
      </div>
      
      {/* Alert Error */}
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      <Form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <Form.Group className="mb-3">
          <Form.Label>Nama Peminjam</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Contoh: Nabila" 
            value={namaPeminjam}
            onChange={(e) => setNamaPeminjam(e.target.value)}
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ruangan</Form.Label>
          <Form.Select 
            value={ruangan}
            onChange={(e) => setRuangan(e.target.value)}
            required
          >
            <option value="">-- Pilih Ruangan --</option>
            <option value="Lab APD">Lab APD</option>
            <option value="Teater D3">Teater D3</option>
            <option value="Auditorium">Auditorium</option>
            <option value="Sekretariat Bersama">Sekretariat Bersama</option>
            <option value="Student Center">Student Center</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tanggal Peminjaman</Form.Label>
          <Form.Control 
            type="date" 
            value={tanggalPeminjaman}
            onChange={(e) => setTanggalPeminjaman(e.target.value)}
            required 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Keperluan</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={3} 
            value={keperluan}
            onChange={(e) => setKeperluan(e.target.value)}
            required 
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Data'}
        </Button>
      </Form>
    </Container>
  );
};

export default CreatePeminjaman;