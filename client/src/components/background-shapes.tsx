export default function BackgroundShapes({ variant = "default" }: { variant?: "default" | "hero" | "tools" }) {
  if (variant === "hero") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -left-32 w-80 h-80 bg-gradient-to-tr from-emerald-500/15 to-cyan-500/15 rounded-full blur-2xl"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl blur-xl transform rotate-45"></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-gradient-to-l from-pink-500/10 to-rose-500/10 rounded-full blur-lg"></div>
      </div>
    );
  }

  if (variant === "tools") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 right-10 w-64 h-64 bg-gradient-to-bl from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-tr from-violet-500/10 to-purple-500/10 rounded-2xl blur-xl transform rotate-12"></div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-indigo-500/15 to-purple-600/15 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-tr from-emerald-500/15 to-cyan-500/15 rounded-full blur-2xl"></div>
    </div>
  );
}
