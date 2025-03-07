import React from 'react';
import { supabase } from '@/lib/supabase';

const NavBar = () => {
  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) console.error('Error signing in:', error.message);
  };

  return (
    <nav>
      <h1>My App</h1>
      <button onClick={handleSignIn}>Sign In</button>
    </nav>
  );
};

export default NavBar; 