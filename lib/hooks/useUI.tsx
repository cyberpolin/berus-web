import { useState } from 'react';

export default () => {
  const [settings, setSettings] = useState(false);
  const [profile, setProfile] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [isAdminProfile, setIsAdminProlie] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem('isAdminProfile');
      return storedValue !== null ? storedValue === 'true' : false;
    }
    return false;
  });

  const toggleSettings = () => setSettings(!settings);
  const toggleProfile = () => setProfile(!profile);
  const toggleMobile = () => setMobile(!mobile);
  const toggleAdmin = () => {
    localStorage.setItem('isAdminProfile', JSON.stringify(!isAdminProfile));
    setIsAdminProlie(!isAdminProfile);
  };

  const resetUI = () => {
    setMobile(false);
    setProfile(false);
    setSettings(false);
  };

  return {
    isAdminProfile,
    settings,
    profile,
    mobile,
    toggleAdmin,
    toggleMobile,
    toggleProfile,
    toggleSettings,
    resetUI,
  };
};
