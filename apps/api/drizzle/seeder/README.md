# D1 Seeders

Apply in numeric order. Foreign keys are enforced in D1, so later seeders depend on earlier ones.

## Local

```bash
pnpm wrangler d1 execute DB --local --file=./drizzle/seeder/01_users.sql
pnpm wrangler d1 execute DB --local --file=./drizzle/seeder/02_jenis.sql
pnpm wrangler d1 execute DB --local --file=./drizzle/seeder/03_asal_produksi.sql
pnpm wrangler d1 execute DB --local --file=./drizzle/seeder/04_komoditas.sql
pnpm wrangler d1 execute DB --local --file=./drizzle/seeder/05_produksi.sql
pnpm wrangler d1 execute DB --local --file=./drizzle/seeder/06_penjualan.sql
pnpm wrangler d1 execute DB --local --file=./drizzle/seeder/07_barang.sql
pnpm wrangler d1 execute DB --local --file=./drizzle/seeder/08_transaksi_barang.sql
```

## Remote

Swap `--local` for `--remote`.

## Default credentials

- `admin@gmail.com` / `Password123` — role: admin
- `guru@gmail.com` / `Password123` — role: guru
- `kepsek@gmail.com` / `Password123` — role: kepsek
- `ucok@gmail.com` / `123123123` — role: siswa
- `siti@gmail.com` / `123123123` — role: siswa

Passwords are hashed with PBKDF2-SHA256 (100k iterations, 16-byte salt) to match `src/utils/password.ts`.
