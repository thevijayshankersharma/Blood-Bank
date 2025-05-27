import React, { useContext, useEffect, useState } from 'react';
import { PageWrapper } from '@/components/Wrapper';
import useApiHelper from '@/api';
import { useRouter } from 'next/router';
import GlobalContext from '@/context/GlobalContext';
import { FaHospital, FaTint, FaInfoCircle, FaSearch, FaHeartbeat } from 'react-icons/fa';

const DonateBlood = () => {
  const [hospital, setHospital] = useState();
  const [hospitalList, setHospitalList] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const api = useApiHelper();
  const router = useRouter();
  const gContext = useContext(GlobalContext);

  const donateBlood = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    
    api.createDonor(hospital)
      .then(res => {
        router.push('/blood-bank');
      })
      .catch(error => {
        setError(error.response?.data?.[0] || 'An error occurred while processing your donation');
        setSubmitting(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    api.hospitalList()
      .then(res => {
        setHospitalList(res.data);
        setFilteredHospitals(res.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching hospital list:', error);
        setError('Failed to load hospitals. Please try again.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredHospitals(hospitalList);
    } else {
      const filtered = hospitalList.filter(hospital => 
        hospital?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital?.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHospitals(filtered);
    }
  }, [searchTerm, hospitalList]);

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