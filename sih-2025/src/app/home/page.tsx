'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [activeSection, setActiveSection] = useState('overview');
  const router = useRouter();

  const handleLogout = () => {
    // Implement logout logic
    router.push('/login');
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-5 mr-3 bg-gradient-to-b from-orange-500 via-white to-green-600 border border-gray-300"></div>
            <h1 className="text-white text-lg font-medium">Government Portal Dashboard</h1>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-gray-300">Welcome, Priya Sharma</span>
            <button className="bg-orange-600 text-white px-4 py-2 rounded text-sm hover:bg-orange-700">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <div className="space-y-2">
              <button
                onClick={() => setActiveSection('overview')}
                className={`w-full text-left px-3 py-2 rounded ${
                  activeSection === 'overview' ? 'bg-orange-100 text-orange-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Dashboard Overview
              </button>
              <button
                onClick={() => setActiveSection('internships')}
                className={`w-full text-left px-3 py-2 rounded ${
                  activeSection === 'internships' ? 'bg-orange-100 text-orange-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                My Internships
              </button>
              <button
                onClick={() => setActiveSection('documents')}
                className={`w-full text-left px-3 py-2 rounded ${
                  activeSection === 'documents' ? 'bg-orange-100 text-orange-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveSection('profile')}
                className={`w-full text-left px-3 py-2 rounded ${
                  activeSection === 'profile' ? 'bg-orange-100 text-orange-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Profile Settings
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          
          {activeSection === 'overview' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Active Applications</h3>
                  <p className="text-3xl font-bold text-gray-900">3</p>
                  <p className="text-sm text-green-600 mt-1">2 pending review</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Account Status</h3>
                  <p className="text-3xl font-bold text-green-600">Verified</p>
                  <p className="text-sm text-gray-500 mt-1">Aadhaar linked</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Documents</h3>
                  <p className="text-3xl font-bold text-gray-900">5</p>
                  <p className="text-sm text-blue-600 mt-1">All verified</p>
                </div>
              </div>

              <div className="bg-white rounded-lg border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Internship application submitted - 1 day ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Document verification pending - 2 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeSection === 'internships' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Internships</h2>
              
              <div className="bg-white rounded-lg border">
                <div className="p-6">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 text-sm font-medium text-gray-500">Program</th>
                        <th className="text-left py-3 text-sm font-medium text-gray-500">Department</th>
                        <th className="text-left py-3 text-sm font-medium text-gray-500">Status</th>
                        <th className="text-left py-3 text-sm font-medium text-gray-500">Applied</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-4 text-sm text-gray-900">Digital India Initiative</td>
                        <td className="py-4 text-sm text-gray-600">Ministry of IT</td>
                        <td className="py-4">
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">Under Review</span>
                        </td>
                        <td className="py-4 text-sm text-gray-600">15 Sep 2025</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-4 text-sm text-gray-900">Rural Development Program</td>
                        <td className="py-4 text-sm text-gray-600">Ministry of Rural Development</td>
                        <td className="py-4">
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">Accepted</span>
                        </td>
                        <td className="py-4 text-sm text-gray-600">10 Sep 2025</td>
                      </tr>
                      <tr>
                        <td className="py-4 text-sm text-gray-900">Healthcare Analytics</td>
                        <td className="py-4 text-sm text-gray-600">Ministry of Health</td>
                        <td className="py-4">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">Interview Scheduled</span>
                        </td>
                        <td className="py-4 text-sm text-gray-600">12 Sep 2025</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeSection === 'documents' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Documents</h2>
              
              <div className="bg-white rounded-lg border">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900">Aadhaar Card</h4>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">Verified</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">Uploaded: 5 Sep 2025</p>
                      <button className="text-xs text-blue-600 hover:text-blue-800">View Document</button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900">PAN Card</h4>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">Verified</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">Uploaded: 5 Sep 2025</p>
                      <button className="text-xs text-blue-600 hover:text-blue-800">View Document</button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900">Educational Certificate</h4>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">Verified</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">Uploaded: 6 Sep 2025</p>
                      <button className="text-xs text-blue-600 hover:text-blue-800">View Document</button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900">Bank Passbook</h4>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">Verified</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">Uploaded: 8 Sep 2025</p>
                      <button className="text-xs text-blue-600 hover:text-blue-800">View Document</button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900">Address Proof</h4>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">Verified</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">Uploaded: 8 Sep 2025</p>
                      <button className="text-xs text-blue-600 hover:text-blue-800">View Document</button>
                    </div>
                    
                    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                          <span className="text-gray-400 text-lg">+</span>
                        </div>
                        <p className="text-xs text-gray-500">Upload New Document</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'profile' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile Settings</h2>
              
              <div className="bg-white rounded-lg border">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        defaultValue="Priya Sharma" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        defaultValue="priya.sharma@email.com" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        defaultValue="+91 98765 43210" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Number</label>
                      <input 
                        type="text" 
                        defaultValue="****-****-5678" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50" 
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <input 
                        type="date" 
                        defaultValue="1995-03-15" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                        <option>Kerala</option>
                        <option>Tamil Nadu</option>
                        <option>Karnataka</option>
                        <option>Maharashtra</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <button className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}