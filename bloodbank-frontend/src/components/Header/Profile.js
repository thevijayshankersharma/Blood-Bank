import React, { useContext } from 'react';
import GlobalContext from '@/context/GlobalContext';
import useApiHelper from '@/api';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

function Profile() {
  const gContext = useContext(GlobalContext);
  const api = useApiHelper();
  const router = useRouter();

  const handleLogout = () => {
    api.signOut().then(res => {
      router.push('/sign-in');
      gContext.setIsLoggedIn(false);
      Cookies.remove('accessToken');
    });
  };

  return (
    <div className="dropdown">
      <button 
        className="btn btn-secondary dropdown-toggle" 
        type="button" 
        data-bs-toggle="dropdown" 
        aria-expanded="false"
      >
        <i className="bi bi-person-circle"></i>
        <span className="ms-2">{gContext?.user?.username || 'User'}</span>
      </button>
      <ul className="dropdown-menu dropdown-menu-end">
        <li><a className="dropdown-item" href="/update-profile"><i className="bi bi-person"></i> Profile</a></li>
        <li><button className="dropdown-item" onClick={handleLogout}><i className="bi bi-box-arrow-right"></i> Logout</button></li>
      </ul>
    </div>
  );
}

export default Profile;