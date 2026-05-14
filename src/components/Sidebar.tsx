import React, { useState } from "react";
import { LayoutDashboard, Map, MapPin, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col items-center py-8 bg-background border-r border-border h-full gap-8">
      <div className="flex flex-col items-center justify-center h-12 w-12 rounded-2xl bg-white dark:bg-gray-800 shadow-sm mb-8 overflow-hidden p-1">
        <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
      </div>

      <nav className="flex flex-col gap-6 w-full items-center">
        <NavItem icon={<LayoutDashboard size={24} />} active={activeTab === 0} onClick={() => setActiveTab(0)} />
        <NavItem icon={<Map size={24} />} active={activeTab === 1} onClick={() => setActiveTab(1)} />
        <NavItem icon={<MapPin size={24} />} active={activeTab === 2} onClick={() => setActiveTab(2)} />
        <NavItem icon={<Calendar size={24} />} active={activeTab === 3} onClick={() => setActiveTab(3)} />
        <NavItem icon={<Settings size={24} />} active={activeTab === 4} onClick={() => setActiveTab(4)} />
      </nav>
    </div>
  );
};

const NavItem = ({ icon, active = false, onClick }: { icon: React.ReactNode; active?: boolean; onClick?: () => void }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-3 rounded-2xl cursor-pointer transition-all duration-300 group",
        active
          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
          : "text-muted-foreground hover:bg-orange-100 hover:text-orange-500 dark:hover:bg-orange-900/20"
      )}
    >
      {icon}
    </div>
  );
};
