import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import GlobalContext from '@/context/GlobalContext';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const { isLoggedIn } = useContext(GlobalContext);

  useEffect(() => {
    // If not logged in and not on auth pages, redirect to sign-in
    if (isLoggedIn === false && 
        !["/sign-in", "/sign-up", "/"].includes(router.pathname)) {
      router.push(`/sign-in?next=${router.pathname}`);
    }
  }, [isLoggedIn, router]);

  // Don't render anything while checking auth status
  if (isLoggedIn === null) {
    return null;
  }

  return children;
};

export default ProtectedRoute;