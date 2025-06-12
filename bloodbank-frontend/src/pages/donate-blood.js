import React, { useContext, useEffect, useState } from 'react';
import { PageWrapper } from '@/components/Wrapper';
import useApiHelper from '@/api';
import { useRouter } from 'next/router';
import GlobalContext from '@/context/GlobalContext';
import { FaHospital, FaTint, FaInfoCircle, FaSearch, FaHeartbeat, FaSignInAlt } from 'react-icons/fa';
import Cookies from 'js-cookie';
import Link from 'next/link';

const DonateBlood = () => {
  // All hooks must be called at the top level, before any conditional returns
  const router = useRouter();
  const gContext = useContext(GlobalContext);
  const [hospital, setHospital] = useState();
  const [hospitalList, setHospitalList] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isClient, setIsClient] = useState(false);
  const api = useApiHelper();
  
  // Set isClient to true after component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Redirect to sign-in if not logged in
  useEffect(() => {
    if (isClient) { // Only run on client-side
      const token = Cookies.get('accessToken');
      if (!token) {
        router.push('/sign-in?next=' + encodeURIComponent(router.asPath));
      }
    }
  }, [router, isClient]);
  
  // Fetch hospital list
  useEffect(() => {
    if (!isClient || !gContext.isLoggedIn) return;
    
    const fetchHospitals = async () => {
      try {
        setLoading(true);
        const response = await api.hospitalList();
        setHospitalList(response.data);
        setFilteredHospitals(response.data);
      } catch (error) {
        console.error('Error fetching hospital list:', error);
        setError('Failed to load hospitals. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHospitals();
  }, [isClient, gContext.isLoggedIn]);
  
  // Filter hospitals based on search term
  useEffect(() => {
    if (!isClient) return;
    
    if (searchTerm.trim() === '') {
      setFilteredHospitals(hospitalList);
    } else {
      const filtered = hospitalList.filter(hospital => 
        hospital?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital?.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHospitals(filtered);
    }
  }, [searchTerm, hospitalList, isClient]);
  
  // Show loading state on initial render
  if (!isClient) {
    return (
      <PageWrapper page="Loading...">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </PageWrapper>
    );
  }
  
  // Redirect to sign-in if not logged in
  if (!gContext.isLoggedIn) {
    return (
      <PageWrapper page="Sign In Required">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card shadow-sm">
                <div className="card-body text-center p-5">
                  <div className="mb-4">
                    <FaSignInAlt size={48} className="text-danger mb-3" />
                    <h2>Authentication Required</h2>
                    <p className="text-muted">Please sign in to continue with your blood donation.</p>
                  </div>
                  <Link href={`/sign-in?next=${encodeURIComponent(router.asPath)}`} className="btn btn-danger btn-lg">
                    Sign In to Continue
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }
  // State and API hook are now at the top of the component

  const donateBlood = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    
    // Check if user is authenticated
    const token = Cookies.get('accessToken');
    if (!token) {
      setError('Your session has expired. Please sign in again.');
      setSubmitting(false);
      router.push(`/sign-in?next=${encodeURIComponent(router.asPath)}`);
      return;
    }
    
    // Check if hospital is selected
    if (!hospital) {
      setError('Please select a hospital');
      setSubmitting(false);
      return;
    }
    
    // Create donation request
    const donationData = {
      hospital: hospital?.hospital, // Use the selected hospital ID
      status: 'pending',
      user: gContext.user?.id,  // Include user ID
      blood_group: gContext.user?.blood_group
    };
    
    console.log('Sending donation data:', donationData);
    
    api.createDonor(donationData)
      .then(res => {
        // Redirect to success page or show success message
        router.push('/blood-bank?donation=success');
      })
      .catch(error => {
        console.error('Donation error:', error);
        
        // Handle different types of errors
        if (error.response) {
          // Handle HTTP errors
          if (error.response.status === 401) {
            setError('Your session has expired. Please sign in again.');
            // Clear invalid token
            Cookies.remove('accessToken');
            gContext.setIsLoggedIn(false);
            router.push(`/sign-in?next=${encodeURIComponent(router.asPath)}`);
          } else if (error.response.data) {
            // Handle validation errors
            const errorData = error.response.data;
            if (typeof errorData === 'object') {
              // Handle field-specific errors
              const errorMessages = Object.entries(errorData).map(
                ([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(' ') : errors}`
              );
              setError(errorMessages.join('\n'));
            } else if (Array.isArray(errorData)) {
              setError(errorData.join('\n'));
            } else {
              setError(errorData.toString());
            }
          } else {
            setError('An unexpected error occurred. Please try again.');
          }
        } else if (error.request) {
          // The request was made but no response was received
          setError('Unable to connect to the server. Please check your internet connection.');
        } else {
          // Something happened in setting up the request
          setError(error.message || 'An error occurred while processing your request');
        }
        
        setSubmitting(false);
      });
  };

  // All effects have been moved to the top level

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <PageWrapper page="Donate Blood">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold"><FaTint className="me-2 text-danger" />Donate Blood</h4>
      </div>
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading hospitals...</p>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3">
                <h5 className="card-title mb-0">
                  <FaHeartbeat className="me-2 text-danger" />
                  Blood Donation Form
                </h5>
              </div>
              <div className="card-body p-4">
                {gContext?.user?.blood_group ? (
                  <div className="alert alert-info d-flex align-items-center mb-4" role="alert">
                    <FaInfoCircle className="me-2" size={18} />
                    <div>
                      Your blood group is <strong>{gContext.user.blood_group}</strong>. Thank you for donating blood!
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-warning d-flex align-items-center mb-4" role="alert">
                    <FaInfoCircle className="me-2" size={18} />
                    <div>
                      Please update your blood group in your profile before donating.
                    </div>
                  </div>
                )}
                
                <div className="alert alert-primary d-flex align-items-center mb-4" role="alert">
                  <FaInfoCircle className="me-2" size={18} />
                  <div>
                    <strong>Note:</strong> Your donation request will require administrator approval before it appears in the blood bank. This ensures that only verified physical donations are recorded in our system.
                  </div>
                </div>
                
                <form onSubmit={donateBlood}>
                  <div className="mb-4">
                    <label htmlFor="search" className="form-label">Search Hospitals</label>
                    <div className="input-group mb-3">
                      <span className="input-group-text"><FaSearch /></span>
                      <input
                        type="text"
                        className="form-control"
                        id="search"
                        placeholder="Search by hospital name"
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="hospital" className="form-label">Select Hospital</label>
                    <div className="input-group">
                      <span className="input-group-text"><FaHospital /></span>
                      <select
                        name="hospital"
                        id="hospital"
                        className="form-select form-select-lg"
                        onChange={(e) => setHospital({ "hospital": e.target.value })}
                        required
                      >
                        <option value="">-- Select Hospital --</option>
                        {filteredHospitals.map(hospital => (
                          <option key={hospital.id} value={hospital.id}>{hospital.name}</option>
                        ))}
                      </select>
                    </div>
                    {filteredHospitals.length === 0 && (
                      <div className="form-text text-danger mt-2">No hospitals match your search criteria.</div>
                    )}
                  </div>
                  
                  {error && <div className="alert alert-danger">{error}</div>}
                  
                  <div className="d-grid gap-2">
                    <button 
                      className='btn btn-primary btn-lg'
                      type="submit"
                      disabled={submitting || !gContext?.user?.blood_group}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaTint className="me-2" /> Donate Blood
                        </>
                      )}
                    </button>
                  </div>
                  
                  {!gContext?.user?.blood_group && 
                    <div className="text-center mt-3 text-danger">
                      <FaInfoCircle className="me-1" /> Please add your blood group in your profile
                    </div>
                  }
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default DonateBlood