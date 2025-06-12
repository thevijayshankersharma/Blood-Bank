import React from 'react';
import Link from 'next/link';
import { FaHospital, FaTint, FaUserPlus, FaUserCheck, FaArrowRight, FaHeartbeat, FaHandHoldingHeart, FaChartLine } from 'react-icons/fa';
import Head from 'next/head';

const Landing = () => {
  return (
    <>
      <Head>
        <title>Blood Bank Management System - Save Lives</title>
        <meta name="description" content="A modern blood bank management system to connect donors with recipients and save lives." />
      </Head>

      <div className="landing-page">
        {/* Hero Section */}
        <header className="hero-section">
          <div className="container">
            <nav className="landing-nav">
              <div className="logo">
                <FaTint className="logo-icon" />
                <span>BloodBank</span>
              </div>
              <div className="nav-links">
                <Link href="/" className="nav-link">Home</Link>
                <Link href="/blood-bank" className="nav-link">Blood Bank</Link>
                <Link href="/donor" className="nav-link">Donate</Link>
                <Link href="/recipient" className="nav-link">Request</Link>
                <Link href="/sign-in" className="nav-link nav-btn">Sign In</Link>
              </div>
            </nav>

            <div className="hero-content">
              <div className="hero-text">
                <h1>Donate Blood, Save Lives</h1>
                <p>Join our mission to ensure blood availability for those in need. Your donation can save up to three lives.</p>
                <div className="hero-buttons">
                  <Link href="/donor" className="btn btn-primary btn-lg">
                    Donate Now <FaArrowRight className="ms-2" />
                  </Link>
                  <Link href="/sign-up" className="btn btn-outline-light btn-lg ms-3">
                    Register
                  </Link>
                </div>
              </div>
              <div className="hero-image">
                <img src="/blood-donation.svg" alt="Blood Donation Illustration" />
              </div>
            </div>
          </div>
        </header>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <div className="section-header">
              <h2>Our Services</h2>
              <p>Comprehensive blood management solutions</p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <FaTint />
                </div>
                <h3>Blood Donation</h3>
                <p>Donate blood and help save lives. Our streamlined process makes donation quick and easy.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <FaHospital />
                </div>
                <h3>Hospital Network</h3>
                <p>Connected with multiple hospitals to ensure blood reaches where it's needed most.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <FaUserCheck />
                </div>
                <h3>Blood Requests</h3>
                <p>Request blood for patients in need with our efficient request management system.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <FaChartLine />
                </div>
                <h3>Inventory Management</h3>
                <p>Real-time tracking of blood inventory across all connected hospitals.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>1,000+</h3>
                <p>Blood Donations</p>
              </div>
              <div className="stat-card">
                <h3>500+</h3>
                <p>Lives Saved</p>
              </div>
              <div className="stat-card">
                <h3>50+</h3>
                <p>Partner Hospitals</p>
              </div>
              <div className="stat-card">
                <h3>24/7</h3>
                <p>Emergency Support</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Make a Difference?</h2>
              <p>Your blood donation can be the gift of life for someone in need.</p>
              <div className="cta-buttons">
                <Link href="/donor" className="btn btn-primary btn-lg">
                  Donate Blood
                </Link>
                <Link href="/sign-up" className="btn btn-outline-light btn-lg ms-3">
                  Join as Volunteer
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-logo">
                <FaTint className="logo-icon" />
                <span>BloodBank</span>
              </div>
              <p>© {new Date().getFullYear()} Blood Bank Management System. All rights reserved.</p>
              <div className="footer-links">
                <Link href="/" className="footer-link">Home</Link>
                <Link href="/blood-bank" className="footer-link">Blood Bank</Link>
                <Link href="/donor" className="footer-link">Donate</Link>
                <Link href="/sign-in" className="footer-link">Sign In</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Landing;