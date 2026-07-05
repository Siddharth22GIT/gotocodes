export default function Button3D({
  children,
  onClick,
  variant = "violet",
  size = "md",
  type = "button",
  className = "",
  disabled = false,
}) {
  const variants = {
    violet:
      "bg-violet text-white shadow-[0_6px_0_0_#5C3FE0,0_10px_24px_-6px_rgba(124,92,255,0.5)] active:shadow-[0_2px_0_0_#5C3FE0,0_4px_12px_-4px_rgba(124,92,255,0.5)] hover:brightness-110",
    amber:
      "bg-amber text-ink shadow-[0_6px_0_0_#C98421,0_10px_24px_-6px_rgba(255,180,84,0.5)] active:shadow-[0_2px_0_0_#C98421,0_4px_12px_-4px_rgba(255,180,84,0.5)] hover:brightness-105",
    ghost:
      "bg-ink-700 text-mist border border-white/10 shadow-[0_6px_0_0_#0A0B12] active:shadow-[0_2px_0_0_#0A0B12] hover:border-violet/40",
  };
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-3d translate-y-0 hover:-translate-y-0.5 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
