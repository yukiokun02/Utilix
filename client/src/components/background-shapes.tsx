export default function BackgroundShapes({ variant = "default" }: { variant?: "default" | "hero" | "tools" }) {
  if (variant === "hero") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 rounded-full"></div>
        <div className="absolute bottom-20 -left-32 w-80 h-80 bg-gradient-to-tr from-emerald-500/25 to-cyan-500/25 rounded-full"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl transform rotate-45"></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-gradient-to-l from-pink-500/20 to-rose-500/20 rounded-full"></div>
        <div className="absolute top-1/2 right-1/4 w-40 h-16 bg-gradient-to-r from-violet-500/15 to-indigo-500/15 rounded-full transform rotate-12"></div>
        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-xl transform -rotate-12"></div>
      </div>
    );
  }

  if (variant === "tools") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 right-10 w-64 h-64 bg-gradient-to-bl from-cyan-500/20 to-blue-500/20 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-tr from-violet-500/20 to-purple-500/20 rounded-2xl transform rotate-12"></div>
        <div className="absolute top-60 left-1/3 w-32 h-32 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 rounded-full"></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-56 bg-gradient-to-t from-pink-500/15 to-rose-500/15 rounded-full transform rotate-45"></div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-indigo-500/25 to-purple-600/25 rounded-full"></div>
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-tr from-emerald-500/25 to-cyan-500/25 rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-r from-amber-500/15 to-orange-500/15 rounded-2xl transform rotate-45"></div>
    </div>
  );
}
