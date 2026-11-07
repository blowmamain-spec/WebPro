// Penanda sementara: hapus komponen ini dari halaman begitu isinya sudah dibuat
function RencanaIsi({ children }) {
  return (
    <section className="kartu rencana">
      <p className="rencana-label">Masih kerangka. Rencana isi halaman ini:</p>
      <ul>{children}</ul>
    </section>
  )
}

export default RencanaIsi
