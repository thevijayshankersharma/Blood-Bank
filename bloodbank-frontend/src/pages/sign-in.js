import React, { useContext, useState } from 'react';
import { PageWrapper } from '@/components/Wrapper';
import useApiHelper from '@/api';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import GlobalContext from '@/context/GlobalContext';
import Link from 'next/link';
import { FaEnvelope, FaLock, FaSignInAlt, FaExclamationTriangle, FaUserPlus } from 'react-icons/fa';

const SignIn = () => {
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

  const signIn = (e) => {
    e.preventDefault();
    setLoading(true);
    
    api.signIn(formData).then(res => {
      setErrors({});
      Cookies.set('accessToken', res.data.access);
      gContext.setIsLoggedIn(true);
      
      // Redirect to the 'next' URL if it exists, otherwise to home
      const nextUrl = router.query.next || '/';
      router.push(nextUrl);
    }).catch(error => {
      setErrors(error?.response?.data || { non_field_errors: 'An error occurred. Please try again.' });
      setLoading(false);
    });
  };

  return (
    <PageWrapper page="Sign In">
      <div className="row justify-content-center my-5">
        <div className="col-lg-5 col-md-8 col-sm-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <h3 className="fw-bold">Welcome Back</h3>
                <p className="text-muted">Sign in to continue to Blood Bank Management</p>
              </div>
              
              {errors.non_field_errors && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <FaExclamationTriangle className="me-2" />
                  <div>{errors.non_field_errors}</div>
                </div>
              )}
              
              <form onSubmit={signIn}>
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
                  <div className="d-flex justify-content-between align-items-center">
                    <label htmlFor="password" className="form-label">Password</label>
                    <Link href="#" className="small text-decoration-none">Forgot Password?</Link>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text"><FaLock /></span>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder='Enter your password'
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      onChange={handleChange}
                      required
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
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
                        Signing in...
                      </>
                    ) : (
                      <>
                        <FaSignInAlt className="me-2" /> Sign In
                      </>
                    )}
                  </button>
                  <button
                    className='btn btn-outline-secondary btn-lg'
                    type="button"
                    onClick={() => {
                        setFormData({email: 'guest@example.com', password: 'guestpassword'});
                        // Optionally trigger sign in directly or just fill
                        const form = { email: 'guest@example.com', password: 'guestpassword'};
                        setLoading(true);
                        api.signIn(form).then(res => {
                            setErrors({});
                            Cookies.set('accessToken', res.data.access);
                            gContext.setIsLoggedIn(true);
                            const nextUrl = router.query.next || '/';
                            router.push(nextUrl);
                        }).catch(error => {
                            setErrors(error?.response?.data || { non_field_errors: 'Login failed (Demo credentials might be invalid or backend not running)' });
                            setLoading(false);
                            // Set form data so user can see it failed
                            setFormData(form);
                        });
                    }}
                    disabled={loading}
                  >
                     Login as Guest (Recruiter Demo)
                  </button>
                </div>
                
                <div className="text-center">
                  <p className="mb-0">Don't have an account? <Link href="/sign-up" className="text-decoration-none"><FaUserPlus className="me-1" />Sign Up</Link></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SignIn