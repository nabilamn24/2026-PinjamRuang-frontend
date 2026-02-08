import { useEffect, useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditPeminjaman = () => {
  const { id } = useParams(); // Ambil ID dari URL
  const navigate = useNavigate();

  // State buat nampung data form
  const [namaPeminjam, setNamaPeminjam] = useState('');
  const [ruangan, setRuangan] = useState('');
  const [tanggalPeminjaman, setTanggalPeminjaman] = useState('');
  const [keperluan, setKeperluan] = useState('');
  const [status, setStatus] = useState('');

  const [error, setError] = useState('');

  // 1. PAS HALAMAN DIBUKA, AMBIL DATA LAMA
  useEffect(() => {
    axios.get(`http://localhost:5043/api/peminjaman/${id}`)
      .then((response) => {
        const data = response.data;
        setNamaPeminjam(data.namaPeminjam);
        setRuangan(data.ruangan);
        // Format tanggal biar bisa masuk ke input type="date" (Ambil YYYY-MM-DD nya aja)
        setTanggalPeminjaman(data.tanggalPeminjaman.split('T')[0]); 
        setKeperluan(data.keperluan);
        setStatus(data.status);
      })
      .catch((err) => {
        console.error(err);
        setError('Gagal mengambil data lama.');
      });
  }, [id]);

  // 2. PAS TOMBOL UPDATE DIKLIK
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataUpdate = {
      id: parseInt(id!), // Pastikan ID dikirim sebagai angka
      namaPeminjam,
      ruangan,
      tanggalPeminjaman,
      keperluan,
      status
    };

    try {
      await axios.put(`http://localhost:5043/api/peminjaman/${id}`, dataUpdate);
      alert('Data berhasil diupdate!');
      navigate('/'); // Balik ke Dashboard
    } catch (err) {
      console.error(err);
      setError('Gagal mengupdate data. Cek backend!');
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">✏️ Edit Peminjaman</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleUpdate}>
        <Form.Group className="mb-3">
          <Form.Label>Nama Peminjam</Form.Label>
          <Form.Control 
            type="text" 
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

        <Form.Group className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </Form.Select>
        </Form.Group>

        <Button variant="warning" type="submit">
          Update Data
        </Button>
        <Button variant="secondary" className="ms-2" onClick={() => navigate('/')}>
          Batal
        </Button>
      </Form>
    </Container>
  );
};

export default EditPeminjaman;