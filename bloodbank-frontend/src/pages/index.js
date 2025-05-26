import React, { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/Wrapper';
import useApiHelper from '@/api';
import { useRouter } from 'next/router';
import { FaSearch, FaSort, FaHospital, FaMapMarkerAlt, FaPhone, FaBuilding, FaEnvelope } from 'react-icons/fa';

const Home = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const api = useApiHelper();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    api.hospitalList(router.query) 
      .then(res => {
        setHospitals(res.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching hospital data:', error);
        setError('Failed to load hospital data. Please try again.');
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

  return (
    <PageWrapper page="Home">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold"><FaHospital className="me-2" />Hospital List</h4>
      </div>
      
      <div className="card mb-4">
        <div className="card-body">
          <div className='row g-3 align-items-end'>
            <div className="col-md-6">
              <label htmlFor="search" className="form-label">Search Hospitals</label>
              <div className="input-group">
                <span className="input-group-text"><FaSearch /></span>
                <input
                  id="search"
                  className='form-control'
                  type="text"
                  name="search"
                  placeholder='Search by name, email, or phone...'
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
                  <option value="name">Hospital Name (A-Z)</option>
                  <option value="-name">Hospital Name (Z-A)</option>
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
          <p className="mt-3">Loading hospitals...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : hospitals.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No hospitals found. Try adjusting your search criteria.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th><FaHospital className="me-2" />Name</th>
                <th><FaPhone className="me-2" />Phone</th>
                <th><FaEnvelope className="me-2" />Email</th>
                <th><FaMapMarkerAlt className="me-2" />Address</th>
              </tr>
            </thead>
            <tbody>
              {hospitals.map(hospital => (
                <tr key={hospital?.id}>
                  <td className="fw-medium">{hospital?.name || 'N/A'}</td>
                  <td>{hospital?.phone_number1 || 'N/A'}</td>
                  <td>
                    <a href={`mailto:${hospital?.email}`} className="text-decoration-none">
                      {hospital?.email || 'N/A'}
                    </a>
                  </td>
                  <td>{hospital?.address || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageWrapper>
  );
};

export default Home