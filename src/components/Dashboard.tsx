import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Alert, Spinner, Badge } from 'react-bootstrap';

// Ini tipe datanya, harus sama persis kayak di C# Backend kamu
interface Peminjaman {
  id: number;
  namaPeminjam: string;
  ruangan: string;
  tanggalPeminjaman: string;
  keperluan: string;
  status: string;
}

const Dashboard = () => {
  const [dataPeminjaman, setDataPeminjaman] = useState<Peminjaman[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Ini fungsi buat ambil data dari Backend
  useEffect(() => {
    axios.get('http://localhost:5043/api/peminjaman')
      .then((response) => {
        setDataPeminjaman(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal ambil data:", err);
        setError('Gagal mengambil data dari server. Pastikan backend nyala!');
        setLoading(false);
      });
  }, []);

  return (
    <Container className="mt-5">
      <h2 className="mb-4 fw-bold">📅 Dashboard Peminjaman Ruang</h2>
      
      <Link to="/tambah" className="btn btn-success mb-3">
        + Tambah Peminjaman
      </Link>

      {/* Kalau Error, munculin Alert Merah */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Kalau Loading, munculin Muter-muter */}
      {loading ? (
        <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Sedang memuat data...</p>
        </div>
      ) : (
        /* Kalau Sukses, munculin Tabel */
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>No</th>
              <th>Nama Peminjam</th>
              <th>Ruangan</th>
              <th>Tanggal</th>
              <th>Keperluan</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dataPeminjaman.length === 0 ? (
                <tr>
                    <td colSpan={6} className="text-center">Belum ada data peminjaman.</td>
                </tr>
            ) : (
                dataPeminjaman.map((item, index) => (
                <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.namaPeminjam}</td>
                    <td>{item.ruangan}</td>
                    <td>{new Date(item.tanggalPeminjaman).toLocaleDateString('id-ID')}</td>
                    <td>{item.keperluan}</td>
                    <td>
                        <Badge bg={item.status === 'Approved' ? 'success' : 'warning'}>
                            {item.status || 'Menunggu'}
                        </Badge>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Dashboard;