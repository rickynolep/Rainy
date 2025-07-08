<h1 align=center>
<a href="https://ibb.co/64tmxZN"><img title="Click untuk melihat foto" src="https://i.ibb.co/wKQRXLY/Rainy.png" alt="rainy" border="0" width="350" height="125"></a>
  
  <br> Rainy - Rikomunity AI
  <br> Bot AI dengan Gemini API
  <br> <a href="https://github.com/rickynolep/RainyTS/commits/main/"><img title="Click untuk melihat Changelog" src="https://img.shields.io/badge/Latest_Changelog-v2.25.7.04-363636?style=flat&logo=github" alt="Versi Terbaru: v2.25.7.05"></a>
  <a href="https://discord.com/invite/pAxmeD3kDj"><img title="Click untuk join server" src="https://img.shields.io/badge/Support%20server-Rikomunity-6a6a6a?style=flat&logo=discord&logoColor=white" alt="Support Server: Rikomunity"></a>
</h1>
Rainy adalah bot discord.js yang terintergerasi dengan Gemini API yang membuatnya memiliki kesadaran sendiri dalam merespon segala pesan yang diterima. dibuat oleh Ricky tentunya, hehe (Sekarang dengan TypeScript!)
<br>

## Developtment
Jika kamu ingin mengerjakan projek ini kamu memerlukan [Git](https://git-scm.com) dan [Bun](https://bun.sh/) terinstall di devicemu. Lalu dari command line lakukan:
```sh
# Clone repository ini
git clone https://github.com/rickynolep/RainyTS.git
# Masuk ke directory
cd RainyTS
```
Setelah itu ubah file [.env.example](https://github.com/rickynolep/RainyTS/blob/main/.env.example) menjadi `.env` dan isi valuenya sesuai contoh.

### Start Bot
Setelah melakukan persiapan, kamu dapat menjalankan botmu saat developtment dari command line dengan cara:
```
bun dev
```
Perlu diingat cara menjalankan botnya setelah dibuild itu `bun index.js` atau `node index.js` jika menggunakan [NodeJS](https://nodejs.org/en/download)

### Building Bot
Untuk membuat file bot yang sudah siap pakai kamu perlu build projectnya dari command line dengan melakukan:
```
bun buildbot
```
Setelah itu akan ada folder baru yang bernama "export". Folder tersebut berisi file zip siap pakai, sebaiknya berhati hati dalam membagikannya karena zip tersebut sudah termasuk .env, personality.txt dan config.yaml!

### Compatibility
Setelah kamu mendapatkan file zip siap pakai, kamu dapat langsung menggunakannya di panel vps atau device apapun yang support [Bun](https://bun.sh/) atau [NodeJS v20+](https://nodejs.org/en/download). Jika ada masalah saat menjalankan botmu di panel vps, cobalah untuk nyalakan compatibilityMode pada config.yaml.

## Server and Contributions
Pull Request diterima dan bot ini sangat membutuhkan kontribusi, Kamu dapat bergabung dengan server ini untuk dukungan dan membantu pengembangan proyek
https://discord.com/invite/pAxmeD3kDj

## Dev Folder Structure
Sebenernya ini tidak perlu dijelaskan cuman karena strukturnya lumayan ribet jadi sekalian aja.. Struktur project ini terbagi menjadi beberapa folder dan file dibawah ini:
### OUTDATED
```
📁 RainyTS
├── 📁 cache - Tempat dimana hasil data yang diproses disimpan (contoh: History chat)
├── 📁 dist - Hasil Build
├── 📁 export - Hasil Zip yang siap pakai (BERISI FILE .env!!)
├── 📁 node_modules - Module NodeJS yang diperlukan project
├── 📁 src - Source Code utama project, Fokus ke sini!
│   ├── 📁 commands - Slash command bot
│   │   ├── 📁 admin - Slash command untuk admin
│   │   └── 📁 user - Slash command untuk user
│   ├── 📁 function - File-file Function yang saling memerlukan
│   │   ├── 📁 config - Function yang selalu di reload jika ada perubahan pada config.yaml
│   │   ├── 📁 tools - Function kecil yang berguna sebagai alat bantu
│   │   ├── 📄 bootstrap.ts - File yang dijalankan paling awal (Contoh: Depenency Check)
│   │   ├── 📄 chat.ts - File yang membalas chat langsung ke Bot
│   │   ├── 📄 config.ts - File yang mengelola config (INI BUKAN CONFIG, FILE CONFIG ITU config.yaml)
│   │   ├── 📄 deploy.ts - File yang menghubungkan slash command dengan Discord
│   │   ├── 📄 gemini.ts - File wrapper Gemini AI yang mengelola respon AI
│   │   └── 📄 writeMemory.ts - File yang menulis memory/history chat
│   ├── 📁 modules - File-file yang selalu dipanggil saat bot online (Events)
│   │   ├── 📄 afk.ts - File yang mengurus status AFK
│   │   ├── 📄 interaction.ts - File yang mengurus interaksi slash command dan button
│   │   ├── 📄 monitor.ts - File yang memantau chat bila bot dipanggil atau tidak
│   │   └── 📄 ready.ts - File yang dipanggil setelah bot berhasil login
│   ├── 📁 types - File types yang diperlukan biar typescript ga bawel
│   ├── 📄 index.ts - Memulai bootstrapper lalu main.ts
│   └── 📄 main.ts - File utama yang menghubungkan seluruh project
├── 📄 .env - File einviroment yang berisi password dan hal sesitif untuk botmu bekerja
├── 📄 .env.example - Contoh .env
├── 📄 .gitignore - File yang mengelola file apa saja yang tidak dipush ke github
├── 📄 archiver.ts - File yang mengarsip dist, .env, dan config agar botmu tinggal siap pakai
├── 📄 bun.lockb - File package bun yang bisa kamu abaikan
├── 📄 config.yaml - File konfigurasi yang mengatur botmu
├── 📄 package.json - File yang berisi list apa saja package yang diperlukan project ini
├── 📄 package.json - File yang berisi sifat kepribadian yang dimiliki oleh AI
├── 📄 README.md - Hei, kamu lagi disini ternyata!
└── 📄 tsconfig.json - File yang berisi konfigurasi untuk typescript
```