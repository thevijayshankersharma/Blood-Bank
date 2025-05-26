import React, { useContext, useState } from 'react';

import { PageWrapper } from '@/components/Wrapper';
import useApiHelper from '@/api';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import GlobalContext from '@/context/GlobalContext';
import Link from 'next/link';
import { FaEnvelope, FaLock, FaUserPlus, FaExclamationTriangle, FaSignInAlt, FaLockOpen } from 'react-icons/fa';

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const api = useApiHelper();
  const router = useRouter();
  const gContext = useContext(GlobalContext);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const signUp = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Map form fields to backend expected fields (password1 and password2)
    const payload = {
      email: formData.email,
      password1: formData.password,
      password2: formData.confirm_password
    };
    
    api.signUp(payload).then(res => {
      setErrors({});
      console.log('Registration successful. Response:', res.data);
      
      // Django REST Auth typically returns { key: 'token_value' }
      if (res.data.key) {
        Cookies.set('accessToken', res.data.key);
      } 
      // JWT might return { access: 'token_value', refresh: 'token_value' }
      else if (res.data.access) {
        Cookies.set('accessToken', res.data.access);
      }
      // Fallback to token if that's what your backend returns
      else if (res.data.token) {
        Cookies.set('accessToken', res.data.token);
      }
      
      gContext.setIsLoggedIn(true);
      router.push('/update-profile');
    }).catch(error => {
      // Handle and map the backend error responses to the form fields
      const errorData = error?.response?.data || { non_field_errors: ['An error occurred. Please try again.'] };
      
      // Create a new errors object mapping backend field names to frontend field names
      const mappedErrors = {};
      
      // Map password1 errors to password field
      if (errorData.password1) {
        mappedErrors.password = Array.isArray(errorData.password1) 
          ? errorData.password1.join(' ') 
          : errorData.password1;
      }
      
      // Map password2 errors to confirm_password field
      if (errorData.password2) {
        mappedErrors.confirm_password = Array.isArray(errorData.password2) 
          ? errorData.password2.join(' ') 
          : errorData.password2;
      }
      
      // Map other errors
      if (errorData.email) {
        mappedErrors.email = Array.isArray(errorData.email) 
          ? errorData.email.join(' ') 
          : errorData.email;
      }
      
      // Include any non-field errors
      if (errorData.non_field_errors) {
        mappedErrors.non_field_errors = Array.isArray(errorData.non_field_errors) 
          ? errorData.non_field_errors.join(' ') 
          : errorData.non_field_errors;
      }
      
      setErrors(mappedErrors);
      setLoading(false);
    });
  };

  return (
    <PageWrapper page="Sign Up">
      <div className="row justify-content-center my-5">
        <div className="col-lg-5 col-md-8 col-sm-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <h3 className="fw-bold">Create Account</h3>
                <p className="text-muted">Join the Blood Bank Management System</p>
              </div>
              
              {errors.non_field_errors && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <FaExclamationTriangle className="me-2" />
                  <div>{errors.non_field_errors}</div>
                </div>
              )}
              
              <form onSubmit={signUp}>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text"><FaEnvelope /></span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder='Enter your email'
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      onChange={handleChange}
                      required
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text"><FaLock /></span>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder='Create a password'
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      onChange={handleChange}
                      required
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>
                  <div className="form-text">Password must be at least 8 characters long, not too common, and not similar to your personal information</div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="confirm_password" className="form-label">Confirm Password</label>
                  <div className="input-group">
                    <span className="input-group-text"><FaLockOpen /></span>
                    <input
                      type="password"
                      id="confirm_password"
                      name="confirm_password"
                      placeholder='Confirm your password'
                      className={`form-control ${errors.confirm_password ? 'is-invalid' : ''}`}
                      onChange={handleChange}
                      required
                    />
                    {errors.confirm_password && <div className="invalid-feedback">{errors.confirm_password}</div>}
                  </div>
                </div>
                
                <div className="d-grid gap-2 mb-4">
                  <button
                    className='btn btn-primary btn-lg'
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <FaUserPlus className="me-2" /> Sign Up
                      </>
                    )}
                  </button>
                </div>
                
                <div className="text-center">
                  <p className="mb-0">Already have an account? <Link href="/sign-in" className="text-decoration-none"><FaSignInAlt className="me-1" />Sign In</Link></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SignUp