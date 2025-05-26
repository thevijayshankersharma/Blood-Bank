import React, { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/Wrapper';
import useApiHelper from '@/api';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaSearch, FaSort, FaUserAlt, FaTint, FaHospital, FaCalendarAlt, FaHandHoldingMedical, FaBoxes } from 'react-icons/fa';
import moment from 'moment';

const Recipient = () => {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const api = useApiHelper();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    api.getRecipient(router.query)
      .then(res => {
        setRecipients(res.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching recipient data:', error);
        setError('Failed to load recipient data. Please try again.');
        setLoading(false);
      });
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

  // Format date to be more readable
  const formatDate = (dateString) => {
    return moment(dateString).fromNow();
  };

  return (
    <PageWrapper page="Recipient">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold"><FaHandHoldingMedical className="me-2" />Recipients</h4>
        <Link href="/receive-blood">
          <button className='btn btn-primary'>
            <FaTint className="me-2" />Receive Blood
          </button>
        </Link>
      </div>
      
      <div className="card mb-4">
        <div className="card-body">
          <div className='row g-3 align-items-end'>
            <div className="col-md-6">
              <label htmlFor="search" className="form-label">Search Recipients</label>
              <div className="input-group">
                <span className="input-group-text"><FaSearch /></span>
                <input
                  id="search"
                  className='form-control'
                  type="text"
                  name="search"
                  placeholder='Search by name...'
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
                  <option value="owner">Recipient (A-Z)</option>
                  <option value="-owner">Recipient (Z-A)</option>
                  <option value="blood_bank__hospital">Hospital (A-Z)</option>
                  <option value="-blood_bank__hospital">Hospital (Z-A)</option>
                  <option value="created_at">Date (Oldest first)</option>
                  <option value="-created_at">Date (Newest first)</option>
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
          <p className="mt-3">Loading recipient data...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : recipients.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No recipient data found. Try adjusting your search criteria.
        </div>
      ) : (
        <div className="row">
          {recipients.map(recipient => (
            <div key={recipient?.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-header bg-white border-bottom-0 pt-3 pb-0">
                  <h5 className="card-title">
                    <FaUserAlt className="me-2" />
                    {recipient?.recipient || 'Unknown Recipient'}
                  </h5>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div 
                      className="blood-group-badge me-3" 
                      style={{
                        backgroundColor: getBloodGroupColor(recipient?.blood_bank_details?.blood_group),
                        color: 'white',
                        padding: '8px 15px',
                        borderRadius: '50px',
                        fontWeight: 'bold',
                        fontSize: '1.2rem'
                      }}
                    >
                      {recipient?.blood_bank_details?.blood_group}
                    </div>
                    <div>
                      <p className="mb-0 text-muted">Blood Group</p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center mb-3">
                    <div className="me-3">
                      <FaHospital size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="mb-0 text-muted">Hospital</p>
                      <h6>{recipient?.blood_bank_details?.hospital || 'Unknown Hospital'}</h6>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center mb-3">
                    <div className="me-3">
                      <FaBoxes size={20} className="text-success" />
                    </div>
                    <div>
                      <p className="mb-0 text-muted">Quantity</p>
                      <h6>{recipient?.bag_quantity} {recipient?.bag_quantity === 1 ? 'unit' : 'units'}</h6>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <FaCalendarAlt size={20} className="text-secondary" />
                    </div>
                    <div>
                      <p className="mb-0 text-muted">Received Date</p>
                      <h6>{formatDate(recipient?.created_at)}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default Recipient