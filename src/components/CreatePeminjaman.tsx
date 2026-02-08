import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePeminjaman = () => {
  const [namaPeminjam, setNamaPeminjam] = useState('');
  const [ruangan, setRuangan] = useState('');
  const [tanggalPeminjaman, setTanggalPeminjaman] = useState('');
  const [keperluan, setKeperluan] = useState('');
  
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Buat pindah halaman otomatis

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Biar gak reload halaman

    const dataBaru = {
      namaPeminjam,
      ruangan,
      tanggalPeminjaman,
      keperluan,
      status: 'Pending' // Default status
    };

    try {
      await axios.post('http://localhost:5043/api/peminjaman', dataBaru);
      alert('Berhasil menambah data!');
      navigate('/'); // Balik ke Dashboard setelah sukses
    } catch (err) {
      console.error(err);
      setError('Gagal menyimpan data. Cek backend!');
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">➕ Tambah Peminjaman Baru</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nama Peminjam</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Masukkan nama..." 
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
            <option value="">Pilih Ruangan...</option>
            <option value="Aula Utama">Aula Utama</option>
            <option value="Lab Komputer 1">Lab Komputer 1</option>
            <option value="Ruang Rapat">Ruang Rapat</option>
            <option value="Studio Musik">Studio Musik</option>
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

        <Button variant="primary" type="submit">
          Simpan Data
        </Button>
        <Button variant="secondary" className="ms-2" onClick={() => navigate('/')}>
          Batal
        </Button>
      </Form>
    </Container>
  );
};

export default CreatePeminjaman;