// Judul halaman. Tombol aksi (misal "Tambah Tugas") dikirim sebagai children:
// <PageHeader judul="..."><button>Tambah</button></PageHeader>
function PageHeader({ judul, deskripsi, children }) {
  return (
    <header className="page-header">
      <div>
        <h1>{judul}</h1>
        {deskripsi && <p>{deskripsi}</p>}
      </div>
      {children && <div className="page-header-aksi">{children}</div>}
    </header>
  )
}

export default PageHeader
