type Props = {
  name?: string;
  isActive?: boolean;
  lastLogin?: string | Date;
  size?: "sm" | "md" | "lg";
};

function formatDate(input?: string | Date) {
  if (!input) return "";
  const date = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return String(input);

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getInitials(name?: string) {
  if (!name) return "U";
  const tokens = name.trim().split(/\s+/);
  const first = tokens[0] || "";
  if (first.length === 1 && tokens[1]) {
    return (first + tokens[1][0]).slice(0, 2).toUpperCase();
  }
  return first.slice(0, 2).toUpperCase();
}

export default function AvatarBadge({
  name,
  isActive = true,
  lastLogin,
  size = "md",
}: Props) {
  const initials = getInitials(name);

  const sizes = {
    sm: {
      container: "w-9 h-9 text-sm",
      dot: "w-2.5 h-2.5 bottom-0.5 right-0.5",
    },
    md: { container: "w-12 h-12 text-base", dot: "w-3 h-3 bottom-1 right-1" },
    lg: {
      container: "w-16 h-16 text-lg",
      dot: "w-3.5 h-3.5 bottom-1.5 right-1.5",
    },
  } as const;

  const s = sizes[size];

  const statusBg = isActive ? "bg-[#F0FDF5]" : "bg-[#FEF2F2]";
  const statusColor = isActive ? "bg-[#16A34A]" : "bg-[#DC2626]";

  return (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className={
            "rounded-full border border-[#E8E8E8] flex items-center justify-center text-[#1C1C1C]  " +
            s.container +
            " bg-gradient-to-br from-[#F9FAFB] to-[#F9FAFB]"
          }
          aria-hidden
        >
          {initials}
        </div>

        <span
          className={`absolute ${s.dot} ${statusBg} rounded-full flex items-center justify-center`}
          style={{ transform: "translate(0, 0)" }}
          aria-hidden
        >
          <span
            className={`${statusColor} rounded-full block w-full h-full`}
            style={{ boxShadow: "0 0 0 2px rgba(255,255,255,0.9)" }}
          />
        </span>
      </div>

      {/* Name + last login */}
      <div className="flex flex-col">
        {lastLogin && (
          <span className="text-sm font-light text-[#676767]">
            Last login:
            <span className="block mt-1">{formatDate(lastLogin)}</span>
          </span>
        )}
      </div>
    </div>
  );
}
