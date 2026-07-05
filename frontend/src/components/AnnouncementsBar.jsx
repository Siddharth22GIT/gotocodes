import { Megaphone } from "lucide-react";

export default function AnnouncementsBar({ announcements }) {
  if (!announcements || announcements.length === 0) return null;
  const top = announcements[0];

  return (
    <div className="bg-violet/10 border-b border-violet/20 py-2.5 px-5">
      <div className="max-w-7xl mx-auto flex items-center gap-3 text-sm">
        <Megaphone size={16} className="text-violet-light shrink-0" />
        <span className="font-mono text-xs text-violet-light">{top.title}:</span>
        <span className="text-mist-dim truncate">{top.body}</span>
      </div>
    </div>
  );
}
