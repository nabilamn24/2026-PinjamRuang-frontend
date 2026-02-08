import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Alert, Spinner, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Interface data (Sesuaikan dengan Backend)
interface Peminjaman {
  id: number;
  namaPeminjam: string;
  ruangan: string;
  tanggalPeminjaman: string; // Pastikan ini sesuai sama Backend kamu
  keperluan: string;
  status: string;
}

const Dashboard = () => {
  const [dataPeminjaman, setDataPeminjaman] = useState<Peminjaman[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fungsi untuk mengambil data dari API
  const fetchData = () => {
    // Pastikan PORT backend benar (5043)
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
  };

  // Panggil data saat halaman pertama kali dibuka
  useEffect(() => {
    fetchData();
  }, []);

  // 2. Fungsi untuk MENGHAPUS data
  const handleDelete = async (id: number) => {
    // Tampilkan konfirmasi sebelum hapus
    if (window.confirm('Yakin mau hapus data ini?')) {
      try {
        await axios.delete(`http://localhost:5043/api/peminjaman/${id}`);
        alert('Data berhasil dihapus!');
        // Refresh data setelah berhasil hapus
        fetchData();
      } catch (err) {
        console.error("Gagal hapus data:", err);
        alert('Gagal menghapus data. Cek backend!');
      }
    }
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">📅 Dashboard Peminjaman Ruang</h2>
        {/* Tombol Tambah Data */}
        <Link to="/tambah" className="btn btn-success">
          + Tambah Peminjaman
        </Link>
      </div>
      
      {/* Alert jika ada error */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Loading State */}
      {loading ? (
        <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Sedang memuat data...</p>
        </div>
      ) : (
        /* Tabel Data */
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>No</th>
              <th>Nama Peminjam</th>
              <th>Ruangan</th>
              <th>Tanggal</th>
              <th>Keperluan</th>
              <th>Status</th>
              <th>Aksi</th> {/* Kolom baru untuk tombol Edit/Hapus */}
            </tr>
          </thead>
          <tbody>
            {dataPeminjaman.length === 0 ? (
                <tr>
                    <td colSpan={7} className="text-center">Belum ada data peminjaman.</td>
                </tr>
            ) : (
                dataPeminjaman.map((item, index) => (
                <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.namaPeminjam}</td>
                    <td>{item.ruangan}</td>
                    {/* Format Tanggal Indonesia */}
                    <td>{new Date(item.tanggalPeminjaman).toLocaleDateString('id-ID')}</td>
                    <td>{item.keperluan}</td>
                    <td>
                        {/* Badge Warna: Hijau jika Approved, Kuning jika Pending */}
                      <Badge bg={
                          item.status === 'Approved' ? 'success' :
                          item.status === 'Rejected' ? 'danger' :
                          'warning'
                      }>
                          
                        {item.status}
                      </Badge>
                    </td>
                    <td>
                      {/* Tombol Edit (Kuning) */}
                      <Link to={`/edit/${item.id}`} className="btn btn-sm btn-warning me-2">
                        ✏️ Edit
                      </Link>
                      
                      {/* Tombol Hapus (Merah) */}
                      <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => handleDelete(item.id)}
                      >
                        🗑️ Hapus
                      </Button>
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