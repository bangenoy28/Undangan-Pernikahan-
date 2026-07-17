# Wedding-Invitation-Premium-v5.1

Undangan pernikahan digital — satu halaman, dapat di-install sebagai PWA,
bisa dibuka offline setelah kunjungan pertama.

## Fitur

- **Sampul amplop** dengan animasi buka undangan dan nama tamu dari URL (`?to=Nama+Tamu`)
- **Countdown** mundur menuju hari-H
- **Detail acara** (akad & resepsi) lengkap dengan peta lokasi
- **Galeri foto** dengan lightbox
- **Kisah cinta** dalam bentuk garis waktu
- **RSVP** + buku tamu (ucapan & doa) — tersimpan di localStorage browser tamu
- **Musik latar** yang bisa dimatikan/nyalakan
- **Amplop digital** (info rekening) untuk tanda kasih
- **Mode PWA**: bisa di-install ke home screen dan dibuka offline

## Struktur folder

```
index.html            Halaman utama
manifest.json          Metadata PWA
service-worker.js       Cache offline
config/config.json      Semua data yang bisa diedit (nama, tanggal, lokasi, dst.)
assets/css/              Semua stylesheet
assets/js/               Semua logic (per fitur, satu file per modul)
assets/images/           Foto galeri (isi sendiri)
assets/music/            Musik latar (isi sendiri)
assets/fonts/            Font lokal opsional
assets/icons/             Ikon PWA (192x192, 512x512)
docs/                     Panduan deploy & kustomisasi
```

## Mulai cepat

1. Edit `config/config.json` — ganti nama, tanggal, lokasi, cerita, dan info rekening.
2. Masukkan foto ke `assets/images/` dan musik ke `assets/music/`, sesuaikan nama file di `config.json`.
3. Buka `index.html` langsung di browser, atau lihat `docs/deployment.md` untuk publikasi online.

Lihat `docs/customization.md` untuk detail kustomisasi lebih lanjut.
