export function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-xl text-center px-6">
        <h1 className="text-3xl font-semibold text-slate-900">instructor.nedu.vn</h1>
        <p className="mt-3 text-slate-600">
          Workspace của Người Dẫn Đường — scaffold đã sẵn sàng. Tham khảo
          <code className="mx-1 px-1.5 py-0.5 bg-slate-200 rounded text-sm">CLAUDE.md</code>
          để bắt đầu build 4 module Core (M1–M4 + M8 Auth).
        </p>
      </div>
    </main>
  );
}
