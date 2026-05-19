# instructor.nedu.vn

Workspace của Người Dẫn Đường (Instructor + Faculty Director tương lai) — phần của hệ sinh thái Nedu thuộc NhiLe Holdings.

- **Stack:** Vite 8 + React 19 + TypeScript (NLH Vite-portal convention)
- **Spec nguồn:** xem [CLAUDE.md](./CLAUDE.md) — tài liệu duy nhất để build v1
- **Repo siblings:** `nedu-ops` (vận hành sales) · `nedu-learn` (học viên) · `nedu-website` (marketing)

## Dev

```bash
npm install
npm run dev
```

## Scripts

| Script | Mục đích |
|---|---|
| `npm run dev` | Vite dev server với MSW mocks |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview build local |
| `npm run lint` | ESLint |
