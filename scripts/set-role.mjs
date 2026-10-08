// Usage: npm run role -- <login> <customer|staff|admin>
// Roles live in OUR database. Sign in once first so the user row exists.
import sqlite3 from "sqlite3";

const [login, role] = process.argv.slice(2);
const ROLES = ["customer", "staff", "admin"];

if (!login || !ROLES.includes(role)) {
  console.error("Usage: npm run role -- <login> <customer|staff|admin>");
  process.exit(1);
}

const db = new sqlite3.Database("data/pizza.sqlite");
db.run("UPDATE users SET role = ? WHERE login = ?", [role, login], function (err) {
  if (err) {
    console.error(
      err.message.includes("no such table")
        ? "Tabel users belum ada. Jalankan `npm run dev` lalu buka aplikasi sekali."
        : err.message,
    );
    process.exit(1);
  }
  if (this.changes === 0) {
    console.error(`User "${login}" tidak ditemukan. Masuk dengan GitHub dulu.`);
    process.exit(1);
  }
  console.log(`${login} sekarang: ${role}`);
  db.close();
});
