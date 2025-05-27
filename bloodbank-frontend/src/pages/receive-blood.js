import React, { useContext, useEffect, useState } from 'react';
import { PageWrapper } from '@/components/Wrapper';
import useApiHelper from '@/api';
import { useRouter } from 'next/router';
import GlobalContext from '@/context/GlobalContext';
import { FaSearch, FaTint, FaInfoCircle, FaHospital, FaBoxes, FaFilter } from 'react-icons/fa';

const ReceiveBlood = () => {
  const [formData, setFormData] = useState({});
  const [bloodBankList, setBloodBankList] = useState([]);
  const [filteredBloodBanks, setFilteredBloodBanks] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');

  const api = useApiHelper();
  const router = useRouter();
  const gContext = useContext(GlobalContext);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const receiveBlood = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    
    api.createRecipient(formData)
      .then(res => {
        router.push('/recipient');
      })
      .catch(error => {
        setErrors(error?.response?.data || { general: 'An error occurred. Please try again.' });
        setSubmitting(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    api.getBloodBank()
      .then(res => {
        setBloodBankList(res.data);
        setFilteredBloodBanks(res.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching blood banks:', error);
        setErrors({ general: 'Failed to load blood banks. Please try again.' });
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = [...bloodBankList];
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(bank => 
        bank?.hospital_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by blood group
    if (selectedBloodGroup !== '') {
      filtered = filtered.filter(bank => 
        bank?.blood_group === selectedBloodGroup
      );
    }
    
    setFilteredBloodBanks(filtered);
  }, [searchTerm, selectedBloodGroup, bloodBankList]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBloodGroupFilter = (e) => {
    setSelectedBloodGroup(e.target.value);
  };

  // Get unique blood groups from blood bank list
  const uniqueBloodGroups = [...new Set(bloodBankList.map(bank => bank.blood_group))].filter(Boolean);

  return (
    <PageWrapper page="Receive Blood">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold"><FaTint className="me-2 text-danger" />Receive Blood</h4>
      </div>
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading blood banks...</p>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white py-3">
                <h5 className="card-title mb-0">
                  <FaTint className="me-2 text-danger" />
                  Blood Request Form
                </h5>
              </div>
              <div className="card-body p-4">
                {errors.general && (
                  <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                    <FaInfoCircle className="me-2" size={18} />
                    <div>{errors.general}</div>
                  </div>
                )}
                
                <form onSubmit={receiveBlood}>
                  <div className="row mb-4">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <label htmlFor="search" className="form-label">Search Blood Banks</label>
                      <div className="input-group">
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
                    <div className="col-md-6">
                      <label htmlFor="bloodGroupFilter" className="form-label">Filter by Blood Group</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaFilter /></span>
                        <select
                          id="bloodGroupFilter"
                          className="form-select"
                          value={selectedBloodGroup}
                          onChange={handleBloodGroupFilter}
                        >
                          <option value="">All Blood Groups</option>
                          {uniqueBloodGroups.map(group => (
                            <option key={group} value={group}>{group}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="bag_quantity" className="form-label">Bag Quantity</label>
                    <div className="input-group">
                      <span className="input-group-text"><FaBoxes /></span>
                      <input
                        type="number"
                        id="bag_quantity"
                        name="bag_quantity"
                        placeholder='Enter quantity needed'
                        className={`form-control ${errors.bag_quantity ? 'is-invalid' : ''}`}
                        onChange={handleChange}
                        min="1"
                        required
                      />
                    </div>
                    {errors.bag_quantity && (
                      <div className="invalid-feedback d-block">{errors.bag_quantity}</div>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="blood_bank" className="form-label">Select a Blood Bank</label>
                    <div className="input-group">
                      <span className="input-group-text"><FaHospital /></span>
                      <select
                        id="blood_bank"
                        name="blood_bank"
                        className={`form-select ${errors.blood_bank ? 'is-invalid' : ''}`}
                        onChange={handleChange}
                        required
                      >
                        <option value="">-- Select Blood Bank --</option>
                        {filteredBloodBanks.map(bank => (
                          <option key={bank.id} value={bank.id}>
                            {bank.hospital_name} - {bank.blood_group} ({bank.bag_quantity} units available)
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.blood_bank && (
                      <div className="invalid-feedback d-block">{errors.blood_bank}</div>
                    )}
                    {filteredBloodBanks.length === 0 && (
                      <div className="form-text text-danger mt-2">No blood banks match your criteria.</div>
                    )}
                  </div>
                  
                  <div className="d-grid gap-2">
                    <button
                      className='btn btn-primary btn-lg'
                      type="submit"
                      disabled={submitting || filteredBloodBanks.length === 0}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaTint className="me-2" /> Receive Blood
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default ReceiveBlood