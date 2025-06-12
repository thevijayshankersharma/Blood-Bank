import useApiHelper from '@/api'
import GlobalContext from '@/context/GlobalContext'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'

const Sidebar = ({ page }) => {
  const gContext = useContext(GlobalContext)

  return (
    <div className='sidebar'>
      <h6 className='mt-3 mb-5 px-3'>Blood Bank Management System</h6>
      <ul className='px-3'>
        <li className={`nav-link ${page == 'Home' && 'active'}`}>
          <Link className='nav-item' href='/'><i className="bi bi-house-door me-2"></i>Home</Link>
        </li>
        <li className={`nav-link ${page == 'Hospitals' && 'active'}`}>
          <Link className='nav-item' href='/hospitals'><i className="bi bi-hospital me-2"></i>Hospitals</Link>
        </li>
        <li className={`nav-link ${page == 'Blood Bank' && 'active'}`}>
          <Link className='nav-item' href={`${gContext?.isLoggedIn ? '/blood-bank' : '/sign-in'}`}><i className="bi bi-bank me-2"></i>Blood Bank</Link>
        </li>
        <li className={`nav-link ${page == 'Donor' && 'active'}`}>
          <Link className='nav-item' href={`${gContext?.isLoggedIn ? '/donor' : '/sign-in'}`}><i className="bi bi-person-add me-2"></i>Donor</Link>
        </li>
        <li className={`nav-link ${page == 'Recipient' && 'active'}`}>
          <Link className='nav-item' href={`${gContext?.isLoggedIn ? '/recipient' : '/sign-in'}`}><i className="bi bi-person-check me-2"></i>Recipient</Link>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar