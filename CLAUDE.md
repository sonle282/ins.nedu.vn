# nedu-instructor · CLAUDE.md

**Project:** `instructor.nedu.vn` — Workspace của Người Dẫn Đường (Instructor + Faculty Director tương lai)
**Repo:** `nedu-instructor`
**Version:** v1.0 · 2026-05
**Owner:** Lê Thảo Nhi (NhiLe Holdings)
**Status:** ACTIVE — Build-Ready
**Stack:** Vite + React 19 + TypeScript (NLH Vite-portal convention)

---

## 0. ĐỌC TRƯỚC KHI BUILD

Đây là tài liệu nguồn duy nhất để Claude Code (hoặc dev human) build `instructor.nedu.vn`. Đọc hết section 0–7 trước khi viết dòng code đầu tiên.

**3 nguồn input đã được merge vào file này:**
1. `Nedu_Instructor_BigPicture_IT_Brief.html` — kiến trúc 7 module + data flow + IT rules
2. `Nedu_Instructor_UserStory.docx` — 24 user stories chi tiết với điều kiện chấp nhận
3. `nedu-instructor-v20__11_.html` — mockup HTML/JS đã có sẵn (extract brand tokens, layout, i18n dictionary)

**Reference convention:** Skill `nlh-fe-architecture` của NhiLe Holdings — đặc biệt `references/vite-portal.md` cho Vite SPA có auth.

**Doc này KHÔNG bao gồm:**
- `learn.nedu.vn` (học viên — repo riêng `nedu-learn`)
- `ops.nedu.vn` (vận hành sales pipeline — repo riêng `nedu-ops`)
- `nedu.vn` (public marketing — repo riêng `nedu-website`)
- Code backend `api.nedu.vn:8080` (repo riêng `nedu-backend`, NestJS)
- Trang admin / dashboard / data analytics khác

---

## 1. Project Overview

### 1.1 Vision — The ONE Thing

> **"Cho phép Người Dẫn Đường (NhiLe và Faculty Director tương lai) mở portal → biết hôm nay dạy gì, trả lời câu nào, tải tài liệu nào — không bao giờ phải hỏi vận hành."**

Không phải admin panel. Không có pipeline, doanh thu, lead data. Chỉ có việc dạy.

### 1.2 The ONE Person

**Là NhiLe — 8h sáng thứ Hai, 10 phút trước buổi dạy K1 lúc 9h.** Cần biết: hôm nay dạy buổi mấy, mã Zoom là gì, có câu hỏi nào học viên đã hỏi cần ghim trả lời đầu giờ không. Một click vào Zoom là vào được phòng. Không scroll. Không search.

→ Nếu instructor.nedu.vn bắt NhiLe think bất kỳ giây nào → đã fail.

### 1.3 Phase plan — 14-day Sprint

| Phase | Modules | Lý do |
|---|---|---|
| 🔴 **A · Core** (Day 1–10) | M1 Home · M2 Calendar · M3 Q&A · M4 Programs · M8 Auth+SLA+RLS | 4 module + auth+SLA — thiếu 1 cái là không dạy được |
| 🟡 **B · Important** (Day 10–13) | M5 Students · M6 Feedback · M7 Profile (edit + timezone) | Có thì dạy tốt hơn, không có vẫn dạy được |
| 🟣 **C · Utility** (Day 13–14) | M7 i18n EN (TreeWalker hoặc react-i18next) | Cần khi có Faculty Director quốc tế |

### 1.4 KHÔNG build trong v1

- ❌ Tạo lịch dạy mới (vận hành tạo trong `ops.nedu.vn`, instructor read-only)
- ❌ Upload tài liệu (vận hành chuẩn bị, instructor chỉ download + request edit)
- ❌ Tạo phòng Zoom (vận hành setup ở `ops.nedu.vn`, instructor read-only mã/mật khẩu)
- ❌ Xem chi tiết PII học viên (tên/email/sđt/ngày sinh) — chỉ thấy aggregate stats
- ❌ Pipeline, doanh thu, lead — KHÔNG có data của ops
- ❌ Trực tiếp nhận câu hỏi từ `learn.nedu.vn` (phải qua support team lọc trước)
- ❌ Multi-instructor portal share — mỗi instructor có scope riêng (RLS enforce)
- ❌ Mobile app native — responsive web đủ (NhiLe có thể mở từ điện thoại trước buổi)
- ❌ Quiz builder, grading, certificate generator
- ❌ AI features (v2)

### 1.5 Success criteria (sau 30 ngày launch)

**Định tính:**
- NhiLe mở instructor.nedu.vn và không cần hỏi Sơn (IT) hôm nay phải làm gì
- Vận hành không bị NhiLe hỏi "lịch hôm nay có gì" — câu hỏi này biến mất
- Học viên trên learn.nedu.vn nhận được câu trả lời trong vòng 24h (trừ Q&A ghim)
- Faculty Director thứ 2 (tương lai) setup xong trong 1 ngày — không cần custom code

**Định lượng:**
- First-load < 2s trên 4G (NhiLe có thể mở từ điện thoại trước buổi)
- Q&A response rate > 90% trong 24h (đo qua audit log)
- SLA auto-fallback chính xác 100% — không câu nào bị quên
- Uptime ≥ 99.5% trong giờ dạy chính (8h–22h GMT+7)

---

## 2. Tech Stack (NLH lock-in — KHÔNG đổi)

| Layer | Choice | Lý do |
|---|---|---|
| Framework | **Vite 8 + React 19** | NLH Vite-portal convention cho dashboard có auth |
| Language | **TypeScript strict** | Type safety + IDE support |
| Routing | **React Router v7** (`react-router-dom`, BrowserRouter) | NLH convention |
| Server state | **TanStack Query v5** | NLH convention |
| Client state | **Zustand v5** | NLH convention — chỉ dùng khi cần (auth, UI state global) |
| Styling | **Tailwind v4** (`@tailwindcss/vite`) | NLH convention |
| Mock API | **MSW v2** (`msw/browser`) | NLH convention — Phase A mock toàn bộ |
| Auth | **NLH Central Auth** (`auth-central`) với Google OAuth provider | NLH convention bắt buộc + Big Picture requirement |
| i18n | **react-i18next** với dictionary VI/EN | Plug vào TreeWalker pattern của mockup v20 hoặc dùng `useTranslation` |
| Date/Time | **`date-fns` + `Intl.DateTimeFormat`** | Multi-timezone, lightweight |
| Analytics | **GA4 + MS Clarity** ở `src/shared/analytics/` | NLH convention |
| Deploy | **Vercel (non-tech preview với mock) + Cloudflare Workers (prod thật)** | NLH dual deploy |

**Cấm tự ý thêm:** Redux, Recoil, Jotai, SWR, Axios, Prisma client, styled-components, Emotion, Material UI, Ant Design, Chakra UI. Nếu cần icon library → `lucide-react`. Nếu cần date picker → tự build với Tailwind, không dùng `react-datepicker`.

---

## 3. Folder Topology

```
nedu-instructor/
├── public/
│   └── mockServiceWorker.js               # MSW (npx msw init public)
├── src/
│   ├── main.tsx                           # await enableMocking() → analytics.init() → render
│   ├── App.tsx                            # Root layout: Topbar + Sidebar + <Outlet />
│   ├── index.css                          # Tailwind entry + CSS vars
│   ├── i18n.ts                            # react-i18next config + dictionary load
│   │
│   ├── routes/
│   │   ├── index.tsx                      # <AppRouter /> — QueryClient + BrowserRouter + Routes
│   │   └── ProtectedRoute.tsx             # Auth gate
│   │
│   ├── modules/                           # Feature-first, 1 folder / 1 domain
│   │   ├── auth/
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.tsx          # Google OAuth single button
│   │   │   │   └── AuthCallbackPage.tsx
│   │   │   └── stores/
│   │   │       └── useAuthStore.ts        # Zustand: user, isLoading, initialize, logout
│   │   │
│   │   ├── home/                          # M1 Trang chủ
│   │   │   ├── pages/HomePage.tsx
│   │   │   ├── components/
│   │   │   │   ├── Greeting.tsx
│   │   │   │   ├── StatBoxes.tsx          # 3 stat: programs, qa-pending, feedback-avg
│   │   │   │   ├── TodaySession.tsx       # Zoom button + meta
│   │   │   │   ├── PinBanner.tsx          # Câu hỏi ghim đầu giờ
│   │   │   │   ├── TodoTodayCard.tsx      # 3 dòng hành động
│   │   │   │   ├── ActiveProgramsList.tsx
│   │   │   │   └── UpcomingSessions.tsx
│   │   │   └── hooks/
│   │   │       └── useHomeDashboard.ts    # TanStack Query
│   │   │
│   │   ├── calendar/                      # M2 Lịch dạy
│   │   │   ├── pages/CalendarPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── CalendarToggle.tsx     # Week/Month/Year
│   │   │   │   ├── WeekView.tsx
│   │   │   │   ├── MonthView.tsx          # Grid 6×7
│   │   │   │   ├── YearView.tsx           # 12 mini-month grids
│   │   │   │   ├── EventRow.tsx
│   │   │   │   ├── RescheduleModal.tsx    # Modal "Thay đổi lịch"
│   │   │   │   └── SessionDetailModal.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useSessions.ts
│   │   │   │   └── useRescheduleRequest.ts
│   │   │   └── utils/
│   │   │       └── tz-convert.ts          # Intl.DateTimeFormat helpers
│   │   │
│   │   ├── qa/                            # M3 Q&A
│   │   │   ├── pages/QaPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── QaStats.tsx            # 3 ô đếm
│   │   │   │   ├── QaFilters.tsx          # Chương trình · Khoá · Trạng thái
│   │   │   │   ├── QaGuideBox.tsx         # Hướng dẫn 3 hành động (collapsible)
│   │   │   │   ├── QuestionCard.tsx       # 1 câu hỏi với 3 actions
│   │   │   │   ├── AnsweredState.tsx
│   │   │   │   ├── PinnedState.tsx
│   │   │   │   └── OpsSentState.tsx
│   │   │   └── hooks/
│   │   │       ├── useQuestions.ts
│   │   │       ├── useAnswerQuestion.ts
│   │   │       ├── usePinQuestion.ts
│   │   │       └── useTransferToOps.ts
│   │   │
│   │   ├── programs/                      # M4 Chương trình & Buổi học
│   │   │   ├── pages/
│   │   │   │   └── ProgramKlassPage.tsx   # /programs/:progId/:klassId
│   │   │   ├── components/
│   │   │   │   ├── ProgramHero.tsx        # 3 stat boxes (Số HV · Buổi đã dạy · ★ phản hồi)
│   │   │   │   ├── SessionAccordion.tsx
│   │   │   │   ├── SessionDetailTab.tsx   # Zoom info (read-only)
│   │   │   │   ├── SessionMaterialsTab.tsx
│   │   │   │   ├── SessionFeedbackTab.tsx # Chỉ buổi đã kết thúc
│   │   │   │   ├── MaterialDownloadRow.tsx
│   │   │   │   └── EditRequestForm.tsx    # Textarea + drag-drop upload
│   │   │   └── hooks/
│   │   │       ├── usePrograms.ts
│   │   │       ├── useMaterials.ts
│   │   │       ├── useDownloadMaterial.ts
│   │   │       └── useEditRequest.ts
│   │   │
│   │   ├── students/                      # M5 Học viên (Phase B)
│   │   │   ├── pages/StudentsPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── ClassListRow.tsx
│   │   │   │   └── StudentDetailModal.tsx # 4 bảng: Kiểu người, Bát tự, MBTI, Hoàng đạo
│   │   │   └── hooks/
│   │   │       └── useStudentAnalytics.ts
│   │   │
│   │   ├── feedback/                      # M6 Phản hồi & Thống kê (Phase B)
│   │   │   ├── pages/FeedbackPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── FeedbackFilters.tsx
│   │   │   │   ├── FeedbackStats.tsx      # 3 stat dynamic theo filter
│   │   │   │   └── FeedbackItem.tsx
│   │   │   └── hooks/
│   │   │       └── useFeedback.ts
│   │   │
│   │   └── profile/                       # M7 Hồ sơ (Phase B/C)
│   │       ├── pages/ProfilePage.tsx
│   │       ├── components/
│   │       │   ├── PersonalInfoCard.tsx   # view/edit mode
│   │       │   ├── TimezoneCard.tsx       # 16 vùng dropdown
│   │       │   ├── LanguageCard.tsx       # VI/EN switcher
│   │       │   ├── AvatarUploader.tsx
│   │       │   └── LogoutModal.tsx
│   │       └── hooks/
│   │           ├── useProfile.ts
│   │           └── useUpdateProfile.ts
│   │
│   ├── shared/                            # Domain-agnostic
│   │   ├── config/
│   │   │   ├── env.ts                     # Wrap import.meta.env
│   │   │   ├── api-client.ts              # fetch wrapper + 401 refresh
│   │   │   ├── auth-central-client.ts     # NLH auth-central wrapper
│   │   │   ├── token-storage.ts           # nlh_access_token, nlh_refresh_token
│   │   │   ├── query-client.ts            # TanStack QueryClient
│   │   │   └── tz-store.ts                # Zustand: current timezone (persist)
│   │   ├── analytics/
│   │   │   ├── ga4.ts
│   │   │   ├── clarity.ts
│   │   │   ├── RouteTracker.tsx
│   │   │   ├── events.ts                  # Typed event names
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── Topbar/                    # Logo + timezone + lang + notif + user menu
│   │   │   │   ├── Topbar.tsx
│   │   │   │   ├── TimezoneBadge.tsx      # UTC+X with realtime clock
│   │   │   │   ├── LangSwitcher.tsx
│   │   │   │   ├── NotifBell.tsx          # Red dot + popup
│   │   │   │   └── UserMenu.tsx
│   │   │   ├── Sidebar/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── NavItem.tsx
│   │   │   │   └── DynamicProgramsSection.tsx
│   │   │   ├── ui/                        # Reusable atoms
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Tag.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   ├── Spinner.tsx
│   │   │   │   ├── ProgressBar.tsx
│   │   │   │   └── DropZone.tsx
│   │   │   └── feedback/
│   │   │       ├── ErrorState.tsx
│   │   │       └── EmptyState.tsx
│   │   ├── hooks/
│   │   │   ├── useToast.ts
│   │   │   ├── useTimezone.ts
│   │   │   └── useRealtimeClock.ts        # Tick 1s for Topbar clock
│   │   ├── stores/
│   │   │   └── useUIStore.ts              # Sidebar open/close, modals
│   │   ├── types/
│   │   │   ├── api.ts                     # ApiResponse, ApiError, Pagination
│   │   │   ├── program.ts
│   │   │   ├── session.ts
│   │   │   ├── qa.ts
│   │   │   ├── feedback.ts
│   │   │   └── profile.ts
│   │   ├── utils/
│   │   │   ├── date.ts
│   │   │   ├── tz.ts                      # 16 timezones list + convert helpers
│   │   │   └── format.ts
│   │   └── locales/                       # react-i18next dictionaries
│   │       ├── vi.json
│   │       └── en.json
│   │
│   └── mocks/                             # MSW — load khi VITE_ENABLE_MOCKING=true
│       ├── init.ts                        # enableMocking()
│       ├── browser.ts
│       ├── config.ts                      # response helpers
│       ├── handlers/
│       │   ├── index.ts
│       │   ├── auth.ts                    # /auth/me
│       │   ├── home.ts                    # /instructor/home-dashboard
│       │   ├── programs.ts
│       │   ├── sessions.ts
│       │   ├── qa.ts
│       │   ├── materials.ts
│       │   ├── feedback.ts
│       │   ├── students.ts
│       │   └── profile.ts
│       └── data/
│           ├── programs.ts                # Seed từ mockup v20 (4 programs, 8 khoá)
│           ├── sessions.ts
│           ├── qa.ts
│           ├── feedback.ts
│           ├── students.ts
│           └── profile.ts
│
├── .env.example
├── vercel.json                            # SPA rewrite
├── wrangler.jsonc                         # CF Workers config
├── vite.config.ts                         # Alias @, @shared, @modules, @routes
├── tsconfig.json / .app.json / .node.json
├── package.json
└── CLAUDE.md                              # File này
```

---

## 4. Environment Variables

### `.env.example`

```bash
# Backend
VITE_API_URL=http://localhost:8080
VITE_AUTH_CENTRAL_URL=http://localhost:4000

# Mock layer (Vercel preview = true, Cloudflare prod = false)
VITE_ENABLE_MOCKING=true

# Analytics (chỉ set trên Cloudflare prod, empty = no-op)
VITE_GA4_ID=
VITE_CLARITY_ID=

# Google Workspace domain whitelist
# Chỉ email thuộc domain này mới được phép login
VITE_ALLOWED_GOOGLE_DOMAINS=nedu.vn,nhileholdings.com

# Subdomain hardcode cho hostname gating analytics
VITE_PROD_HOSTNAME=instructor.nedu.vn
```

### Env wrap — `src/shared/config/env.ts`

```ts
export const env = {
  VITE_API_URL:          import.meta.env.VITE_API_URL as string,
  VITE_AUTH_CENTRAL_URL: import.meta.env.VITE_AUTH_CENTRAL_URL as string,
  VITE_ENABLE_MOCKING:   import.meta.env.VITE_ENABLE_MOCKING === 'true',
  VITE_GA4_ID:           import.meta.env.VITE_GA4_ID as string | undefined,
  VITE_CLARITY_ID:       import.meta.env.VITE_CLARITY_ID as string | undefined,
  VITE_ALLOWED_GOOGLE_DOMAINS:
    (import.meta.env.VITE_ALLOWED_GOOGLE_DOMAINS as string)?.split(',') ?? [],
  VITE_PROD_HOSTNAME:    import.meta.env.VITE_PROD_HOSTNAME as string,
}
```

---

## 5. Brand Tokens (extract từ Mockup v20)

### 5.1 Colors

```css
:root {
  /* Primary brand */
  --navy:        #002D52;   /* Topbar bg, headings */
  --blue:        #004E89;   /* Program "Cuộc Sống Của Bạn" + primary blue */
  --blue-btn:    #3D80CB;   /* CTA buttons, link text */

  /* Surface */
  --white:       #FFFFFF;
  --bg:          #F7F8FA;   /* Page bg, alt rows, hovers */

  /* Text */
  --ink:         #111827;   /* Primary */
  --ink2:        #374151;   /* Secondary */
  --muted:       #6B7280;   /* Tertiary, captions */
  --faint:       #9CA3AF;   /* Disabled, placeholders */

  /* Border */
  --border:      #E5E7EB;
  --border2:     #D1D5DB;

  /* Status (semantic, dùng tiết kiệm) */
  --green:       #15803D;   /* Success, "Đã gửi", program "Sức Mạnh Vô Hạn" */
  --green-l:     #DCFCE7;
  --green-bg:    #F0FDF4;
  --amber:       #B45309;   /* Warning, "Sắp diễn ra", program "Là Chính Mình" */
  --amber-l:     #FEF3C7;
  --amber-bg:    #FFFBEB;
  --red:         #DC2626;   /* Alert, badge "Chờ xử lý", logout */
  --red-l:       #FEE2E2;
  --orange:      #EA580C;   /* "Chuyển support", "Thay đổi lịch" */
  --orange-l:    #FFEDD5;

  /* Shadow */
  --sh:  0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
  --sh2: 0 4px 14px rgba(0,0,0,.09);
  --sh3: 0 8px 30px rgba(0,0,0,.14);

  /* Layout */
  --r:   10px;             /* Radius default */
  --rs:  7px;              /* Radius small (badges, tags) */
  --sw:  232px;            /* Sidebar width */
  --th:  54px;             /* Topbar height */
}
```

**Apply trong Tailwind v4:** Define trong `index.css` `@theme` block để Tailwind tạo utility classes `bg-navy`, `text-blue-btn`, etc.

```css
/* index.css */
@import "tailwindcss";

@theme {
  --color-navy: #002D52;
  --color-blue: #004E89;
  --color-blue-btn: #3D80CB;
  --color-ink: #111827;
  --color-ink-2: #374151;
  --color-muted: #6B7280;
  --color-faint: #9CA3AF;
  --color-border-soft: #E5E7EB;
  --color-border-strong: #D1D5DB;
  --color-success: #15803D;
  --color-warning: #B45309;
  --color-danger: #DC2626;
  --color-info: #EA580C;
  --color-bg: #F7F8FA;
  --radius: 10px;
  --radius-sm: 7px;
}
```

### 5.2 Typography

```css
font-family: 'DM Sans', sans-serif;
```

Load qua Google Fonts trong `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
```

**Sizes:**
- Page title: 18–20px, 700, `--ink`
- Stat box value: 22–28px, 700, prog.color
- Body: 13.5px, 400/500, `--ink2`
- Meta/caption: 11–12px, 500, `--muted`
- Tag: 10–11px, 600, uppercase tracking 0.6px
- Monospace (Zoom code, UTC offset, time): `JetBrains Mono` hoặc system mono

### 5.3 4 Program colors

```ts
export const PROGRAM_COLORS = {
  'cuoc-song-cua-ban':  '#004E89',   // --blue
  'thuong-hieu-cua-ban': '#0891B2',  // Cyan
  'la-chinh-minh':       '#B45309',  // --amber
  'suc-manh-vo-han':     '#15803D',  // --green
}
```

Khi backend trả về `Program` với `id` slug → map sang color.

### 5.4 Layout principles

- **Topbar:** Fixed top, height 54px, `--navy` bg, contains: hamburger toggle (mobile), logo "N·Education", page title (dynamic), spacer, timezone badge, lang switcher, notif bell, user avatar.
- **Sidebar:** Fixed left, width 232px, `--white` bg, scrollable, with sections: TỔNG QUAN / LỚP HỌC / CHƯƠNG TRÌNH (dynamic). Bottom has user row + Profile/Logout.
- **Main:** Margin-left 232px (or 0 on mobile when sidebar closed), padding-top 54px. Content max-width 1200px or fluid.
- **Cards:** `--white` bg, border `--border`, radius `--r`, shadow `--sh`.
- **Mobile breakpoint:** < 768px → sidebar slides in/out (transform), topbar hamburger shows.

---

## 6. Routes & Sidebar

### 6.1 Route map

```
/                                    → Redirect /home
/login                               → LoginPage (public)
/auth-callback                       → AuthCallbackPage (public)
/home                                → HomePage (M1) — default landing post-login
/calendar                            → CalendarPage (M2)
/qa                                  → QaPage (M3)
/programs/:progId/:klassId           → ProgramKlassPage (M4) — dynamic
/students                            → StudentsPage (M5)
/feedback                            → FeedbackPage (M6)
/profile                             → ProfilePage (M7)
*                                    → Redirect /home
```

Tất cả routes trừ `/login` và `/auth-callback` đều bọc trong `<ProtectedRoute>`.

### 6.2 Sidebar structure

```tsx
<Sidebar>
  <Section label="TỔNG QUAN">
    <NavItem to="/home" icon="home">Trang chủ</NavItem>
    <NavItem to="/calendar" icon="calendar">Lịch dạy</NavItem>
  </Section>

  <Section label="LỚP HỌC">
    <NavItem to="/qa" icon="message" badge={pendingQaCount}>
      Câu hỏi học viên
    </NavItem>
    <NavItem to="/students" icon="users">Học viên</NavItem>
    <NavItem to="/feedback" icon="star">Phản hồi &amp; Thống kê</NavItem>
  </Section>

  <Section label="CHƯƠNG TRÌNH">
    <DynamicProgramsSection />   {/* Renders từ data, 1 khoá đại diện / chương trình */}
  </Section>

  <Spacer />

  <Footer>
    <UserRow avatar="NL" name="NhiLe" role="Người Dẫn Đường" />
    <NavItem to="/profile" icon="user">Hồ sơ</NavItem>
    <NavItem onClick={confirmLogout} icon="logout" danger>Đăng xuất</NavItem>
  </Footer>
</Sidebar>
```

### 6.3 DynamicProgramsSection logic

**Mục tiêu:** Render 1 khoá đại diện cho mỗi chương trình instructor đang dạy. Khoá kết thúc > 1 tuần bị ẩn.

```ts
function getVisibleKlass(program: Program): Klass | null {
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  // Priority 1: Active klass (first session ≤ today AND endDate + 1 tuần chưa qua)
  const active = program.klasses.find(k => {
    const firstSession = parseDate(k.sessions[0]?.date)
    const endPlus1Week = new Date(parseDate(k.endDate).getTime() + 7 * 24 * 60 * 60 * 1000)
    return firstSession <= now && now <= endPlus1Week
  })
  if (active) return active

  // Priority 2: Upcoming klass sớm nhất (first session > today)
  const upcoming = program.klasses
    .filter(k => parseDate(k.sessions[0]?.date) > now)
    .sort((a, b) =>
      parseDate(a.sessions[0]?.date).getTime() - parseDate(b.sessions[0]?.date).getTime()
    )[0]
  if (upcoming) return upcoming

  // Tất cả đã kết thúc > 1 tuần → ẩn
  return null
}
```

**UI:** Mỗi mục sidebar hiển thị:
- Chấm màu chương trình
- "[Chương trình] — [Khoá]" (vd: "Cuộc Sống — Khoá 1")
- Badge "Sắp" (cam) nếu là upcoming
- Số "X/Y" buổi đã dạy

Click → navigate `/programs/:progId/:klassId`.

### 6.4 Topbar elements (left → right)

| Element | Behavior |
|---|---|
| Hamburger | Toggle sidebar (mobile only) |
| Logo "N·Education" | Click → `/home` |
| Page title | Dynamic theo route hiện tại (vd "Trang chủ", "Lịch dạy") |
| Timezone badge | "UTC+7 · 14:35:42" — click → `/profile`, clock tick mỗi 1s |
| Lang switcher | "Việt │ EN" — click toggle i18n |
| Notif bell | Red dot nếu có notification mới, click → popup |
| User avatar | Initials "NL" hoặc ảnh, click → dropdown menu (Hồ sơ / Đăng xuất) |

---

## 7. 8 Modules Detail

### Module 1 · Trang chủ (Home)

**Route:** `/home`
**Phase:** A · Core
**User stories:** US-001, US-002, US-003

**Components order (top-to-bottom):**

```
┌──────────────────────────────────────────────────────────┐
│  Xin chào, NhiLe                              [Greeting] │
│  Thứ Hai, ngày 19 tháng 4 năm 2026                       │
├──────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                  │
│  │ 4       │  │ 3       │  │ 4.4 ★   │  [Stat boxes]    │
│  │ Programs│  │ Câu hỏi │  │ Feedback│  → click goto    │
│  └─────────┘  └─────────┘  └─────────┘                  │
├──────────────────────────────────────────────────────────┤
│  Buổi học hôm nay                                        │
│  Cuộc Sống Của Bạn — Khoá 1 · Buổi 3                    │
│  09:00 – 10:30 · Online · 20 học viên                   │
│  [▶ Vào phòng Zoom ngay]   Mã: 123 456 789 · csb2026    │
│  📌 Trả lời đầu giờ — "Làm sao áp dụng..." — Thảo Nguyên │
├──────────────────────────────────────────────────────────┤
│  Cần làm hôm nay                                         │
│  • [3] Câu hỏi học viên chờ xử lý                       │
│  • [Tag: Chưa tải] Tài liệu buổi học hôm nay            │
│  • [1] Câu hỏi ghim — trả lời đầu giờ buổi 3            │
├──────────────────────────────────────────────────────────┤
│  Chương trình đang dạy                                   │
│  ● Cuộc Sống — K1 [Online] [Sắp diễn ra]                │
│    Buổi 2 / 4 ▓▓▓▓▒▒▒▒                          Mở →   │
│  ● Thương Hiệu — K1 [Online]                            │
│    ...                                                   │
├──────────────────────────────────────────────────────────┤
│  Buổi học sắp tới                                        │
│  T4 16/4 · Cuộc Sống — K1 · Buổi 4 · 9:00     [Chi tiết]│
│  T6 18/4 · Thương Hiệu — K1 · Buổi 3 · 19:30  [Chi tiết]│
└──────────────────────────────────────────────────────────┘
```

**Acceptance criteria (từ US-001/002/003):**
- Trang chủ là default landing post-login
- Greeting động "Xin chào, [Tên]" + ngày Thứ/Tháng/Năm theo timezone đã chọn
- 3 stat boxes click được → navigate panel tương ứng
- Khi có buổi hôm nay → khối "Buổi học hôm nay" hiển thị; không có → ẩn hoàn toàn (không empty state vô nghĩa)
- Nút "Vào phòng Zoom ngay" nổi bật, xanh blue-btn, click mở URL Zoom
- Mã phòng + mật khẩu hiển thị monospace dễ copy, read-only
- Pin banner câu hỏi ghim hiển thị bên dưới Zoom block nếu có
- "Cần làm hôm nay" max 3 dòng, mỗi dòng click navigate đúng nơi
- Chương trình đang dạy: chỉ hiện active hoặc upcoming sớm nhất (ẩn ended > 1 tuần)
- Stat box "Chương trình đang dạy" khớp với số chương trình hiển thị trong list
- **KHÔNG** hiển thị doanh thu, pipeline, lead, payment

**Data:**

```ts
type HomeDashboard = {
  greeting: { name: string; date: string /* localized */ }
  stats: {
    activeProgramCount: number
    pendingQaCount: number
    avgFeedback: number  // 0–5
    feedbackCount: number
  }
  todaySession: {
    sessionId: string
    title: string  // "Cuộc Sống Của Bạn — Khoá 1 · Buổi 3"
    startTime: string  // ISO UTC
    endTime: string
    type: 'online' | 'offline'
    studentCount: number
    zoom: { roomId: string; password: string; joinUrl: string }
    pinnedQuestion?: { id: string; text: string; studentName: string }
  } | null
  todos: Array<{
    type: 'pending_qa' | 'download_material' | 'pinned_qa'
    label: string
    count?: number
    href: string
  }>
  activePrograms: Array<{
    programId: string
    programName: string
    color: string
    klassId: string
    klassLabel: string
    type: 'online' | 'offline'
    isUpcoming: boolean
    sessionsTaught: number
    sessionsTotal: number
    href: string
  }>
  upcomingSessions: Array<{
    sessionId: string
    date: string  // ISO
    dayOfWeek: string  // "T4"
    title: string
    startTime: string
    href: string
  }>
}
```

**API:** `GET /api/instructor/home-dashboard` → trả full object trên.

---

### Module 2 · Lịch dạy (Calendar 3-view)

**Route:** `/calendar`
**Phase:** A · Core
**User stories:** US-004 (3-view), US-005 (Reschedule modal), US-006 (Multi-timezone — Phase B)

**Layout:**

```
┌──────────────────────────────────────────────────────────┐
│  Lịch dạy                                                │
│  Chỉ hiển thị buổi của bạn · Cập nhật bởi vận hành      │
│                                                          │
│  [Tuần] [Tháng] [Năm]              ‹  Tuần 16/2  ›       │
├──────────────────────────────────────────────────────────┤
│  Week view:                                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │ T2 16/2 · 09:00                                   │   │
│  │ [Sắp diễn ra] [Online]                            │   │
│  │ Cuộc Sống — K1 · Buổi 3                          │   │
│  │ 09:00 – 10:30                                     │   │
│  │            [Chi tiết] [Thay đổi lịch]            │   │
│  ├──────────────────────────────────────────────────┤   │
│  │ T4 18/2 · 19:30                                   │   │
│  │ ...                                               │   │
│  └──────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────┤
│  Legend: ● Online (xanh) · ● Offline (cam) · ● Đã kết thúc (xám) │
└──────────────────────────────────────────────────────────┘
```

**Acceptance:**
- 3 toggle: Tuần (default) · Tháng · Năm
- Nút nav "‹ ›" để di chuyển kỳ trước/sau
- **Week view:** List 7 ngày, mỗi buổi 1 row với: date pill (T-Thứ + ngày/tháng), giờ, tag trạng thái (Đã kết thúc xám / Sắp diễn ra xanh/cam), tag Online/Offline, tên buổi, nút "Chi tiết" + "Thay đổi lịch" (chỉ buổi chưa kết thúc)
- **Month view:** Grid 6 hàng × 7 cột, chấm màu theo program, list events bên dưới
- **Year view:** 12 mini-month grids, hover ngày có event → tooltip popup chi tiết
- Subhead rõ: "Chỉ hiển thị buổi của bạn · Cập nhật bởi vận hành"
- Buổi đã kết thúc > 1 tuần vẫn hiển thị trong calendar history (nhưng không trong sidebar/home)
- Mọi giờ hiển thị theo timezone đã chọn ở Profile, convert từ UTC+7 base
- **Reschedule modal** (click "Thay đổi lịch"):
  - Hiển thị tên buổi bị ảnh hưởng
  - Field 1: Lý do — select 4 options: Đột xuất / Ốm / Gia đình / Khác
  - Field 2: Xử lý — "Đề xuất lịch dạy bù" hoặc "Huỷ hẳn"
  - Nếu đề xuất bù: nhiều time slots có thể thêm tự do
  - Field 3: Ghi chú (textarea, optional)
  - Click "Gửi" → POST `/api/instructor/reschedule-request` → notify ops qua tbot + toast "Đã gửi thông báo thay đổi lịch tới vận hành!"
  - Instructor KHÔNG sửa lịch trực tiếp — chỉ đề xuất

**Timezone convert helper:**

```ts
// src/modules/calendar/utils/tz-convert.ts
const BASE_TZ = 'Asia/Ho_Chi_Minh'  // UTC+7

export function convertSessionTimeToTZ(
  baseUtcIso: string,
  targetTzIana: string  // vd "Asia/Tokyo"
): { hh: number; mm: number; display: string } {
  const fmt = new Intl.DateTimeFormat('vi-VN', {
    timeZone: targetTzIana,
    hour: '2-digit', minute: '2-digit', hour12: false,
  })
  // ... extract hh:mm
}
```

---

### Module 3 · Q&A đã lọc

**Route:** `/qa`
**Phase:** A · Core
**User stories:** US-007 (Queue), US-008 (Reply direct), US-009 (Pin), US-010 (Transfer to ops)

**Critical rules:**
1. **Câu hỏi ĐÃ ĐI QUA SUPPORT FILTER** — không có endpoint direct từ `learn.nedu.vn`
2. **3 actions only:** Trả lời trực tiếp / Ghim đầu giờ / Chuyển support
3. **Action không undo** — đã gửi là hiển thị
4. **SLA auto-fallback:** Câu ghim không trả lời sau buổi học → tự chuyển support (backend cron)

**Layout:**

```
┌──────────────────────────────────────────────────────────┐
│  Câu hỏi học viên                                        │
│  Đã được bộ phận hỗ trợ lọc — chỉ hiển thị câu cần bạn  │
│                                                          │
│  ℹ Hướng dẫn xử lý (collapsible):                       │
│    1. Trả lời trực tiếp → hiển thị ngay trên learn      │
│    2. Ghim đầu giờ → trả lời live buổi sau              │
│    3. Chuyển support → support trả lời thay             │
│    [Đã hiểu, ẩn hướng dẫn]                              │
├──────────────────────────────────────────────────────────┤
│  ┌──────┐  ┌──────┐  ┌──────┐                          │
│  │  3   │  │  1   │  │  12  │  [3 ô đếm live update]   │
│  │ Chờ  │  │ Ghim │  │ Đã gửi│                         │
│  └──────┘  └──────┘  └──────┘                          │
├──────────────────────────────────────────────────────────┤
│  Filter: [Chương trình ▾] [Khoá ▾] [Trạng thái ▾]       │
├──────────────────────────────────────────────────────────┤
│  Card câu hỏi (pending state):                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │ [Cuộc Sống] [K1] [Buổi 3] [Chờ xử lý]            │   │
│  │ "Làm sao áp dụng bài học vào cuộc sống hàng ngày?" │   │
│  │ — Thảo Nguyên · 19/4 15:42                       │   │
│  │ ⏰ Cần xử lý trước đầu giờ Buổi 4 (còn 2 ngày)   │   │
│  │                                                  │   │
│  │ Chọn cách xử lý:                                 │   │
│  │ ┌────────────────────────────────────────────┐   │   │
│  │ │ Viết câu trả lời để gửi trực tiếp...      │   │   │
│  │ └────────────────────────────────────────────┘   │   │
│  │ [Trả lời trực tiếp] [Ghim đầu giờ buổi 4]      │   │
│  │ [Chuyển cho bộ phận hỗ trợ]                    │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

**States của 1 câu hỏi:**

| State | UI | API event |
|---|---|---|
| `pending` | Card đầy đủ với textarea + 3 nút | Initial |
| `answered` | Tag "✓ Đã gửi học viên", textarea ẩn, box xanh hiển thị câu trả lời | POST `/qa/:id/answer` body `{ answerText }` |
| `pinned` | Tag "📌 Ghim đầu giờ Buổi X", textarea ẩn, info box "💡 Sẽ tự auto-fallback nếu không trả lời", nút "Chuyển support ngay" escape hatch | POST `/qa/:id/pin` body `{ sessionId }` |
| `ops-sent` | Tag "→ Bộ phận hỗ trợ xử lý", banner cam, action row ẩn | POST `/qa/:id/transfer-to-ops` |
| `auto-fallback` (system) | Tag "→ Bộ phận hỗ trợ xử lý (auto-fallback)" | System cron, không trigger từ FE |

**Validation:**
- Trả lời trực tiếp: textarea không rỗng (báo "⚠ Bạn chưa điền câu trả lời" + border đỏ)
- Click action → optimistic update + toast "Đã gửi cho học viên!" / "Đã ghim đầu giờ buổi X" / "Đã chuyển cho bộ phận hỗ trợ"
- Sidebar badge giảm tự động sau action

**Audit log:** Mỗi action ghi vào `pipeline_actions` (insert-only): `{ actor_id, action_type, qa_id, before_state, after_state, created_at }`.

---

### Module 4 · Chương trình & Buổi học (Programs)

**Route:** `/programs/:progId/:klassId`
**Phase:** A · Core
**User stories:** US-011 (Dynamic sidebar), US-012 (Download materials), US-013 (Request edit), US-014 (Zoom info read-only)

**Layout:**

```
┌──────────────────────────────────────────────────────────┐
│  Cuộc Sống Của Bạn — Khoá 1                              │
│  Online · 20 học viên · Buổi 2 / 4                       │
│                                                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                  │
│  │ 20      │  │ 2/4     │  │ 4.3 ★   │  [Hero stats]    │
│  │ Học viên│  │ Buổi    │  │ Phản hồi│                  │
│  └─────────┘  └─────────┘  └─────────┘                  │
├──────────────────────────────────────────────────────────┤
│  Buổi 1 ✅                                          [▾] │
│  Buổi 2 ✅                                          [▾] │
│  Buổi 3 🔴 Sắp bắt đầu hôm nay                      [▾] │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Tab: [Chi tiết] [Tài liệu] [Phản hồi]            │ │
│  │                                                    │ │
│  │ ── Chi tiết ──                                    │ │
│  │ Date: T2 16/2 · 9:00–10:30                       │ │
│  │ Type: Online                                      │ │
│  │ Zoom (Chỉ xem):                                   │ │
│  │   Mã: 123 456 789                                 │ │
│  │   Mật khẩu: csb2026                               │ │
│  │   [▶ Vào phòng Zoom ngay]                        │ │
│  │ 📌 Câu hỏi ghim: "Làm sao áp dụng..."            │ │
│  │                                                    │ │
│  │ ── Tài liệu ──                                    │ │
│  │ ℹ Tài liệu chuẩn bị bởi vận hành. Tải trước buổi │ │
│  │ 📄 Kịch bản buổi 3 · DOCX · 1.8MB  [Tải xuống]   │ │
│  │ 📊 Slide buổi 3 · PPTX · 4.2MB     [Tải xuống]   │ │
│  │ 📕 Workbook · PDF · 800KB          [Tải xuống]   │ │
│  │                                                    │ │
│  │ ── Yêu cầu chỉnh sửa tài liệu ──                 │ │
│  │ [Textarea: Ghi rõ phần nào cần chỉnh sửa...]     │ │
│  │ [DropZone: Ảnh, PDF, Word — nhiều file]          │ │
│  │ [Gửi yêu cầu]                                    │ │
│  └────────────────────────────────────────────────────┘ │
│  Buổi 4 ⚪ Chưa diễn ra                              [▾] │
└──────────────────────────────────────────────────────────┘
```

**Acceptance:**
- 3 hero stat boxes ở đầu: Số học viên · Buổi đã dạy · Phản hồi trung bình
- Accordion mỗi buổi học, mở rộng để xem chi tiết
- Tabs khác nhau theo state buổi:
  - Buổi tương lai: [Chi tiết] [Tài liệu]
  - Buổi đã qua: [Chi tiết] [Tài liệu] [Phản hồi]
  - Buổi hôm nay: thêm pin banner câu hỏi ghim + tag "Sắp bắt đầu"
- **Tab Chi tiết:**
  - Hiển thị Zoom info với badge "Chỉ xem" dark theme
  - Mã phòng + mật khẩu monospace, easy copy
  - Nút "Vào phòng Zoom ngay" mở Zoom client/web
  - Buổi đã kết thúc: vẫn hiển thị Zoom info reference, KHÔNG có nút "Vào phòng"
  - **KHÔNG có nút Edit** — instructor không sửa được
- **Tab Tài liệu:**
  - Banner: "Tài liệu chuẩn bị bởi vận hành. Tải xuống trước buổi học."
  - Mỗi file: icon DOC/PPT/PDF, tên file, metadata format · size, nút "Tải xuống"
  - File hosting trên Supabase Storage, link presigned URL hết hạn 1h
  - Format: DOCX (kịch bản), PPTX (slide), PDF (workbook), link Vimeo (video)
  - Instructor KHÔNG upload thay — chỉ tải
  - Tag "Chưa tải" hiển thị bên Home > Cần làm hôm nay nếu chưa tải tài liệu của buổi học hôm nay
- **Request Edit form:**
  - Textarea (min height 55px) placeholder "Ghi rõ phần nào cần chỉnh sửa..."
  - Drag-drop upload zone hỗ trợ nhiều file: image/*, .pdf, .doc, .docx, .pptx
  - File list hiển thị: icon, tên, size KB, nút ✕ xoá
  - Click "Gửi yêu cầu" → POST `/api/instructor/material-edit-request` → notify ops + state thành sent box xanh "✅ Đã gửi yêu cầu thành công"

---

### Module 5 · Học viên (Students Analytics)

**Route:** `/students`
**Phase:** B
**User stories:** US-015 (List), US-016 (Demographic modal)

**Critical:** **CHỈ AGGREGATE STATS — KHÔNG có PII (tên/email/sđt/ngày sinh học viên).**

**Layout:**

```
┌──────────────────────────────────────────────────────────┐
│  Học viên                                                │
│  Số lượng học viên theo từng khoá · Nhấn để xem chi tiết │
├──────────────────────────────────────────────────────────┤
│  ● Cuộc Sống — Khoá 1 · Online              20  →       │
│  ● Thương Hiệu — Khoá 1 · Online            18  →       │
│  ● Là Chính Mình — Khoá 1 · Offline         34  →       │
│  ● Sức Mạnh Vô Hạn — Khoá 1 · Online        38  →       │
│  ───────────────────────────────────────────────────     │
│  Tổng cộng                                  110         │
└──────────────────────────────────────────────────────────┘

Click 1 dòng → Modal overlay full-screen:
┌──────────────────────────────────────────────────────────┐
│  Học viên — Cuộc Sống Của Bạn — Khoá 1            [✕]   │
│                                                          │
│  Tổng số học viên                                        │
│  ┌────┐                                                  │
│  │ 20 │  ● Nam: 12     ● Nữ: 8                          │
│  └────┘                                                  │
│                                                          │
│  ┌────────────────┐  ┌────────────────┐                 │
│  │ Kiểu người     │  │ Bát tự          │                 │
│  │ Người số 1: 5  │  │ THỔ: 4         │                 │
│  │ Người số 2: 6  │  │ HOẢ: 5         │                 │
│  │ Người số 3: 4  │  │ MỘC: 3         │                 │
│  │ Người số 4: 5  │  │ THUỶ: 4         │                 │
│  │                │  │ KIM: 4         │                 │
│  └────────────────┘  └────────────────┘                 │
│  ┌────────────────┐  ┌────────────────┐                 │
│  │ MBTI top 5     │  │ Hoàng đạo top 5 │                 │
│  │ INFJ: 4        │  │ Bảo Bình: 3    │                 │
│  │ ENFP: 3        │  │ Sư Tử: 3       │                 │
│  │ ...            │  │ ...            │                 │
│  │ Khác: 5        │  │ Khác: 6        │                 │
│  └────────────────┘  └────────────────┘                 │
└──────────────────────────────────────────────────────────┘
```

**API:** `GET /api/instructor/students/aggregate?progId=...&klassId=...` trả về aggregated counts.

---

### Module 6 · Phản hồi & Thống kê (Feedback)

**Route:** `/feedback`
**Phase:** B
**User stories:** US-017 (Auto-collect), US-018 (Filter)

**Layout:**

```
┌──────────────────────────────────────────────────────────┐
│  Phản hồi & Thống kê                                     │
│  Tự động thu thập từ learn.nedu.vn                       │
├──────────────────────────────────────────────────────────┤
│  Filter: [Chương trình ▾]  [Khoá ▾]                     │
├──────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                  │
│  │ 8       │  │ 110     │  │ 4.4 ★   │  [Dynamic stats] │
│  │ Buổi đã │  │ Học viên│  │ ★ 30 phản│                 │
│  │ dạy     │  │         │  │  hồi    │                  │
│  └─────────┘  └─────────┘  └─────────┘                  │
├──────────────────────────────────────────────────────────┤
│  Phản hồi gần đây                                        │
│  (or "Phản hồi — Cuộc Sống — Khoá 1" theo filter)       │
│                                                          │
│  ★★★★★ "Bài học rất sâu sắc và áp dụng được."          │
│  — Thảo Nguyên · Cuộc Sống · K1 · Buổi 3                │
│  19/4 16:42                                              │
│                                                          │
│  ★★★★☆ "Mình cần thêm ví dụ thực tế."                   │
│  — Ẩn danh · Là Chính Mình · K1 · Buổi 4                │
│  ...                                                     │
└──────────────────────────────────────────────────────────┘
```

**Acceptance:**
- 3 stat boxes dynamic theo filter (label + value đổi)
- Filter: Chương trình (Tất cả/4) · Khoá (Tất cả/k1/k2/k3)
- Title list cũng update theo filter
- Mỗi feedback item: chuỗi sao, quote, tên hoặc "Ẩn danh", chương trình·khoá·buổi, ngày giờ
- Realtime — không cần refresh để thấy mới (Supabase realtime subscription hoặc polling 30s)
- Cũng truy cập từ panel Programs → buổi đã kết thúc có tab "Phản hồi" với avg + list

---

### Module 7 · Hồ sơ (Profile)

**Route:** `/profile`
**Phase:** B (basic) + C (i18n EN)
**User stories:** US-019 (Edit info), US-020 (Timezone), US-021 (Language)

**3 Cards:**

**Card 1 · Thông tin cá nhân (view/edit toggle)**

View mode:
```
[NL]  NhiLe                            [Chỉnh sửa]
      Người Dẫn Đường Chính · Từ 2024
      🧘 Mindfulness  🎓 NLP

Họ tên: Lê Thảo Nhi
Email: nhi@nedu.vn
Phone: 09xx xxx xxx
Kinh nghiệm: 10 năm
Bio: Founder NhiLe Holdings, ...
```

Edit mode: 5 input fields. Avatar có nút ✏️ overlay upload image preview. Save → toast "Đã lưu hồ sơ · Vận hành đã được thông báo" + notify ops via tbot.

Subhead trên đầu panel: "Thay đổi sẽ được thông báo tới vận hành"

**Card 2 · Múi giờ hiển thị**

```
Múi giờ hiển thị                   UTC+7  14:35:42
                                          Thứ Hai, 19/4

[Dropdown: 16 vùng]
├─ 🇻🇳 Việt Nam (UTC+7)
├─ 🇹🇭 Thái Lan (UTC+7)
├─ 🇸🇬 Singapore (UTC+8)
├─ 🇲🇾 Malaysia (UTC+8)
├─ 🇮🇩 Indonesia (UTC+7)
├─ 🇵🇭 Philippines (UTC+8)
├─ 🇯🇵 Nhật Bản (UTC+9)
├─ 🇰🇷 Hàn Quốc (UTC+9)
├─ 🇨🇳 Trung Quốc (UTC+8)
├─ 🇮🇳 Ấn Độ (UTC+5:30)
├─ 🇬🇧 Anh (UTC+0)
├─ 🇫🇷 Pháp (UTC+1)
├─ 🇩🇪 Đức (UTC+1)
├─ 🇺🇸 Mỹ Đông (UTC-5)
├─ 🇺🇸 Mỹ Tây (UTC-8)
└─ 🇦🇺 Úc (UTC+11)

ℹ Toàn bộ giờ trong lịch và chương trình sẽ được hiển thị theo múi giờ này.
```

Behavior:
- Realtime clock tick mỗi 1s (UTC+X + đồng hồ)
- Đổi → topbar badge update + Calendar re-render + toast "Đã đổi múi giờ sang UTC+X"
- Persist vào profile (DB) → instructor login lần sau giữ nguyên
- Conversion logic: DB lưu UTC, FE dùng `Intl.DateTimeFormat({ timeZone: ianaName })` convert

```ts
// src/shared/utils/tz.ts
export const TIMEZONES = [
  { code: 'VN', name: 'Việt Nam', iana: 'Asia/Ho_Chi_Minh', flag: '🇻🇳', offset: 7 },
  { code: 'TH', name: 'Thái Lan', iana: 'Asia/Bangkok', flag: '🇹🇭', offset: 7 },
  { code: 'SG', name: 'Singapore', iana: 'Asia/Singapore', flag: '🇸🇬', offset: 8 },
  { code: 'MY', name: 'Malaysia', iana: 'Asia/Kuala_Lumpur', flag: '🇲🇾', offset: 8 },
  { code: 'ID', name: 'Indonesia', iana: 'Asia/Jakarta', flag: '🇮🇩', offset: 7 },
  { code: 'PH', name: 'Philippines', iana: 'Asia/Manila', flag: '🇵🇭', offset: 8 },
  { code: 'JP', name: 'Nhật Bản', iana: 'Asia/Tokyo', flag: '🇯🇵', offset: 9 },
  { code: 'KR', name: 'Hàn Quốc', iana: 'Asia/Seoul', flag: '🇰🇷', offset: 9 },
  { code: 'CN', name: 'Trung Quốc', iana: 'Asia/Shanghai', flag: '🇨🇳', offset: 8 },
  { code: 'IN', name: 'Ấn Độ', iana: 'Asia/Kolkata', flag: '🇮🇳', offset: 5.5 },
  { code: 'GB', name: 'Anh', iana: 'Europe/London', flag: '🇬🇧', offset: 0 },
  { code: 'FR', name: 'Pháp', iana: 'Europe/Paris', flag: '🇫🇷', offset: 1 },
  { code: 'DE', name: 'Đức', iana: 'Europe/Berlin', flag: '🇩🇪', offset: 1 },
  { code: 'US_E', name: 'Mỹ Đông', iana: 'America/New_York', flag: '🇺🇸', offset: -5 },
  { code: 'US_W', name: 'Mỹ Tây', iana: 'America/Los_Angeles', flag: '🇺🇸', offset: -8 },
  { code: 'AU', name: 'Úc', iana: 'Australia/Sydney', flag: '🇦🇺', offset: 11 },
] as const
```

**Card 3 · Ngôn ngữ + Logout**

```
Ngôn ngữ hiển thị
[🇻🇳 Tiếng Việt]  [🇬🇧 English]

──────────────────────────────────

[Đăng xuất]
```

VI/EN switcher: click → call `i18n.changeLanguage('vi'|'en')` + persist to localStorage. Topbar lang pill đồng bộ 2 chiều.

Phase 2 chỉ cần đủ keyword cho navigation, header, button labels. Phase 3 mở rộng toàn UI.

Logout: click → modal confirm "Bạn có chắc muốn đăng xuất?" → 2 nút Huỷ/Đăng xuất → call `useAuthStore.logout()` → redirect `/login`.

---

### Module 8 · Auth + SLA + RLS

**User stories:** US-022 (Google OAuth), US-023 (SLA auto-fallback), US-024 (RLS isolation)

#### US-022 · Google OAuth

- **Login page:** chỉ 1 nút "Sign in with Google" (no email/password form, no "Forgot password")
- Click → `redirectToGoogleLogin()` (auth-central-client)
- Domain whitelist enforce ở backend AND frontend:
  - Backend: `auth-central` reject nếu email không thuộc allowed domains
  - Frontend: defense-in-depth, check `user.email` domain sau khi nhận token, nếu không match → logout + toast "Email không thuộc tổ chức được phép truy cập"
- Roles từ `auth-central`: `instructor` / `faculty_director` / `admin`
- Session expire sau 8h không hoạt động hoặc user "Đăng xuất"
- User menu popup: "Hồ sơ của tôi" + "Đăng xuất"
- Logout modal confirm tránh click nhầm

#### US-023 · SLA Auto-Fallback (backend cron)

**Không build ở FE — này là backend worker.** Spec:

```
Trigger: session.end_time + 1 giờ
Action:
  1. Query: pipeline_actions where state='pinned' AND session_id=<vừa kết thúc>
  2. Filter: KHÔNG có action 'answered' nào sau timestamp pin
  3. For each qualifying QA:
     - Update state: 'pinned' → 'ops-sent'
     - Tag: '→ Bộ phận hỗ trợ xử lý (auto-fallback)'
     - Notify instructor + support qua tbot Telegram
     - Insert pipeline_actions: actor='system', reason='sla_auto_fallback', original_pin_time, fallback_time
  4. Retry logic: nếu fail (network) → exponential backoff 3 lần → alert admin
```

FE chỉ:
- Hiển thị tag "→ Bộ phận hỗ trợ xử lý (auto-fallback)" trên QA card
- Hiển thị trong notification bell popup nếu có auto-fallback recent

#### US-024 · RLS Isolation

**Supabase Row Level Security policies (backend setup, FE không build).** Spec:

```sql
-- programs / sessions / materials / zoom_info
-- Instructor SELECT chỉ thấy row có instructor_id = auth.uid()
-- UPDATE/DELETE → bị deny (chỉ role 'ops' mới INSERT/UPDATE/DELETE)

-- qa_questions
-- Instructor SELECT thấy câu hỏi assigned to mình (instructor_id = auth.uid())
-- INSERT bị deny ở FE (chỉ system/support push qua backend)
-- UPDATE chỉ field answer_text + state, không sửa được question_text

-- instructor_profiles
-- Instructor UPDATE chỉ row của mình

-- pipeline_actions
-- INSERT-only cho mọi role; KHÔNG UPDATE, KHÔNG DELETE

-- Instructor KHÔNG thấy: tables pipeline_leads, payments, consultant_kpi, alumni
-- → RLS deny by default
```

FE phải:
- Hiển thị `view-only` badge ở Zoom dark theme (đã có sẵn trong v20)
- Không attempt sửa data read-only — UI không có nút Edit cho lịch, Zoom, tài liệu
- Error 403 từ backend → toast "Bạn không có quyền sửa thông tin này"

---

## 8. Database Schema (Supabase shared với core)

Schema này là **reference** cho IT backend team setup migrations. FE chỉ cần biết shape để type API responses.

```sql
-- ═══════════════════════════════════════════════════════════
-- INSTRUCTORS: bảng riêng cho người dạy (FK với auth.users)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE instructors (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('instructor','faculty_director','admin')),
  phone TEXT,
  bio TEXT,
  experience_years INTEGER,
  avatar_url TEXT,
  badges JSONB DEFAULT '[]'::jsonb,   -- [{label: 'Mindfulness', icon: '🧘'}]
  timezone_code TEXT DEFAULT 'VN',     -- VN, SG, JP, ...
  locale TEXT DEFAULT 'vi' CHECK (locale IN ('vi','en')),
  joined_at DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════
-- PROGRAMS: 4 chương trình hiện tại
-- ═══════════════════════════════════════════════════════════
CREATE TABLE programs (
  id TEXT PRIMARY KEY,    -- slug: 'cuoc-song-cua-ban', 'thuong-hieu-cua-ban', ...
  name TEXT NOT NULL,
  short_name TEXT,
  color TEXT DEFAULT '#004E89',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════
-- INSTRUCTOR_PROGRAMS: phân công 1 instructor có thể dạy nhiều program
-- ═══════════════════════════════════════════════════════════
CREATE TABLE instructor_programs (
  instructor_id UUID REFERENCES instructors(id) ON DELETE CASCADE,
  program_id TEXT REFERENCES programs(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (instructor_id, program_id)
);

-- ═══════════════════════════════════════════════════════════
-- KLASSES: mỗi program có nhiều khoá
-- ═══════════════════════════════════════════════════════════
CREATE TABLE klasses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id TEXT REFERENCES programs(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL,                 -- 'Khoá 1', 'Khoá 2'
  type TEXT CHECK (type IN ('online','offline')) NOT NULL,
  student_count INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming','active','ended','archived')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════
-- SESSIONS: buổi học cụ thể (do ops tạo)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  klass_id UUID REFERENCES klasses(id) ON DELETE CASCADE NOT NULL,
  instructor_id UUID REFERENCES instructors(id) NOT NULL,
  sequence INTEGER NOT NULL,           -- Buổi 1, 2, 3, ...
  title TEXT NOT NULL,
  start_time_utc TIMESTAMPTZ NOT NULL, -- UTC, FE convert sang timezone hiển thị
  end_time_utc TIMESTAMPTZ NOT NULL,
  type TEXT CHECK (type IN ('online','offline')) NOT NULL,
  zoom_room_id TEXT,
  zoom_password TEXT,
  zoom_join_url TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','live','ended','cancelled')),
  created_by UUID,                     -- ops user
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (klass_id, sequence)
);

-- ═══════════════════════════════════════════════════════════
-- MATERIALS: kịch bản, slide, workbook (do ops upload)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  kind TEXT CHECK (kind IN ('script','slide','workbook','video','other')) NOT NULL,
  title TEXT NOT NULL,
  file_format TEXT,                    -- 'DOCX', 'PPTX', 'PDF', 'video/vimeo'
  storage_path TEXT,                   -- Supabase Storage path
  external_url TEXT,                   -- Vimeo link cho video
  file_size_bytes BIGINT,
  uploaded_by UUID,                    -- ops user
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════
-- DOWNLOAD_LOG: theo dõi instructor đã tải tài liệu nào
-- (để tag "Chưa tải" ở Home > Cần làm hôm nay)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE material_downloads (
  id BIGSERIAL PRIMARY KEY,
  instructor_id UUID REFERENCES instructors(id) NOT NULL,
  material_id UUID REFERENCES materials(id) NOT NULL,
  downloaded_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (instructor_id, material_id)
);

-- ═══════════════════════════════════════════════════════════
-- QA_QUESTIONS: câu hỏi từ học viên (đã được support filter)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE qa_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  klass_id UUID REFERENCES klasses(id),
  program_id TEXT REFERENCES programs(id),
  instructor_id UUID REFERENCES instructors(id) NOT NULL,
  student_id UUID,                     -- learn.nedu.vn user id, không expose ra FE
  student_display_name TEXT,           -- chỉ name, không email/phone
  question_text TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'pending' CHECK (state IN (
    'pending','answered','pinned','ops-sent','auto-fallback'
  )),
  answer_text TEXT,
  pinned_for_session_id UUID REFERENCES sessions(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  answered_at TIMESTAMPTZ,
  pinned_at TIMESTAMPTZ,
  transferred_at TIMESTAMPTZ
);

CREATE INDEX idx_qa_instructor_state ON qa_questions(instructor_id, state);
CREATE INDEX idx_qa_session ON qa_questions(session_id);

-- ═══════════════════════════════════════════════════════════
-- FEEDBACKS: phản hồi học viên (auto-collect từ learn.nedu.vn)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  klass_id UUID REFERENCES klasses(id) NOT NULL,
  program_id TEXT REFERENCES programs(id) NOT NULL,
  instructor_id UUID REFERENCES instructors(id) NOT NULL,
  student_id UUID,                     -- nullable nếu ẩn danh
  student_display_name TEXT,           -- "Thảo Nguyên" hoặc null
  is_anonymous BOOLEAN DEFAULT false,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_feedback_instructor ON feedbacks(instructor_id, created_at DESC);

-- ═══════════════════════════════════════════════════════════
-- STUDENT_AGGREGATES: pre-computed demographics (refresh nightly)
-- ═══════════════════════════════════════════════════════════
CREATE MATERIALIZED VIEW student_aggregates AS
SELECT
  klass_id,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE gender = 'male') AS male_count,
  COUNT(*) FILTER (WHERE gender = 'female') AS female_count,
  jsonb_object_agg(persona_type, persona_count) AS personas,
  jsonb_object_agg(bazi_element, bazi_count) AS baziElements,
  jsonb_object_agg(mbti_type, mbti_count) AS mbti,
  jsonb_object_agg(zodiac, zodiac_count) AS zodiac
FROM (
  -- ... subquery joining enrollments + student profiles
) sq
GROUP BY klass_id;

-- ═══════════════════════════════════════════════════════════
-- RESCHEDULE_REQUESTS: instructor báo cáo sự cố lịch
-- ═══════════════════════════════════════════════════════════
CREATE TABLE reschedule_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) NOT NULL,
  instructor_id UUID REFERENCES instructors(id) NOT NULL,
  reason TEXT CHECK (reason IN ('emergency','health','family','other')) NOT NULL,
  action_type TEXT CHECK (action_type IN ('propose_reschedule','cancel')) NOT NULL,
  proposed_slots JSONB DEFAULT '[]'::jsonb,  -- [{date, time}]
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- ═══════════════════════════════════════════════════════════
-- MATERIAL_EDIT_REQUESTS: instructor xin sửa tài liệu
-- ═══════════════════════════════════════════════════════════
CREATE TABLE material_edit_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) NOT NULL,
  instructor_id UUID REFERENCES instructors(id) NOT NULL,
  description TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,    -- [{name, size, storage_path}]
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','in_progress','done')),
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- ═══════════════════════════════════════════════════════════
-- PIPELINE_ACTIONS: audit log insert-only (đã có sẵn trong nedu-backend)
-- Note: shared với ops, instructor portal CHỈ INSERT records của mình
-- ═══════════════════════════════════════════════════════════
-- (đã có schema sẵn — không define lại)
```

---

## 9. RLS Policies (high-level)

**FE không setup RLS — backend (Supabase migration) làm.** Spec tham khảo:

```sql
-- Enable RLS trên tất cả tables instructor truy cập
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE reschedule_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_edit_requests ENABLE ROW LEVEL SECURITY;

-- INSTRUCTOR isolation
CREATE POLICY "instructor_sees_own_sessions" ON sessions
FOR SELECT USING (instructor_id = auth.uid());

CREATE POLICY "instructor_cannot_modify_sessions" ON sessions
FOR ALL USING (false) WITH CHECK (false);
-- Chỉ role 'ops' với service_role mới INSERT/UPDATE

CREATE POLICY "instructor_sees_own_qa" ON qa_questions
FOR SELECT USING (instructor_id = auth.uid());

CREATE POLICY "instructor_updates_own_qa_state" ON qa_questions
FOR UPDATE USING (instructor_id = auth.uid())
WITH CHECK (
  instructor_id = auth.uid()
  AND question_text = OLD.question_text  -- không sửa được câu hỏi
);

CREATE POLICY "instructor_reads_materials_assigned" ON materials
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM sessions s
    WHERE s.id = materials.session_id AND s.instructor_id = auth.uid()
  )
);
-- Materials INSERT/UPDATE chỉ ops

CREATE POLICY "instructor_updates_own_profile" ON instructors
FOR UPDATE USING (id = auth.uid())
WITH CHECK (id = auth.uid() AND role = OLD.role);  -- không tự promote role
```

**Bảng instructor KHÔNG truy cập (default deny):**
- `pipeline_leads`
- `payments`
- `consultant_kpi`
- `alumni`

---

## 10. API Endpoints (api.nedu.vn:8080)

Backend là Express/NestJS @ `api.nedu.vn:8080`. Tất cả endpoint prefix `/api/instructor/*`.

**Response envelope:**
- Single: `{ data: T }`
- List paginated: `{ data: T[], meta: { page, limit, total } }`
- Error: `{ statusCode, message, error }`

### Auth (NLH auth-central)
```
GET    /auth/me                              → user info
POST   /auth/refresh                         → refresh token
POST   /auth/logout                          → revoke
```

### Home
```
GET    /api/instructor/home-dashboard        → toàn bộ data Home page
```

### Calendar
```
GET    /api/instructor/sessions?from=&to=    → sessions trong khoảng
POST   /api/instructor/reschedule-request    → submit reschedule
```

### Q&A
```
GET    /api/instructor/qa?state=&progId=&klassId=  → list with filters
PATCH  /api/instructor/qa/:id/answer         → body { answerText }
PATCH  /api/instructor/qa/:id/pin            → body { sessionId }
PATCH  /api/instructor/qa/:id/transfer       → body { reason? }
```

### Programs / Sessions / Materials
```
GET    /api/instructor/programs              → list with klasses + sessions
GET    /api/instructor/programs/:progId/klasses/:klassId   → detail klass
GET    /api/instructor/sessions/:id          → session detail
GET    /api/instructor/sessions/:id/materials → materials list
POST   /api/instructor/materials/:id/download → returns presigned URL (1h expiry) + log download
POST   /api/instructor/material-edit-request → body { sessionId, description, attachments }
POST   /api/instructor/materials/upload-attachment → upload edit-request file → returns storage_path
```

### Students
```
GET    /api/instructor/students/aggregate?progId=&klassId= → demographic aggregates
```

### Feedback
```
GET    /api/instructor/feedback?progId=&klassId=&limit=&offset= → paginated
GET    /api/instructor/feedback/stats?progId=&klassId= → stats summary
```

### Profile
```
GET    /api/instructor/profile               → current user profile
PATCH  /api/instructor/profile               → update profile (notify ops)
POST   /api/instructor/profile/avatar        → upload avatar → returns avatar_url
PATCH  /api/instructor/profile/timezone      → body { code }
PATCH  /api/instructor/profile/locale        → body { locale }
```

### Notifications
```
GET    /api/instructor/notifications         → list recent
POST   /api/instructor/notifications/:id/read → mark read
```

---

## 11. MSW Mock Plan (Phase A — all endpoints mocked)

Seed data từ `mockup v20`:
- 4 programs: Cuộc Sống Của Bạn / Thương Hiệu Của Bạn / Là Chính Mình / Sức Mạnh Vô Hạn
- 8 klasses (K1/K2/K3 mỗi program tuỳ data)
- ~20 sessions (mix online/offline, mix scheduled/ended/live)
- ~10 QA questions (mix pending/pinned/answered/ops-sent)
- ~30 feedbacks
- 1 mock instructor: NhiLe, role=instructor

**Handler structure (`src/mocks/handlers/`):**

```ts
// src/mocks/handlers/index.ts
import { authHandlers } from './auth'
import { homeHandlers } from './home'
import { sessionsHandlers } from './sessions'
import { qaHandlers } from './qa'
import { programsHandlers } from './programs'
import { materialsHandlers } from './materials'
import { feedbackHandlers } from './feedback'
import { studentsHandlers } from './students'
import { profileHandlers } from './profile'

export const handlers = [
  ...authHandlers,
  ...homeHandlers,
  ...sessionsHandlers,
  ...qaHandlers,
  ...programsHandlers,
  ...materialsHandlers,
  ...feedbackHandlers,
  ...studentsHandlers,
  ...profileHandlers,
]
```

**Mock data file (`src/mocks/data/programs.ts`) — port từ mockup v20:**

```ts
import type { Program } from '@shared/types/program'

export const programs: Program[] = [
  {
    id: 'cuoc-song-cua-ban',
    name: 'Cuộc Sống Của Bạn',
    color: '#004E89',
    klasses: [
      {
        id: 'k1',
        label: 'Khoá 1',
        studentCount: 20,
        startDate: '2026-02-01',
        endDate: '2026-03-15',
        type: 'online',
        sessions: [
          { sequence: 1, date: '2026-02-01', time: '09:00–10:30', type: 'online' },
          { sequence: 2, date: '2026-02-04', time: '09:00–10:30', type: 'online' },
          { sequence: 3, date: '2026-02-10', time: '09:00–10:30', type: 'online' },
          { sequence: 4, date: '2026-03-01', time: '09:00–10:30', type: 'online' },
        ],
      },
      // ... K2
    ],
  },
  {
    id: 'thuong-hieu-cua-ban',
    name: 'Thương Hiệu Của Bạn',
    color: '#0891B2',
    klasses: [/* ... */],
  },
  {
    id: 'la-chinh-minh',
    name: 'Là Chính Mình',
    color: '#B45309',
    klasses: [/* ... */],
  },
  {
    id: 'suc-manh-vo-han',
    name: 'Sức Mạnh Vô Hạn',
    color: '#15803D',
    klasses: [/* ... */],
  },
]
```

**State mutation:** Handler mutate trực tiếp arrays để simulate state (vd: QA answer → update state field). Reload page = reset state, OK cho dev/preview.

---

## 12. Multi-Timezone Logic

**Principle:** DB lưu UTC, FE convert ở runtime.

### Store

```ts
// src/shared/config/tz-store.ts (Zustand persist localStorage)
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TIMEZONES } from '@shared/utils/tz'

interface TzState {
  code: string                    // 'VN', 'SG', ...
  iana: string                    // 'Asia/Ho_Chi_Minh'
  offset: number                  // 7
  setTimezone: (code: string) => void
}

export const useTzStore = create<TzState>()(
  persist(
    (set) => ({
      code: 'VN',
      iana: 'Asia/Ho_Chi_Minh',
      offset: 7,
      setTimezone: (code) => {
        const tz = TIMEZONES.find(t => t.code === code)
        if (tz) set({ code: tz.code, iana: tz.iana, offset: tz.offset })
      },
    }),
    { name: 'nedu_tz' }
  )
)
```

### Helpers

```ts
// src/shared/utils/date.ts
import { useTzStore } from '@shared/config/tz-store'

export function formatSessionTime(utcIso: string): string {
  const { iana } = useTzStore.getState()
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: iana,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(utcIso))
}

export function formatSessionDate(utcIso: string): { dow: string; dateStr: string } {
  const { iana } = useTzStore.getState()
  const d = new Date(utcIso)
  const dow = new Intl.DateTimeFormat('vi-VN', { timeZone: iana, weekday: 'narrow' }).format(d)
  const dateStr = new Intl.DateTimeFormat('vi-VN', {
    timeZone: iana, day: '2-digit', month: '2-digit',
  }).format(d)
  return { dow, dateStr }
}

export function formatUtcOffset(): string {
  const { offset } = useTzStore.getState()
  const sign = offset >= 0 ? '+' : ''
  return `UTC${sign}${offset}`
}
```

### Realtime clock hook

```ts
// src/shared/hooks/useRealtimeClock.ts
import { useEffect, useState } from 'react'
import { useTzStore } from '@shared/config/tz-store'

export function useRealtimeClock(): string {
  const { iana } = useTzStore()
  const [time, setTime] = useState(() => formatNow(iana))

  useEffect(() => {
    const id = setInterval(() => setTime(formatNow(iana)), 1000)
    return () => clearInterval(id)
  }, [iana])

  return time
}

function formatNow(iana: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: iana,
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).format(new Date())
}
```

---

## 13. i18n VI/EN (react-i18next)

### Setup

```bash
npm install react-i18next i18next i18next-browser-languagedetector
```

```ts
// src/i18n.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import vi from './shared/locales/vi.json'
import en from './shared/locales/en.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { vi: { translation: vi }, en: { translation: en } },
    fallbackLng: 'vi',
    interpolation: { escapeValue: false },
    detection: { order: ['localStorage', 'navigator'], lookupLocalStorage: 'nedu_lang' },
  })

export default i18n
```

### Dictionary keys (port từ mockup v20)

```json
// src/shared/locales/vi.json
{
  "nav": {
    "overview": "TỔNG QUAN",
    "classes": "LỚP HỌC",
    "program": "CHƯƠNG TRÌNH",
    "home": "Trang chủ",
    "calendar": "Lịch dạy",
    "qa": "Câu hỏi học viên",
    "students": "Học viên",
    "feedback": "Phản hồi & Thống kê",
    "profile": "Hồ sơ",
    "logout": "Đăng xuất"
  },
  "home": {
    "greeting": "Xin chào, {{name}}",
    "stat_programs": "Chương trình đang dạy",
    "stat_qa_pending": "Câu hỏi chờ xử lý",
    "stat_feedback_avg": "Điểm phản hồi trung bình",
    "todo_today": "Cần làm hôm nay",
    "todo_pending_qa": "Câu hỏi học viên chờ xử lý",
    "todo_download_material": "Tài liệu buổi học hôm nay cần tải xuống",
    "todo_pinned_qa": "Câu hỏi ghim — trả lời đầu giờ buổi {{n}}",
    "today_session": "Buổi học hôm nay",
    "zoom_join": "Vào phòng Zoom ngay",
    "zoom_room": "Mã phòng:",
    "zoom_password": "Mật khẩu:",
    "open_arrow": "Mở →",
    "details": "Chi tiết",
    "active_programs": "Chương trình đang dạy",
    "upcoming_sessions": "Buổi học sắp tới"
  },
  "calendar": {
    "title": "Lịch dạy",
    "subhead": "Chỉ hiển thị buổi của bạn · Cập nhật bởi vận hành",
    "week": "Tuần",
    "month": "Tháng",
    "year": "Năm",
    "reschedule": "Thay đổi lịch",
    "ended": "Đã kết thúc",
    "upcoming": "Sắp diễn ra",
    "online": "Online",
    "offline": "Offline",
    "modal_title": "Thay đổi lịch dạy",
    "reason": "Lý do thay đổi",
    "reason_emergency": "Có việc đột xuất",
    "reason_health": "Bị ốm — sức khoẻ",
    "reason_family": "Lý do gia đình",
    "reason_other": "Lý do khác",
    "action_propose": "Đề xuất lịch dạy bù",
    "action_cancel": "Huỷ hẳn buổi học này",
    "notes": "Ghi chú thêm",
    "submit": "Gửi thông báo",
    "toast_submitted": "Đã gửi thông báo thay đổi lịch tới vận hành!"
  },
  "qa": {
    "title": "Câu hỏi học viên",
    "subhead": "Đã được bộ phận hỗ trợ lọc — chỉ hiển thị câu cần bạn xử lý",
    "stat_pending": "Chờ xử lý",
    "stat_pinned": "Đã ghim đầu giờ",
    "stat_sent": "Đã gửi học viên",
    "action_reply": "Trả lời trực tiếp",
    "action_pin": "Ghim đầu giờ buổi {{n}}",
    "action_transfer": "Chuyển cho bộ phận hỗ trợ",
    "transfer_short": "Chuyển support",
    "placeholder_answer": "Viết câu trả lời để gửi trực tiếp cho học viên...",
    "validation_empty": "⚠ Bạn chưa điền câu trả lời",
    "deadline_alert": "⏰ Cần xử lý trước đầu giờ Buổi {{n}}",
    "guide_title": "Hướng dẫn xử lý",
    "guide_dismiss": "Đã hiểu, ẩn hướng dẫn",
    "guide_show": "Xem lại hướng dẫn",
    "state_sent_to_student": "✓ Đã gửi học viên",
    "state_pinned": "📌 Ghim đầu giờ buổi {{n}}",
    "state_transferred": "→ Bộ phận hỗ trợ xử lý",
    "state_auto_fallback": "→ Bộ phận hỗ trợ xử lý (auto-fallback)",
    "auto_fallback_note": "💡 Sẽ tự động chuyển về bộ phận hỗ trợ nếu không trả lời sau buổi học",
    "toast_replied": "Đã gửi cho học viên!",
    "toast_pinned": "Đã ghim đầu giờ buổi {{n}}",
    "toast_transferred": "Đã chuyển cho bộ phận hỗ trợ!"
  },
  "programs": {
    "tab_details": "Chi tiết",
    "tab_materials": "Tài liệu",
    "tab_feedback": "Phản hồi",
    "view_only": "Chỉ xem",
    "materials_banner": "Tài liệu chuẩn bị bởi vận hành. Tải xuống trước buổi học.",
    "download": "Tải xuống",
    "edit_request_title": "Yêu cầu chỉnh sửa tài liệu",
    "edit_request_placeholder": "Ghi rõ phần nào cần chỉnh sửa...",
    "edit_request_upload_hint": "Ảnh, PDF, Word — nhiều file cùng lúc",
    "edit_request_submit": "Gửi yêu cầu",
    "edit_request_success": "✅ Đã gửi yêu cầu thành công · Vận hành sẽ xử lý trong thời gian sớm nhất"
  },
  "students": {
    "title": "Học viên",
    "subhead": "Số lượng học viên theo từng khoá · Nhấn để xem chi tiết",
    "total": "Tổng cộng",
    "modal_title": "Học viên — {{programName}} — {{klassLabel}}",
    "male": "Nam",
    "female": "Nữ",
    "persona_table": "Kiểu người",
    "bazi_table": "Bát tự",
    "mbti_table": "MBTI",
    "zodiac_table": "Cung hoàng đạo",
    "other": "Khác"
  },
  "feedback": {
    "title": "Phản hồi & Thống kê",
    "subhead": "Tự động thu thập từ learn.nedu.vn",
    "filter_all_programs": "Tất cả chương trình",
    "filter_all_classes": "Tất cả khoá",
    "stat_sessions": "Tổng số buổi đã dạy",
    "stat_students": "Tổng số học viên",
    "stat_avg": "Điểm phản hồi trung bình",
    "stat_count": "★ {{n}} phản hồi",
    "list_recent": "Phản hồi gần đây",
    "list_filtered": "Phản hồi — {{programName}} — {{klassLabel}}",
    "anonymous": "Ẩn danh"
  },
  "profile": {
    "title": "Hồ sơ dẫn đường",
    "subhead": "Thay đổi sẽ được thông báo tới vận hành",
    "card_personal": "Thông tin cá nhân",
    "card_timezone": "Múi giờ hiển thị",
    "card_language": "Ngôn ngữ hiển thị",
    "edit": "Chỉnh sửa",
    "save": "Lưu thay đổi",
    "cancel": "Huỷ",
    "name": "Họ và tên",
    "email": "Email",
    "phone": "Điện thoại",
    "experience": "Kinh nghiệm",
    "bio": "Giới thiệu bản thân",
    "tz_label": "Chọn vùng thời gian",
    "tz_info": "ℹ Toàn bộ giờ trong lịch và chương trình sẽ được hiển thị theo múi giờ này",
    "tz_changed": "Đã đổi múi giờ sang {{utc}}",
    "saved_notify_ops": "Đã lưu hồ sơ · Vận hành đã được thông báo",
    "logout_confirm_title": "Đăng xuất?",
    "logout_confirm_body": "Bạn có chắc muốn đăng xuất khỏi hệ thống không?",
    "logout_action": "Đăng xuất"
  },
  "auth": {
    "login_with_google": "Đăng nhập với Google",
    "login_domain_error": "Email không thuộc tổ chức được phép truy cập",
    "session_expired": "Phiên đã hết hạn, vui lòng đăng nhập lại"
  },
  "common": {
    "loading": "Đang tải...",
    "error": "Có lỗi xảy ra, vui lòng thử lại",
    "guide_lead": "Người Dẫn Đường",
    "guide_lead_main": "Người Dẫn Đường Chính",
    "my_profile": "Hồ sơ của tôi"
  }
}
```

EN version: copy struct, port từ I18N dictionary của mockup v20 (đã có sẵn ~50 keys).

### Usage

```tsx
import { useTranslation } from 'react-i18next'

function HomePage() {
  const { t } = useTranslation()
  return <h1>{t('home.greeting', { name: 'NhiLe' })}</h1>
}
```

---

## 14. SLA Auto-Fallback Worker (Backend spec, FE chỉ tham khảo)

**Trigger:** Cron job hoặc Supabase Edge Function scheduled mỗi 15 phút.

**Logic:**

```ts
// Pseudo-code backend
async function slaAutoFallback() {
  // 1. Find sessions vừa kết thúc trong 1-2h vừa qua
  const recentlyEndedSessions = await db.sessions.findMany({
    where: {
      end_time_utc: { gte: now - 2h, lte: now - 1h },
      status: 'ended',
    },
  })

  for (const session of recentlyEndedSessions) {
    // 2. Find QA questions pinned cho session này nhưng chưa answered
    const pinnedUnanswered = await db.qa_questions.findMany({
      where: {
        pinned_for_session_id: session.id,
        state: 'pinned',
      },
    })

    for (const qa of pinnedUnanswered) {
      // 3. Transition state
      await db.qa_questions.update({
        where: { id: qa.id },
        data: {
          state: 'auto-fallback',
          transferred_at: now,
        },
      })

      // 4. Audit log
      await db.pipeline_actions.insert({
        actor_id: 'system',
        action_type: 'sla_auto_fallback',
        qa_id: qa.id,
        before_state: 'pinned',
        after_state: 'auto-fallback',
        metadata: {
          session_id: session.id,
          original_pin_time: qa.pinned_at,
          fallback_time: now,
        },
      })

      // 5. Notify
      await tbot.send({
        target: 'instructor',
        instructor_id: qa.instructor_id,
        message: `[Q&A] Câu hỏi ghim từ buổi ${session.title} đã tự động chuyển về support do quá hạn.`,
      })
      await tbot.send({
        target: 'support',
        message: `[Q&A] Có câu hỏi auto-fallback từ instructor cần xử lý: ${qa.question_text}`,
      })
    }
  }
}
```

**Retry logic:** Exponential backoff 3 lần, fail → alert admin qua high-priority channel.

---

## 15. Audit Log Pattern

Mỗi action quan trọng → INSERT vào `pipeline_actions` (insert-only, never UPDATE/DELETE).

**FE side:** Không tự ghi audit. Backend handle tự động khi action endpoint được gọi.

**Schema:**
```sql
-- (đã có sẵn trong nedu-backend, không define lại)
-- Schema: { id, actor_id, action_type, target_type, target_id,
--           before_state, after_state, metadata jsonb, created_at }
```

**Action types liên quan instructor portal:**
- `qa_answered` — actor=instructor, before=pending, after=answered
- `qa_pinned` — actor=instructor, before=pending, after=pinned
- `qa_transferred_to_ops` — actor=instructor, before=pending|pinned, after=ops-sent
- `qa_sla_auto_fallback` — actor=system, before=pinned, after=auto-fallback
- `material_downloaded` — actor=instructor, target=material_id
- `material_edit_requested` — actor=instructor, target=session_id
- `reschedule_requested` — actor=instructor, target=session_id
- `profile_updated` — actor=instructor, diff trong metadata
- `timezone_changed` — actor=instructor, before/after code
- `locale_changed` — actor=instructor, before/after locale
- `login` — actor=instructor
- `logout` — actor=instructor

---

## 16. Notify Ops qua Telegram Bot

**FE không gọi Telegram trực tiếp.** Mọi notify phát sinh từ instructor action → backend trigger sang tbot.

**Events trigger notify ops:**

| Action | Notify channel | Message template |
|---|---|---|
| Submit reschedule request | tbot ops channel | `[LỊCH] {{instructor}} báo thay đổi lịch {{session}}: {{reason}}. {{action}}` |
| Submit material edit request | tbot ops channel | `[TÀI LIỆU] {{instructor}} xin sửa tài liệu {{session}}: {{description}}. {{n}} file đính kèm.` |
| Update profile | tbot ops channel | `[HỒ SƠ] {{instructor}} đã update profile: {{diff}}` |
| Transfer QA to ops | tbot support channel | `[Q&A] {{instructor}} chuyển câu hỏi: "{{question_text}}" về support` |
| SLA auto-fallback | tbot support + instructor | `[Q&A] Câu ghim từ buổi {{session}} đã tự auto-fallback về support` |

**Backend trigger pattern:** Sau khi INSERT vào DB → emit event → worker pick up → call Telegram bot API.

---

## 17. Build Order — 14-Day Sprint

**Mục tiêu:** NhiLe dùng được portal trong tuần 2 để dạy buổi thật.

### Day 1–2 · 🔑 Foundation

- [ ] `npm create vite@latest nedu-instructor -- --template react-ts`
- [ ] Install dependencies (xem section 2 + 8.checklist)
- [ ] Set up folder topology (section 3)
- [ ] `vite.config.ts`: alias `@`, `@shared`, `@modules`, `@routes` + plugins react + tailwind + cloudflare
- [ ] Copy `src/shared/config/*` từ `nedu-ops` template (env.ts, token-storage.ts, auth-central-client.ts, api-client.ts, query-client.ts) — không modify logic core
- [ ] Copy `src/shared/analytics/*` từ `nedu-ops` — sửa `ENABLED_HOSTNAMES = new Set(['instructor.nedu.vn'])`
- [ ] `src/modules/auth/`: `useAuthStore.ts`, `LoginPage.tsx` (single Google OAuth button), `AuthCallbackPage.tsx`
- [ ] `src/routes/`: `index.tsx` (AppRouter with QueryClient + BrowserRouter + RouteTracker), `ProtectedRoute.tsx`
- [ ] `src/main.tsx`: `await enableMocking() → analytics.init() → render`
- [ ] `src/mocks/`: `init.ts`, `browser.ts`, `config.ts`, `handlers/auth.ts` (`/auth/me` returns NhiLe user)
- [ ] `npx msw init public/`
- [ ] `.env.example` với 7 vars (section 4)
- [ ] Build Topbar + Sidebar shell (section 6.2–6.4) với i18n + tz integration
- [ ] Build Layout với `<Outlet />` cho child routes
- [ ] **Demo cuối Day 2:** Login mock end-to-end, vào được Home page (placeholder), Topbar + Sidebar render đúng.

### Day 2–4 · 🏠 Module 1 · Trang chủ

- [ ] Mock data `src/mocks/data/programs.ts` + `sessions.ts` (port từ mockup v20)
- [ ] `src/mocks/handlers/home.ts`: `/api/instructor/home-dashboard`
- [ ] Build HomePage components (Greeting, StatBoxes, TodaySession, PinBanner, TodoTodayCard, ActiveProgramsList, UpcomingSessions)
- [ ] Hook `useHomeDashboard` với TanStack Query
- [ ] DynamicProgramsSection trong Sidebar — render từ data
- [ ] **Demo cuối Day 4:** Home page render đầy đủ với mock data. Click stat boxes navigate đúng. Sidebar dynamic programs hiển thị 4 chương trình.

### Day 3–6 · 📚 Module 4 · Programs

- [ ] `src/mocks/handlers/programs.ts`, `materials.ts`
- [ ] Build ProgramKlassPage với hero stats + session accordion
- [ ] Build SessionDetailTab (Zoom info read-only, view-only badge)
- [ ] Build SessionMaterialsTab (download list, EditRequestForm với drag-drop)
- [ ] Build SessionFeedbackTab (chỉ buổi đã kết thúc)
- [ ] Material download flow: click → call presigned URL endpoint → trigger browser download + log
- [ ] Edit request flow: submit form → toast success
- [ ] **Demo cuối Day 6:** Mở khoá K1 của Cuộc Sống → thấy hero stats + 4 buổi accordion. Mở 1 buổi → download tài liệu được. Submit edit request → state success.

### Day 5–8 · 📅 Module 2 · Calendar

- [ ] `src/modules/calendar/utils/tz-convert.ts`
- [ ] Build WeekView, MonthView, YearView
- [ ] CalendarToggle component
- [ ] EventRow component reused giữa views
- [ ] RescheduleModal với form 4 fields + multiple slots
- [ ] `useSessions` + `useRescheduleRequest` hooks
- [ ] Timezone integration: useTzStore subscribe → re-render khi đổi tz
- [ ] **Demo cuối Day 8:** Switch 3 view (Tuần/Tháng/Năm). Đổi timezone ở Profile → calendar re-render đúng. Submit reschedule → toast success + notify ops mocked.

### Day 7–10 · ❓ Module 3 · Q&A

- [ ] `src/mocks/handlers/qa.ts` với state mutations
- [ ] Build QaPage với 3 stat boxes + filters + guide box
- [ ] QuestionCard 4 states (pending, answered, pinned, ops-sent)
- [ ] 3 action hooks: `useAnswerQuestion`, `usePinQuestion`, `useTransferToOps`
- [ ] Validation: textarea empty check
- [ ] Toast feedback cho mỗi action
- [ ] Sidebar badge update tự động sau action (invalidate query)
- [ ] **Demo cuối Day 10:** Q&A page: filter, trả lời 1 câu → state đổi, sidebar badge giảm. Ghim 1 câu → hiển thị ở Home pin banner. Chuyển 1 câu → state ops-sent.

### Day 9–11 · 👥⭐ Module 5 + 6 · Students + Feedback

- [ ] `src/mocks/handlers/students.ts`, `feedback.ts`
- [ ] Build StudentsPage với ClassListRow + StudentDetailModal
- [ ] StudentDetailModal: hero stats + 4 analytics tables (Kiểu người, Bát tự, MBTI, Hoàng đạo)
- [ ] Build FeedbackPage với filters + dynamic stats + feedback items
- [ ] Realtime/polling cho feedback (30s interval hoặc Supabase realtime subscription)
- [ ] **Demo cuối Day 11:** Students list 4 khoá, click 1 → modal demographic. Feedback page filter theo program/khoá, stat boxes update đúng.

### Day 11–14 · 👤 Module 7 + Polish

- [ ] `src/mocks/handlers/profile.ts`
- [ ] Build ProfilePage với 3 cards
- [ ] PersonalInfoCard view/edit toggle với 5 fields + avatar upload
- [ ] TimezoneCard dropdown 16 vùng + realtime clock + UTC badge
- [ ] LanguageCard VI/EN switcher
- [ ] LogoutModal confirm
- [ ] i18n full integration: react-i18next với vi.json + en.json
- [ ] Topbar lang pill đồng bộ 2 chiều với Profile
- [ ] Mobile responsive (< 768px): Sidebar slide in/out, Topbar hamburger
- [ ] **Day 13:** End-to-end QA test với NhiLe (2 ngày dùng thử) — fix top 5 friction points
- [ ] **Day 14:** Production deploy
  - Push lên `origin main` → Vercel preview với mock
  - Push lên `lab main:incoming` → IT merge sang dev → CF `nedu-instructor-dev`
  - IT verify với real backend → merge dev → main → CF `nedu-instructor-prod`
  - DNS: point `instructor.nedu.vn` → `nedu-instructor-prod.workers.dev`

**Launch criteria:**
- First-load < 2s trên 4G
- Login flow real Google OAuth end-to-end
- All 24 user stories acceptance criteria pass
- 0 jargon trong UI (audit bằng tìm "asset", "metadata", "sync" — replace hết)
- NhiLe có thể dạy 1 buổi thật mà không cần Sơn IT hỗ trợ

---

## 18. Deploy & Push Flow

### 18.1 Dual deploy

| Target | Triggered by | Mock flag | Audience |
|---|---|---|---|
| **Vercel** | Push `main` lên `origin` (personal repo) | `=true` | NhiLe + team preview với mock data |
| **Cloudflare `nedu-instructor-dev`** | IT merge `incoming` → `dev` ở `lab` | `=false` | IT staging với real backend |
| **Cloudflare `nedu-instructor-prod`** | IT merge `dev` → `main` ở `lab` | `=false` | Production thật, `instructor.nedu.vn` |

### 18.2 Files config

**`vercel.json`:**
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**`wrangler.jsonc`:**
```jsonc
{
  "name": "nedu-instructor",
  "compatibility_date": "2026-05-01",
  "assets": {
    "not_found_handling": "single-page-application"
  },
  "env": {
    "production": { "name": "nedu-instructor-prod" },
    "dev":        { "name": "nedu-instructor-dev" }
  }
}
```

**`package.json` scripts:**
```json
{
  "scripts": {
    "dev":          "vite",
    "build":        "tsc -b && vite build",
    "preview":      "vite preview",
    "cf:build":     "vite build",
    "deploy:dev":   "vite build && wrangler deploy --name nedu-instructor-dev",
    "deploy:prod":  "vite build && wrangler deploy --name nedu-instructor-prod",
    "cf-typegen":   "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts",
    "push:both":    "git push origin main && git push lab main:incoming"
  }
}
```

### 18.3 Push flow 2-remote

```bash
# Setup ban đầu (1 lần)
git remote add lab git@github.com:NhiLe-Holding/nedu-instructor.git

# Daily push
git add .
git commit -m "feat: ..."
npm run push:both
# = git push origin main && git push lab main:incoming
```

### 18.4 Env vars setup

**Vercel dashboard:**
```
VITE_API_URL=https://api.nedu.vn   (hoặc mock URL, vì mock=true skip)
VITE_AUTH_CENTRAL_URL=https://auth-central.nedu.vn
VITE_ENABLE_MOCKING=true
VITE_GA4_ID=                                # empty = no-op vì non-prod hostname
VITE_CLARITY_ID=
VITE_ALLOWED_GOOGLE_DOMAINS=nedu.vn,nhileholdings.com
VITE_PROD_HOSTNAME=instructor.nedu.vn
```

**Cloudflare `nedu-instructor-dev`:**
```
VITE_API_URL=https://api-dev.nedu.vn
VITE_AUTH_CENTRAL_URL=https://auth-central-dev.nedu.vn
VITE_ENABLE_MOCKING=false
VITE_GA4_ID=                                # empty trên dev
VITE_CLARITY_ID=
VITE_ALLOWED_GOOGLE_DOMAINS=nedu.vn,nhileholdings.com
VITE_PROD_HOSTNAME=instructor.nedu.vn
```

**Cloudflare `nedu-instructor-prod`:**
```
VITE_API_URL=https://api.nedu.vn
VITE_AUTH_CENTRAL_URL=https://auth-central.nedu.vn
VITE_ENABLE_MOCKING=false
VITE_GA4_ID=G-XXXXXXXXXX                    # set real value
VITE_CLARITY_ID=XXXXXXX
VITE_ALLOWED_GOOGLE_DOMAINS=nedu.vn,nhileholdings.com
VITE_PROD_HOSTNAME=instructor.nedu.vn
```

### 18.5 DNS

Point `instructor.nedu.vn` (CNAME) → `nedu-instructor-prod.workers.dev` qua Cloudflare DNS dashboard.

---

## 19. Analytics — GA4 + Microsoft Clarity

### 19.1 Hostname gating

```ts
// src/shared/analytics/index.ts
const ENABLED_HOSTNAMES = new Set(['instructor.nedu.vn'])

function shouldEnable(): boolean {
  return import.meta.env.PROD &&
    typeof window !== 'undefined' &&
    ENABLED_HOSTNAMES.has(window.location.hostname)
}
```

Vercel preview, `*.workers.dev`, localhost → no-op tự động.

### 19.2 Events to track

```ts
// src/shared/analytics/events.ts
export const events = {
  // Page views auto via RouteTracker
  // Custom events
  'login_success': () => analytics.track('login_success'),
  'logout': () => analytics.track('logout'),

  'qa_answered': (qa_id: string) => analytics.track('qa_answered', { qa_id }),
  'qa_pinned': (qa_id: string, session_id: string) =>
    analytics.track('qa_pinned', { qa_id, session_id }),
  'qa_transferred': (qa_id: string) => analytics.track('qa_transferred', { qa_id }),

  'material_downloaded': (material_id: string, kind: string) =>
    analytics.track('material_downloaded', { material_id, kind }),
  'edit_request_submitted': (session_id: string, attachment_count: number) =>
    analytics.track('edit_request_submitted', { session_id, attachment_count }),

  'reschedule_requested': (session_id: string, reason: string) =>
    analytics.track('reschedule_requested', { session_id, reason }),

  'timezone_changed': (from: string, to: string) =>
    analytics.track('timezone_changed', { from, to }),
  'locale_changed': (from: string, to: string) =>
    analytics.track('locale_changed', { from, to }),

  'zoom_joined': (session_id: string) =>
    analytics.track('zoom_joined', { session_id }),
}
```

### 19.3 Clarity privacy

- Masking mode: **Strict** (mask all text by default trên dashboard)
- PII fields (profile edit form, edit request textarea) → add `data-clarity-mask="true"`
- KHÔNG track student names, emails, phone in events
- Audit logs là source of truth cho compliance, analytics chỉ aggregated metrics

---

## 20. Anti-patterns (DO NOT)

Em đã thấy các pattern này ở LMS khác. Không lặp lại trong instructor.nedu.vn:

1. ❌ **Dashboard 8+ biểu đồ.** Instructor không có thời gian. Surface 1 insight hành động.
2. ❌ **Welcome wizard 5 bước lần đầu login.** Skip — đưa thẳng vào Home.
3. ❌ **Settings page riêng.** Đã có Profile cho timezone + locale. Không có settings tab khác.
4. ❌ **Multiple "Are you sure?" confirms.** Thay bằng undo toast (trừ logout — chỉ 1 confirm là OK).
5. ❌ **Notification center với unread count.** Bell icon đủ. Q&A badge đỏ trong sidebar là đủ.
6. ❌ **Tutorial video 3 phút intro.** Nếu product cần dạy → product broken. Discover qua hộp hướng dẫn Q&A có thể dismiss.
7. ❌ **Role permission matrix modal.** Admin permission = hard-coded trong RLS, không UI.
8. ❌ **"Drafts" tab riêng.** Đã trả lời = đã gửi, không có draft. Auto-save không apply ở Q&A.
9. ❌ **Search box global ở top.** ⌘K modal nếu cần (Phase B). Search box chiếm real estate permanent.
10. ❌ **AI "assistant" chat bubble.** Không có. V1 không có AI feature.
11. ❌ **Pipeline/doanh thu/lead data ở instructor portal.** Vĩnh viễn không. Ranh giới sạch.
12. ❌ **Upload thay vận hành.** Tài liệu = ops chuẩn bị. Instructor chỉ download + request edit.
13. ❌ **PII học viên (tên, email, phone, DOB) visible.** Chỉ aggregate. Liên hệ qua Q&A hoặc support.
14. ❌ **Trực tiếp nhận câu hỏi từ learn.nedu.vn.** Phải qua support filter trước.
15. ❌ **Action có "Undo" cho Q&A.** Đã gửi là đã hiển thị — design forward, không cho rollback.
16. ❌ **Hardcoded 4 chương trình.** Sidebar render dynamic từ data — để Faculty Director tương lai add chương trình mới không cần code lại.
17. ❌ **Hardcoded `vi` locale.** Mọi UI text qua i18n key. Không hardcode tiếng Việt trong JSX.
18. ❌ **Hardcoded `UTC+7`.** Mọi datetime convert qua `useTzStore` + `Intl.DateTimeFormat`.
19. ❌ **localStorage cho sensitive data.** Tokens lưu localStorage là OK (NLH convention), nhưng KHÔNG lưu profile data, KHÔNG lưu QA cache (TanStack Query handle).
20. ❌ **Custom CSS files riêng cho từng component.** Tailwind utility classes + `@theme` tokens. Nếu cần custom → Tailwind `@layer components`.

---

## 21. Open Questions (chưa confirm 100%, có default reasonable)

| # | Question | Default | Cần Nhi confirm |
|---|---|---|---|
| 1 | Google Workspace domain whitelist | `nedu.vn`, `nhileholdings.com` | ⏳ Confirm domain chính xác |
| 2 | API endpoints đã có sẵn ở backend chưa | Phase A mock toàn bộ, IT làm song song | ⏳ Sơn check |
| 3 | Subdomain cuối cùng | `instructor.nedu.vn` | ✅ confirmed |
| 4 | Realtime feedback — polling hay Supabase realtime subscription | Polling 30s đơn giản hơn cho v1 | ⏳ |
| 5 | Avatar upload limit | Max 2MB, image/* only | ✅ default OK |
| 6 | Material edit attachment limit | Max 10MB/file, max 10 files | ✅ default OK |
| 7 | i18n EN coverage v1 | Phase 2 chỉ navigation + headers, Phase 3 full | ✅ confirmed |
| 8 | Timezone default cho NhiLe | `VN` (UTC+7) | ✅ default OK |
| 9 | Notification bell content | List recent 10 notifications (reschedule status update, SLA fallback, edit request done) | ⏳ |
| 10 | "Khoá đã kết thúc > 1 tuần ẩn" — tính từ `end_date` hay `last_session.end_time` | Default = `klass.end_date + 7 days` | ⏳ |

Trả lời 10 questions trên → bump version v1.1.

---

## 22. Handoff cho Claude Code

Đọc doc này xong:

1. **Bước đầu tiên:** Đọc lại section 1 (The ONE Thing + The ONE Person) cho đến khi visualize được NhiLe lúc 8h sáng thứ Hai, 10 phút trước buổi dạy.

2. **Bước thứ hai:** Setup Day 1–2 checklist (section 17). Init repo từ trống.
   ```bash
   npm create vite@latest nedu-instructor -- --template react-ts
   cd nedu-instructor
   ```

3. **Bước thứ ba:** Copy `src/shared/config/*` và `src/shared/analytics/*` từ `nedu-ops` template (cùng org `NhiLe-Holding`). Không modify logic core — chỉ change `ENABLED_HOSTNAMES` cho analytics.

4. **Bước thứ tư:** Build Topbar + Sidebar shell trước. Test với i18n + timezone integration. Nếu shell không feel right → không xây panel trên đó.

5. **Bước thứ năm:** Module 1 (Home) → Module 4 (Programs) → Module 2 (Calendar) → Module 3 (Q&A). Theo đúng thứ tự Sprint section 17.

6. **Gotcha đã biết:**
   - **MSW init order:** `await enableMocking() → analytics.init() → render`. Sai order → request miss mock hoặc UI flicker.
   - **Realtime clock:** `useRealtimeClock` setInterval cần cleanup với `clearInterval` trong useEffect return — leak otherwise.
   - **Sidebar `DynamicProgramsSection`:** Re-compute `getVisibleKlass` mỗi mount; consider memoize với `useMemo` keyed on programs data.
   - **Calendar timezone re-render:** Subscribe `useTzStore` ở component level (không pass props), Zustand auto re-render khi tz đổi.
   - **i18n persistence:** `i18next-browser-languagedetector` cache key `nedu_lang` trong localStorage — đồng bộ với Topbar lang pill.
   - **Supabase RLS với materialized view:** Cần `SECURITY DEFINER` function — test kỹ. Nếu fail → fallback API endpoint computed at backend.
   - **File upload > 5MB:** Chunk upload, không single POST.
   - **Auto-save debounce:** Profile edit textareas dùng debounce 2s, throttle write tránh rate-limit Supabase.

7. **Code standard:** ESLint strict + Prettier. PR review bởi Sơn.

8. **Success definition:** NhiLe mẹ 60 tuổi (Grandma test) có thể hiểu sidebar "đây là chỗ dạy học" trong 10 giây. NhiLe (Expert test) publish câu trả lời Q&A trong < 30 giây mà không cần hỏi ai.

9. **Khi gặp ambiguity:** Default về NLH FE convention (skill `nlh-fe-architecture`). Nếu vẫn unclear → ghi vào `Open Questions` section của file này + ask Nhi.

10. **Khi cần lệch convention:** Viết vào CLAUDE.md project (file này) phần "Exception" với **Why** + **How to apply** — để dev sau biết đây là chủ đích, không phải drift.

---

## 23. Changelog

- **v1.0 · 2026-05-XX** · Initial build-ready spec.
  - Merged 3 sources: Big Picture IT Brief + UserStory v1 (24 stories) + Mockup v20.
  - Stack: Vite + React 19 (NLH Vite-portal convention).
  - 8 modules · 14-day sprint · Phase A/B/C.
  - Brand tokens: navy + sky blue + DM Sans (từ mockup v20).
  - Multi-timezone (16 vùng) + i18n VI/EN (Phase C cho EN full).
  - Google OAuth via NLH auth-central.
  - Dual deploy: Vercel preview (mock) + Cloudflare prod (real BE).
  - Supersedes: NL-CLAUDE-004 (Apr 2026, Magic Upload/Heat Signals vision đã bị phế).

---

*Doc này là **nguồn sự thật duy nhất** cho project `nedu-instructor`. Bất kỳ thay đổi nào về stack, schema, module spec hoặc UX principle → bump version + ghi changelog. Không edit silent.*

**Owner:** Lê Thảo Nhi
**IT Lead:** Lê Hoàng Khắc Sơn
**Next review:** End of Day 7 (mid-sprint demo)
