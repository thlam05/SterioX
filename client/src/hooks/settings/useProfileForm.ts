import { useCallback, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { userApi } from '@/api/userApi';
import { PROFILE_UPDATE_ERROR } from '@/constants/settings';

export function useProfileForm() {
  const { user, updateUser } = useAuthStore();

  const [newUsername, setNewUsername] = useState(user?.username ?? '');
  const [newEmail, setNewEmail] = useState(user?.email ?? '');
  const [profileError, setProfileError] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const isProfileChanged =
    newUsername !== (user?.username ?? '') || newEmail !== (user?.email ?? '');

  const resetChanges = useCallback(() => {
    setNewUsername(user?.username ?? '');
    setNewEmail(user?.email ?? '');
    setProfileError('');
  }, [user]);

  const updateProfile = useCallback(async () => {
    if (!user || !isProfileChanged || isUpdatingProfile) return;

    setProfileError('');
    setIsUpdatingProfile(true);

    try {
      const updatedUser = await userApi.updateUser(user.id, {
        username: newUsername,
        email: newEmail,
        avatarImageUrl: user.avatarImageUrl,
        roles: user.roles,
      });

      updateUser(updatedUser);
    } catch (error) {
      console.log(error);
      setProfileError(
        error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : PROFILE_UPDATE_ERROR,
      );
    } finally {
      setIsUpdatingProfile(false);
    }
  }, [
    user,
    newUsername,
    newEmail,
    isProfileChanged,
    isUpdatingProfile,
    updateUser,
  ]);

  return {
    newUsername,
    setNewUsername,
    newEmail,
    setNewEmail,
    profileError,
    isProfileChanged,
    isUpdatingProfile,
    resetChanges,
    updateProfile,
  };
}
