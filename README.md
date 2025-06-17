# EcoTerra - Aplikasi Pembelajaran Ekosistem

EcoTerra adalah aplikasi pembelajaran ekosistem yang menghubungkan guru, murid, dan masyarakat umum dalam platform pembelajaran yang interaktif dan ramah lingkungan.

## Fitur Utama

### Manajemen Kelas
- Kode kelas unik 8 karakter
- Sistem pendaftaran murid
- Manajemen materi dan kuis
- Papan peringkat per kelas

### Materi Pembelajaran
- Format: PDF, gambar, video, embed
- Batas ukuran: 10MB per file
- Kategorisasi materi
- Progress tracking

### Kuis
- Tipe: Pilihan ganda, esai
- Timer per kuis
- Sistem penilaian otomatis
- Review jawaban

### Forum Diskusi
- Forum umum untuk masyarakat
- Forum kelas untuk guru dan murid
- Fitur: komentar, like, share
- Notifikasi interaksi

### Notifikasi
- Notifikasi sistem
- Notifikasi interaksi
- Notifikasi kuis dan materi baru
- Pengaturan preferensi notifikasi

## Teknologi

### Frontend
- React Native + Expo
- React Navigation
- Zustand untuk state management
- Expo Blur untuk efek visual
- Linear Gradient untuk UI modern

### Backend
- Supabase Auth untuk Otentikasi Pengguna
- Supabase Database (PostgreSQL) sebagai Database Utama
- Supabase Storage untuk Penyimpanan File
- Supabase Edge Functions untuk Logika Sisi Server dan Notifikasi

## Aktor Pengguna

### Super Admin
- Mengelola data institusi sekolah dan domain email
- Mengatur akses dan perizinan
- Memantau aktivitas sistem

### Guru
- Mendaftar dengan email domain sekolah terverifikasi
- Membuat dan mengelola kelas (kode unik 8 karakter)
- Membuat materi pembelajaran (PDF, gambar, video, embed)
- Membuat dan mengelola kuis (pilihan ganda, esai)
- Mengatur timer kuis
- Memantau progress murid
- Berinteraksi di forum kelas

### Murid
- Didaftarkan oleh guru dengan kode kelas
- Mengakses materi pembelajaran
- Mengerjakan kuis dengan timer
- Melihat papan peringkat per kelas
- Berinteraksi di forum kelas

### Masyarakat Umum
- Akses ke materi umum
- Berpartisipasi di forum umum
- Melihat konten edukatif

## Palet Warna
- Primary: #1A788E
- Secondary: #0A363F
- Accent: #E1E0C0, #A7A691, #ECEAC9

## Roadmap
- [ ] Implementasi sistem verifikasi email sekolah
- [ ] Pengembangan fitur kuis dengan timer
- [ ] Integrasi sistem notifikasi (menggunakan Supabase Functions)
- [ ] Pengembangan forum diskusi
- [ ] Implementasi papan peringkat
- [ ] Optimasi performa dan keamanan

## Cara Menjalankan Proyek

### Prasyarat
- Node.js dan npm/yarn
- Expo CLI
- Akun Supabase

### Langkah Instalasi
1. Clone repositori
```
git clone https://github.com/username/ecoterra.git
cd ecoterra
```

2. Instal dependensi
```
npm install
```

3. Konfigurasi Supabase
   - Buat file `.env` di root proyek
   - Tambahkan konfigurasi Supabase:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Jalankan aplikasi
```
npm start
```

## Struktur Database

### Tabel Profiles
- id (PK)
- email
- role ('super_admin', 'teacher', 'student', 'public')
- full_name
- avatar_url
- school_id (FK)
- created_at

### Tabel Schools
- id (PK)
- name
- address
- created_at

### Tabel School_Domains
- id (PK)
- school_id (FK)
- domain
- created_at

### Tabel Classes
- id (PK)
- name
- description
- code (8 karakter unik)
- teacher_id (FK)
- created_at

### Tabel Class_Members
- id (PK)
- class_id (FK)
- user_id (FK)
- role ('teacher', 'student')
- joined_at

### Tabel Materials
- id (PK)
- title
- description
- type ('pdf', 'image', 'video', 'embed')
- content_url
- class_id (FK)
- created_at

### Tabel Quizzes
- id (PK)
- title
- description
- class_id (FK)
- duration (dalam menit)
- created_at

### Tabel Quiz_Questions
- id (PK)
- quiz_id (FK)
- question
- type ('multiple_choice', 'essay')
- options (array, untuk pilihan ganda)
- correct_answer (untuk pilihan ganda)
- points
- created_at

### Tabel Quiz_Answers
- id (PK)
- student_id (FK)
- quiz_id (FK)
- question_id (FK)
- answer
- is_correct (boolean)
- score
- submitted_at

### Tabel Forum_Posts
- id (PK)
- title
- content
- user_id (FK)
- class_id (FK, null untuk forum umum)
- created_at

### Tabel Forum_Comments
- id (PK)
- post_id (FK)
- user_id (FK)
- content
- created_at

### Tabel Notifications
- id (PK)
- user_id (FK)
- title
- message
- type ('system', 'class', 'quiz', 'forum')
- reference_id
- is_read (boolean)
- created_at 