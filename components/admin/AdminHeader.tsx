import { Bell } from "lucide-react";

export default function AdminHeader({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-bold text-secondary">{title}</h1>
      <button type="button" className="p-2 rounded-lg hover:bg-gray-100 relative">
        <Bell className="w-5 h-5 text-secondary" />
      </button>
    </header>
  );
}
