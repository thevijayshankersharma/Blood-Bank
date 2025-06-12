import React from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaTint, FaHospital, FaChartLine } from 'react-icons/fa';
import Link from 'next/link';

const Dashboard = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const stats = [
    { icon: <FaUserPlus />, title: 'Total Donors', value: '1,234', trend: '+12%' },
    { icon: <FaTint />, title: 'Blood Units', value: '567', trend: '+8%' },
    { icon: <FaHospital />, title: 'Hospitals', value: '89', trend: '+5%' },
    { icon: <FaChartLine />, title: 'Success Rate', value: '98%', trend: '+2%' }
  ];

  const recentDonations = [
    { id: 1, donor: 'John Doe', bloodType: 'A+', date: '2023-06-15', status: 'completed' },
    { id: 2, donor: 'Jane Smith', bloodType: 'O-', date: '2023-06-14', status: 'processing' },
    { id: 3, donor: 'Mike Johnson', bloodType: 'B+', date: '2023-06-13', status: 'completed' }
  ];

  const bloodInventory = [
    { type: 'A+', units: 45, status: 'available' },
    { type: 'B+', units: 12, status: 'low' },
    { type: 'O-', units: 5, status: 'critical' },
    { type: 'AB+', units: 28, status: 'available' }
  ];

  return (
    <div className="dashboard-layout fade-in">
      {/* Stats Section */}
      <section className="mb-5">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card"
              {...fadeInUp}
              transition={{ delay: index * 0.1 }}
            >
              <div className="d-flex align-items-center mb-3">
                <div className="icon text-primary me-3">{stat.icon}</div>
                <h3 className="h5 mb-0">{stat.title}</h3>
              </div>
              <div className="d-flex align-items-baseline">
                <h2 className="mb-0 me-2">{stat.value}</h2>
                <span className="text-success small">{stat.trend}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="row g-4">
        {/* Blood Inventory */}
        <div className="col-lg-6">
          <motion.div 
            className="dashboard-card"
            {...fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <div className="dashboard-card-header">
              <h3>Blood Inventory</h3>
              <Link href="/inventory" className="btn btn-outline-primary btn-sm">
                View All
              </Link>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Blood Type</th>
                    <th>Units</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bloodInventory.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="blood-type-badge">{item.type}</div>
                      </td>
                      <td>{item.units} units</td>
                      <td>
                        <span className={`donation-status ${item.status}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Recent Donations */}
        <div className="col-lg-6">
          <motion.div 
            className="dashboard-card"
            {...fadeInUp}
            transition={{ delay: 0.3 }}
          >
            <div className="dashboard-card-header">
              <h3>Recent Donations</h3>
              <Link href="/donations" className="btn btn-outline-primary btn-sm">
                View All
              </Link>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Donor</th>
                    <th>Blood Type</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDonations.map((donation) => (
                    <tr key={donation.id}>
                      <td>{donation.donor}</td>
                      <td>
                        <div className="blood-type-badge">{donation.bloodType}</div>
                      </td>
                      <td>{donation.date}</td>
                      <td>
                        <span className={`donation-status ${donation.status}`}>
                          {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="col-12">
          <motion.div 
            className="dashboard-card"
            {...fadeInUp}
            transition={{ delay: 0.4 }}
          >
            <div className="dashboard-card-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="d-flex gap-3 flex-wrap">
              <Link href="/donate" className="btn btn-primary">
                <FaTint className="me-2" /> Donate Blood
              </Link>
              <Link href="/request" className="btn btn-outline-primary">
                <FaHospital className="me-2" /> Request Blood
              </Link>
              <Link href="/appointments" className="btn btn-outline-primary">
                <FaUserPlus className="me-2" /> Schedule Appointment
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;