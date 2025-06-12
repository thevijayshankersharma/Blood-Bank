import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaHandHoldingHeart, FaUserFriends, FaHospital } from 'react-icons/fa';
import Link from 'next/link';

const Landing = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const features = [
    {
      icon: <FaHeart />,
      title: 'Save Lives',
      description: 'Your blood donation can save up to three lives. Be a hero today.'
    },
    {
      icon: <FaHandHoldingHeart />,
      title: 'Easy Process',
      description: 'Simple and streamlined donation process. Register and start helping others.'
    },
    {
      icon: <FaUserFriends />,
      title: 'Community',
      description: 'Join a community of donors making a difference every day.'
    },
    {
      icon: <FaHospital />,
      title: 'Hospital Network',
      description: 'Connected with major hospitals to ensure your donation reaches those in need.'
    }
  ];

  return (
    <div className="landing-layout">
      {/* Hero Section */}
      <section className="hero-section">
        <motion.div 
          className="container"
          initial="initial"
          animate="animate"
        >
          <motion.h1 {...fadeInUp}>
            Save Lives Through <span className="text-primary">Blood Donation</span>
          </motion.h1>
          <motion.p 
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="lead mb-4"
          >
            Join our mission to help those in need. Your donation can make a difference.
          </motion.p>
          <motion.div 
            className="d-flex gap-3 justify-content-center"
            {...fadeInUp}
            transition={{ delay: 0.4 }}
          >
            <Link href="/sign-up" className="btn btn-primary btn-lg">
              Register as Donor
            </Link>
            <Link href="/sign-in" className="btn btn-outline btn-lg">
              Sign In
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.h2 
            className="text-center mb-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Why Choose Our Platform?
          </motion.h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="icon mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="h4 mb-3">{feature.title}</h3>
                <p className="text-muted">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-5">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4">Ready to Make a Difference?</h2>
            <p className="lead mb-4">
              Join thousands of donors who are already saving lives through our platform.
            </p>
            <Link href="/sign-up" className="btn btn-lg btn-outline">
              Start Donating Today
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <h4>Blood Bank</h4>
              <p className="text-muted">
                Connecting donors with those in need, making blood donation accessible and efficient.
              </p>
            </div>
            <div>
              <h4>Quick Links</h4>
              <ul>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4>Contact Us</h4>
              <ul>
                <li>Email: support@bloodbank.com</li>
                <li>Phone: (123) 456-7890</li>
                <li>Address: 123 Medical Center Dr</li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-5 pt-4 border-top border-gray">
            <p className="text-muted">&copy; {new Date().getFullYear()} Blood Bank. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;