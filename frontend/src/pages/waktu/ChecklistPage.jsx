import { useState } from 'react'
import PageHeader from '@/components/PageHeader'
import { useMuatData } from '@/hooks/useMuatData'
import {
  ambilDaftarChecklist,
  buatChecklist,
  hapusChecklist,
  tambahItem,
  ubahItem,
  hapusItem,
} from '@/api/checklist'

// Backend Laravel bisa membungkus jawaban dalam { data: ... }, data palsu tidak.
const bukaData = (hasil) => hasil?.data ?? hasil

// Hitung persen materi yang sudah selesai
function hitungProgress(items) {
  if (items.length === 0) return 0
  const selesai = items.filter((item) => item.selesai).length
  return Math.round((selesai / items.length) * 100)
}

// Lingkaran persentase (SVG)
function CincinProgress({ persen }) {
  const radius = 28
  const keliling = 2 * Math.PI * radius

  return (
    <div className={`cl-ring ${persen === 100 ? 'cl-ring-penuh' : ''}`}>
      <svg viewBox="0 0 70 70" aria-hidden="true">
        <circle className="cl-ring-latar" cx="35" cy="35" r={radius} />
        <circle
          className="cl-ring-isi"
          cx="35"
          cy="35"
          r={radius}
          strokeDasharray={keliling}
          strokeDashoffset={keliling * (1 - persen / 100)}
        />
      </svg>
      <span>{persen}%</span>
    </div>
  )
}

// Kotak isian kecil dengan tombol Simpan / Batal. Dipakai untuk
// "Tambah Pembelajaran" dan "Tambah materi".
function FormIsian({ placeholder, onSimpan, onBatal, kecil = false }) {
  const [nilai, setNilai] = useState('')
  const [menyimpan, setMenyimpan] = useState(false)

  async function kirim(e) {
    e.preventDefault()
    const bersih = nilai.trim()
    if (!bersih || menyimpan) return
    setMenyimpan(true)
    await onSimpan(bersih)
    setMenyimpan(false)
  }

  return (
    <form className={`cl-form ${kecil ? 'cl-form-kecil' : ''}`} onSubmit={kirim}>
      <input
        autoFocus
        value={nilai}
        placeholder={placeholder}
        maxLength={80}
        onChange={(e) => setNilai(e.target.value)}
        onKeyDown={(e) => e.key === 'Escape' && onBatal()}
      />
      <button type="submit" className="cl-form-simpan" disabled={!nilai.trim() || menyimpan}>
        Simpan
      </button>
      <button type="button" className="cl-form-batal" onClick={onBatal}>
        Batal
      </button>
    </form>
  )
}

function ChecklistPage() {
  const { data, memuat, error, setData } = useMuatData(() => ambilDaftarChecklist(), [])
  const checklists = bukaData(data) ?? []

  const [pesanError, setPesanError] = useState('')
  const [formBaru, setFormBaru] = useState(false) // form "Tambah Pembelajaran" terbuka?
  const [itemBaruDi, setItemBaruDi] = useState(null) // id checklist yang sedang tambah materi

  // Ubah satu checklist di layar tanpa memuat ulang seluruh daftar
  function ubahChecklist(id, ubah) {
    setData((lama) => bukaData(lama).map((c) => (c.id === id ? ubah(c) : c)))
  }

  function tampilkanError(e, cadangan) {
    setPesanError(e?.message || cadangan)
  }

  async function handleBuatChecklist(judul) {
    try {
      const baru = bukaData(await buatChecklist({ judul }))
      setData((lama) => [...bukaData(lama), { ...baru, items: baru.items ?? [] }])
      setFormBaru(false)
      setPesanError('')
    } catch (e) {
      tampilkanError(e, 'Gagal membuat pembelajaran.')
    }
  }

  async function handleTambahItem(checklistId, isi) {
    try {
      const item = bukaData(await tambahItem(checklistId, isi))
      ubahChecklist(checklistId, (c) => ({ ...c, items: [...c.items, item] }))
      setPesanError('')
      // Form tetap terbuka supaya bisa langsung mengetik materi berikutnya
    } catch (e) {
      tampilkanError(e, 'Gagal menambahkan materi.')
    }
  }

  // Centang langsung berubah di layar (optimistic), dikembalikan kalau gagal
  async function handleToggleItem(checklistId, item) {
    const selesaiBaru = !item.selesai
    const setSelesai = (nilai) =>
      ubahChecklist(checklistId, (c) => ({
        ...c,
        items: c.items.map((i) => (i.id === item.id ? { ...i, selesai: nilai } : i)),
      }))

    setSelesai(selesaiBaru)
    try {
      await ubahItem(item.id, { selesai: selesaiBaru })
    } catch (e) {
      setSelesai(item.selesai)
      tampilkanError(e, 'Gagal mengubah status materi.')
    }
  }

  async function handleHapusItem(checklistId, itemId) {
    try {
      await hapusItem(itemId)
      ubahChecklist(checklistId, (c) => ({ ...c, items: c.items.filter((i) => i.id !== itemId) }))
    } catch (e) {
      tampilkanError(e, 'Gagal menghapus materi.')
    }
  }

  async function handleHapusChecklist(id) {
    try {
      await hapusChecklist(id)
      setData((lama) => bukaData(lama).filter((c) => c.id !== id))
    } catch (e) {
      tampilkanError(e, 'Gagal menghapus pembelajaran.')
    }
  }

  return (
    <div className="cl-page min-h-full space-y-6 bg-slate-50 p-4 text-slate-800 sm:p-6 lg:p-8">
      <PageHeader judul="Checklist Belajar" deskripsi="Membantu mempermudah kamu dalam belajar">
        {formBaru ? (
          <FormIsian
            placeholder="Nama pembelajaran, misal UTS PBO"
            onSimpan={handleBuatChecklist}
            onBatal={() => setFormBaru(false)}
          />
        ) : (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            onClick={() => setFormBaru(true)}
          >
            Tambah Pembelajaran
          </button>
        )}
      </PageHeader>

      {(pesanError || error) && (
        <p className="cl-error pesan-error" role="alert">
          {pesanError || error.message || 'Gagal memuat data.'}
          {pesanError && (
            <button type="button" onClick={() => setPesanError('')} aria-label="Tutup pesan">
              ×
            </button>
          )}
        </p>
      )}

      {memuat ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Memuat data pembelajaran...
        </div>
      ) : checklists.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-sm font-medium text-slate-700">Belum ada pembelajaran</p>
          <p className="mt-1 text-sm text-slate-500">
            Klik Tambah Pembelajaran untuk mulai mencatat materi yang perlu dipelajari.
          </p>
        </div>
      ) : (
        <div className="cl-grid">
          {checklists.map((checklist) => {
            const items = checklist.items ?? []
            const persen = hitungProgress(items)

            return (
              <section className="cl-kartu" key={checklist.id}>
                <div className="cl-kartu-judul">
                  <h3 title={checklist.judul}>{checklist.judul}</h3>
                  <button
                    type="button"
                    className="cl-hapus-kartu"
                    title="Hapus pembelajaran"
                    aria-label={`Hapus pembelajaran ${checklist.judul}`}
                    onClick={() => handleHapusChecklist(checklist.id)}
                  >
                    ×
                  </button>
                </div>

                <div className="cl-kartu-isi">
                  <div className="cl-daftar">
                    {items.map((item) => (
                      <div className="cl-item" key={item.id}>
                        <input
                          type="checkbox"
                          id={`item-${item.id}`}
                          checked={Boolean(item.selesai)}
                          onChange={() => handleToggleItem(checklist.id, item)}
                        />
                        <label htmlFor={`item-${item.id}`}>{item.isi}</label>
                        <button
                          type="button"
                          className="cl-hapus-item"
                          title="Hapus materi"
                          aria-label={`Hapus materi ${item.isi}`}
                          onClick={() => handleHapusItem(checklist.id, item.id)}
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    {items.length === 0 && itemBaruDi !== checklist.id && (
                      <p className="cl-belum-ada-materi">Belum ada materi</p>
                    )}

                    {itemBaruDi === checklist.id ? (
                      <FormIsian
                        kecil
                        placeholder="Nama materi"
                        onSimpan={(isi) => handleTambahItem(checklist.id, isi)}
                        onBatal={() => setItemBaruDi(null)}
                      />
                    ) : (
                      <button
                        type="button"
                        className="cl-tambah-materi"
                        onClick={() => setItemBaruDi(checklist.id)}
                      >
                        + Tambah materi
                      </button>
                    )}
                  </div>

                  <div className="cl-progress">
                    <CincinProgress persen={persen} />
                  </div>
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ChecklistPage