'use client'; // Ensure this component runs on the client side

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <button onClick={handleLogout} className="btn btn-primary">
      Logout
    </button>
  );
}
