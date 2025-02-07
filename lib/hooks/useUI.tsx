import { useState } from 'react';

export default () => {
  const [settings, setSettings] = useState(false);
  const [profile, setProfile] = useState(false);
  const [mobile, setMobile] = useState(false);

  const toggleSettings = () => setSettings(!settings);
  const toggleProfile = () => setProfile(!profile);
  const toggleMobile = () => setMobile(!mobile);

  const resetUI = () => {
    setMobile(false);
    setProfile(false);
    setSettings(false);
  };

  return {
    settings,
    profile,
    mobile,
    toggleMobile,
    toggleProfile,
    toggleSettings,
    resetUI,
  };
};
