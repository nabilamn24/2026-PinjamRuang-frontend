import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Badge, Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

interface Peminjaman {
  id: number;
  namaPeminjam: string;
  ruangan: string;
  tanggalPeminjaman: string;
  keperluan: string;
  status: string;
}

const Dashboard = () => {
  const [peminjamans, setPeminjamans] = useState<Peminjaman[]>([]);
  
  // 1. State buat nyimpen kata kunci pencarian & filter status
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchPeminjamans();
  }, []);

  const fetchPeminjamans = async () => {
    try {
      const response = await axios.get("http://localhost:5043/api/peminjaman");
      setPeminjamans(response.data);
    } catch (error) {
      console.error("Gagal ambil data:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Yakin mau hapus data ini?")) {
      try {
        await axios.delete(`http://localhost:5043/api/peminjaman/${id}`);
        fetchPeminjamans();
      } catch (error) {
        alert("Gagal menghapus data!");
      }
    }
  };

  // 2. LOGIKA PENYARINGAN (FILTERING) 🔥
  // Kita bikin list baru bernama 'filteredData' yang isinya cuma data yang lolos seleksi
  const filteredData = peminjamans.filter((item) => {
    // A. Cek Status (Kalau 'All', lolos semua. Kalau gak, harus sama persis)
    const matchStatus = filterStatus === "All" || item.status === filterStatus;

    // B. Cek Kata Kunci (Nama ATAU Ruangan mengandung kata kunci)
    const matchSearch =
      item.namaPeminjam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ruangan.toLowerCase().includes(searchTerm.toLowerCase());

    // Data lolos kalau Status OK DAN Kata Kunci OK
    return matchStatus && matchSearch;
  });

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🗓️ Dashboard Peminjaman Ruang</h2>
        <Link to="/tambah" className="btn btn-success">
          + Tambah Peminjaman
        </Link>
      </div>

      {/* 3. UI PENCARIAN & FILTER */}
      <Row className="mb-3">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Cari nama peminjam atau ruangan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">Semua Status</option>
            <option value="Approved">🟢 Approved</option>
            <option value="Pending">🟡 Pending</option>
            <option value="Rejected">🔴 Rejected</option>
          </Form.Select>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>No</th>
            <th>Nama Peminjam</th>
            <th>Ruangan</th>
            <th>Tanggal</th>
            <th>Keperluan</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {/* 4. TAMPILKAN HASIL FILTER (Bukan 'peminjamans' asli) */}
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.namaPeminjam}</td>
                <td>{item.ruangan}</td>
                <td>{new Date(item.tanggalPeminjaman).toLocaleDateString("id-ID")}</td>
                <td>{item.keperluan}</td>
                <td>
                  <Badge
                    bg={
                      item.status === "Approved"
                        ? "success"
                        : item.status === "Rejected"
                        ? "danger"
                        : "warning"
                    }
                  >
                    {item.status}
                  </Badge>
                </td>
                <td className="text-center"> 
                  <div className="d-flex justify-content-center gap-2"> 
                    <Link to={`/edit/${item.id}`} className="btn btn-warning btn-sm">
                      ✏️ Edit
                    </Link>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
                      🗑️ Hapus
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center text-muted">
                🚫 Data tidak ditemukan
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default Dashboard;