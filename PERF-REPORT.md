# Performance Investigation Report — Day 4

Nama: Muhammad Fathan Nuhi   Tag awal: `d4-start`

Cara mengukur (selalu sama):

- `npm run build && npm run start` (bukan `dev`)
- Chrome DevTools → Performance → CPU **4× slowdown**
- Ulangi 3 kali, catat median

| # | Keluhan | Alat ukur | Metrik | Sebelum | Hipotesis | Perbaikan | Sesudah |
|---|---|---|---|---|---|---|---|
| A | Filter analitik terasa lambat saat mengetik | DevTools Performance & React Profiler | INP / Event Duration (CPU 4×) | ±3,1 s – 9,2 s (INP 9238 ms) | H1: Algoritma $O(N^2)$ dihitung di setiap ketikan. H2: Render 1.000 baris memblokir input. | 1. withWeekAverage linear $O(N)$ via Map + useMemo. 2. useDeferredValue(query) + memo(SalesTable). | ±240 ms – 1.050 ms (INP turun ~90%) |
| B | Dashboard makin berat kalau dibiarkan terbuka | React Profiler | Render time saat idle (commit per detik) | Ratusan ms per detik (1.000 SalesRow re-render terus menerus) | SalesRow membaca useLive() hanya untuk formatPrice, menembus memo SalesTable). | Ganti useLive() di SalesExplorer dengan formatPrice murni dari @/lib/format. | 0.1 ms (1.000 baris data tidak pernah re-render saat idle).
 |
| C | Overview lambat di laptop staf | route-bundle-stats.json & DevTools Network | First Load Uncompressed JS | ±827 KB | recharts (~340 KB) diimpor langsung saat first load padahal grafik tersembunyi. | Pisahkan grafik ke TrendChart.tsx + lazy loading via next/dynamic. | ±480 KB (turun ~340 KB, library recharts baru diunduh saat tombol diklik). |
| D | Detail order lama terbuka | DevTools Network (TTFB / Content Download) | Waktu sampai total order tampil | ±1,90 s (Content Download 1.89s) | Query berantai berurutan (Waterfall N+1 query untuk setiap pizza). | 1. getPizzasSoldOnDay batch query tunggal. 2. Streaming context tambahan dengan Suspense. | 670 ms (Content Download turun ke 638 ms, order utama langsung tampil). |

## Catatan

- **Apa yang paling mengejutkan dari hasil pengukuran?**
  Di Masalah B, membungkus komponen tabel dengan `React.memo` ternyata sama sekali tidak berpengaruh jika child di dalamnya mengonsumsi React Context (`useLive`) yang nilainya sering berubah. Di Masalah D, perulangan query di server menghasilkan waktu `Content Download` yang tinggi di browser karena koneksi streaming tertahan.
- **Perbaikan mana yang TIDAK memberi hasil, dan kenapa?**
  Membungkus `SalesTable` dengan `React.memo` saja pada Masalah B tidak memberikan hasil sebelum ketergantungan `useLive()` dilepaskan dari `SalesRow`. Selain itu, `useDeferredValue` tanpa komponen yang di-`memo` juga tidak efektif karena React tetap merender ulang baris tabel secara sinkron.
pra