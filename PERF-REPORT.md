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
| C | Overview lambat di laptop staf | | | | | | |
| D | Detail order lama terbuka | | | | | | |

## Catatan

- Apa yang paling mengejutkan dari hasil pengukuran?
- Perbaikan mana yang TIDAK memberi hasil, dan kenapa?
