import { Link } from 'react-router-dom'
import { formatTanggal } from '@/utils/format'

// Kartu catatan orang lain, dipakai di Jelajah dan Tersimpan.
// `children` = tombol tambahan di bagian bawah kartu.
function KartuCatatan({ catatan, children }) {
  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-md">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
          {catatan.mata_kuliah?.nama ?? 'Umum'}
        </span>
        {catatan.mata_kuliah?.semester && (
          <span className="text-xs text-slate-500">Semester {catatan.mata_kuliah.semester}</span>
        )}
      </div>

      <Link to={`/jelajah/${catatan.id}`} className="group block">
        <h2 className="line-clamp-2 break-words text-lg font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
          {catatan.judul}
        </h2>
      </Link>

      <p className="mt-2 line-clamp-3 whitespace-pre-line break-words text-sm text-slate-600">{catatan.isi}</p>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4 text-xs text-slate-500">
        <span>
          {catatan.penulis?.name} · {formatTanggal(catatan.created_at)}
        </span>
        {children}
      </div>
    </article>
  )
}

export default KartuCatatan
