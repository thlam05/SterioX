import type { TabItem } from '@/constants/settings';

type SettingsSidebarProps = {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
};

export function SettingsSidebar({
  tabs,
  activeTab,
  onTabChange,
}: SettingsSidebarProps) {
  return (
    <aside className="lg:col-span-1 flex flex-row lg:flex-col gap-1.5 bg-background border border-accent p-3 rounded-2xl h-fit overflow-x-auto lg:overflow-visible">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border text-left ${
              isActive
                ? 'bg-selection text-primary border-primary'
                : 'bg-transparent text-secondary border-transparent hover:bg-accent hover:text-foreground'
            } shrink-0 lg:shrink`}
          >
            <Icon
              className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-secondary'}`}
            />
            {tab.label}
          </button>
        );
      })}
    </aside>
  );
}
