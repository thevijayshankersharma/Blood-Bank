import React, { useEffect, useState, useContext } from 'react';
import { PageWrapper } from '@/components/Wrapper';
import useApiHelper from '@/api';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaSearch, FaSort, FaHospital, FaTint, FaBoxes, FaDonate, FaExclamationTriangle } from 'react-icons/fa';
import Cookies from 'js-cookie';
import GlobalContext from '@/context/GlobalContext';

const BloodBank = () => {
  const { isLoggedIn } = useContext(GlobalContext);
  const [bloodBank, setBloodBank] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const api = useApiHelper();
  const router = useRouter();
  
  // Check for success message in URL
  useEffect(() => {
    if (router.query.donation === 'success') {
      setShowSuccess(true);
      // Remove the query parameter from URL without reloading the page
      const url = new URL(window.location);
      url.searchParams.delete('donation');
      window.history.replaceState({}, '', url);
      
      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [router.query]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoggedIn) {
        router.push('/sign-in');
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const res = await api.getBloodBank(router.query);
        setBloodBank(res.data);
        setLoading(false);
      } catch (error) {
        if (error?.response?.status === 401) {
          router.push('/sign-in');
        } else {
          console.error('Error fetching blood bank data:', error);
          setError('Failed to load blood bank data. Please try again.');
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [router.query]);

  const handleFilter = e => {
    const { name, value } = e.target;
    
    if (name === 'search') {
      setSearchTerm(value);
      // Debounce search to avoid too many requests
      const timeoutId = setTimeout(() => {
        router.push({
          pathname: router.pathname,
          query: { ...router.query, [name]: value }
        });
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
    
    router.push({
      pathname: router.pathname,
      query: { ...router.query, [name]: value }
    });
  };

  // Function to get color based on blood group
  const getBloodGroupColor = (bloodGroup) => {
    const colors = {
      'A+': '#ef4444',
      'A-': '#f87171',
      'B+': '#3b82f6',
      'B-': '#60a5fa',
      'AB+': '#8b5cf6',
      'AB-': '#a78bfa',
      'O+': '#22c55e',
      'O-': '#4ade80',
    };
    return colors[bloodGroup] || '#6b7280';
  };

  // Function to get color based on quantity
  const getQuantityColor = (quantity) => {
    if (quantity <= 5) return 'text-danger';
    if (quantity <= 10) return 'text-warning';
    return 'text-success';
  };

  return (
    <PageWrapper page="Blood Bank">
      <div className="container py-4">
        {/* Error Message */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
            <FaExclamationTriangle className="me-2" />
            <div>{error}</div>
          </div>
        )}
        
        {/* Success Message */}
        {showSuccess && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                <strong>Success!</strong> Your blood donation request has been received and is pending admin approval. It will appear in the blood bank only after an administrator approves it.
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowSuccess(false)}
                  aria-label="Close"
                ></button>
              </div>
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                {error}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setError(null)}
                  aria-label="Close"
                ></button>
              </div>
            </div>
          </div>
        )}
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold"><FaTint className="me-2" />Blood Bank</h4>
          <Link href="/donate-blood">
            <button className='btn btn-primary'>
              <FaDonate className="me-2" />Donate Blood
            </button>
          </Link>
        </div>
        
        <div className="card mb-4">
        <div className="card-body">
          <div className='row g-3 align-items-end'>
            <div className="col-md-6">
              <label htmlFor="search" className="form-label">Search Blood Bank</label>
              <div className="input-group">
                <span className="input-group-text"><FaSearch /></span>
                <input
                  id="search"
                  className='form-control'
                  type="text"
                  name="search"
                  placeholder='Search by hospital...'
                  onChange={handleFilter}
                  value={searchTerm}
                />
              </div>
            </div>
            <div className="col-md-6">
              <label htmlFor="ordering" className="form-label">Sort By</label>
              <div className="input-group">
                <span className="input-group-text"><FaSort /></span>
                <select 
                  id="ordering"
                  onChange={handleFilter} 
                  className='form-select' 
                  name="ordering"
                >
                  <option value="default">Default</option>
                  <option value="name">Hospital (A-Z)</option>
                  <option value="-name">Hospital (Z-A)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading blood bank data...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : bloodBank.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No blood bank data found. Try adjusting your search criteria.
        </div>
      ) : (
        <div className="row">
          {bloodBank.map(bank => (
            <div key={bank?.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-header bg-white border-bottom-0 pt-3 pb-0">
                  <h5 className="card-title">
                    <FaHospital className="me-2" />
                    {bank?.hospital_name || 'Unknown Hospital'}
                  </h5>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div 
                      className="blood-group-badge me-3" 
                      style={{
                        backgroundColor: getBloodGroupColor(bank?.blood_group),
                        color: 'white',
                        padding: '8px 15px',
                        borderRadius: '50px',
                        fontWeight: 'bold',
                        fontSize: '1.2rem'
                      }}
                    >
                      {bank?.blood_group}
                    </div>
                    <div>
                      <p className="mb-0 text-muted">Blood Group</p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <FaBoxes size={24} className={getQuantityColor(bank?.bag_quantity)} />
                    </div>
                    <div>
                      <p className="mb-0 text-muted">Available Quantity</p>
                      <h4 className={getQuantityColor(bank?.bag_quantity)}>
                        {bank?.bag_quantity} {bank?.bag_quantity === 1 ? 'unit' : 'units'}
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-white border-top-0 text-end">
                  <Link href="/receive-blood">
                    <button className="btn btn-sm btn-outline-primary">
                      Request Blood
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </PageWrapper>
  );
};

export default BloodBank;