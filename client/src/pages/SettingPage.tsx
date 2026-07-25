import { useState } from 'react';
import { SETTINGS_TABS } from '@/constants/settings';
import { useProfileForm } from '@/hooks/settings/useProfileForm';
import { SettingsSidebar } from '@/components/settings/SettingsSidebar';
import { ProfileTab } from '@/components/settings/ProfileTab';
import { DisplayTab } from '@/components/settings/DisplayTab';
import { NotificationsTab } from '@/components/settings/NotificationsTab';
import { SecurityTab } from '@/components/settings/SecurityTab';

export default function SettingsContent() {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifyLive, setNotifyLive] = useState(true);
  const [notifyChat, setNotifyChat] = useState(false);

  const {
    newUsername,
    setNewUsername,
    newEmail,
    setNewEmail,
    profileError,
    isProfileChanged,
    isUpdatingProfile,
    resetChanges,
    updateProfile,
  } = useProfileForm();

  return (
    <div className="w-full bg-background text-foreground font-sans space-y-8 md:space-y-10 overflow-x-hidden">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-primary rounded-full"></div>
          <h3 className="text-xl font-extrabold tracking-tight">
            Cài đặt tài khoản
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 auto-rows-auto">
        <SettingsSidebar
          tabs={SETTINGS_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="lg:col-span-3 bg-background border border-accent rounded-2xl p-4 sm:p-6 space-y-8 min-w-0">
          {activeTab === 'profile' && (
            <ProfileTab
              newUsername={newUsername}
              onUsernameChange={setNewUsername}
              newEmail={newEmail}
              onEmailChange={setNewEmail}
              profileError={profileError}
              isProfileChanged={isProfileChanged}
              isUpdatingProfile={isUpdatingProfile}
              onCancel={resetChanges}
              onSave={updateProfile}
            />
          )}

          {activeTab === 'display' && <DisplayTab />}

          {activeTab === 'notify' && (
            <NotificationsTab
              notifyLive={notifyLive}
              onNotifyLiveChange={setNotifyLive}
              notifyChat={notifyChat}
              onNotifyChatChange={setNotifyChat}
            />
          )}

          {activeTab === 'security' && <SecurityTab />}
        </div>
      </div>
    </div>
  );
}
