'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function Home() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isRegistered, setIsRegistered] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [registeredInternships, setRegisteredInternships] = useState<any[]>([]);
  const [selectedInternship, setSelectedInternship] = useState<any>(null);
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  useEffect(() => {
    const analyse = localStorage.getItem('analysis');
    if (analyse) {
      const parsed = JSON.parse(analyse);
      setAnalysis(parsed);
      setIsRegistered(true);

      const saved = sessionStorage.getItem('registeredInternships');
      if (saved) setRegisteredInternships(JSON.parse(saved));
    } else {
      setIsRegistered(false);
    }
  }, []);

  const handleApplyInternship = (internship: any) => {
    if (!registeredInternships.find(r => r.role === internship.role)) {
      const updated = [...registeredInternships, internship];
      setRegisteredInternships(updated);
      sessionStorage.setItem('registeredInternships', JSON.stringify(updated));
    }
    setSelectedInternship(null);
    setActiveSection('internships');
  };

  // Enhanced mock internships with detailed information
  const enhancedInternships = analysis?.internships?.map((internship: any, idx: number) => ({
    ...internship,
    id: idx,
    duration: ['3 months', '6 months', '4 months', '2 months'][idx % 4],
    stipend: ['₹15,000/month', '₹20,000/month', '₹12,000/month', '₹18,000/month'][idx % 4],
    location: ['Mumbai, Maharashtra', 'Bangalore, Karnataka', 'Delhi, NCR', 'Pune, Maharashtra'][idx % 4],
    deadline: ['15 Oct 2025', '20 Oct 2025', '25 Oct 2025', '30 Oct 2025'][idx % 4],
    requirements: [
      ['Bachelor\'s degree in Computer Science', 'Knowledge of React/JavaScript', 'Strong problem-solving skills'],
      ['Pursuing degree in Marketing/Business', 'Good communication skills', 'Social media knowledge'],
      ['Engineering background', 'Data analysis skills', 'Python/R programming'],
      ['Finance or Economics background', 'Excel proficiency', 'Analytical mindset']
    ][idx % 4],
    responsibilities: [
      ['Develop web applications using React', 'Collaborate with senior developers', 'Participate in code reviews', 'Learn modern development practices'],
      ['Create marketing campaigns', 'Analyze market trends', 'Assist in brand promotion', 'Support digital marketing initiatives'],
      ['Analyze large datasets', 'Create data visualizations', 'Support research projects', 'Present findings to stakeholders'],
      ['Financial modeling and analysis', 'Market research', 'Investment evaluation', 'Risk assessment support']
    ][idx % 4],
    benefits: ['Mentorship program', 'Certificate of completion', 'Networking opportunities', 'Potential full-time offer'],
    applicationProcess: [
      'Online application submission',
      'Resume screening',
      'Technical/HR interview',
      'Final selection'
    ]
  })) || [];

const scoreData = analysis?.scores
  ? Object.entries(analysis.scores).map(([k, v]) => ({ 
      name: k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), 
      value: v as number   // keep raw value (out of 10)
    }))
  : [];


  // Mock data for enhanced profile charts
  const skillTrendData = [
    { month: 'Jan', technical: 65, communication: 70, leadership: 55 },
    { month: 'Feb', technical: 68, communication: 72, leadership: 58 },
    { month: 'Mar', technical: 72, communication: 75, leadership: 62 },
    { month: 'Apr', technical: 75, communication: 78, leadership: 65 },
    { month: 'May', technical: 78, communication: 80, leadership: 68 },
  ];

  const applicationStats = [
    { name: 'Applied', value: registeredInternships.length, color: '#f97316' },
    { name: 'In Progress', value: Math.floor(registeredInternships.length * 0.7), color: '#3b82f6' },
    { name: 'Completed', value: Math.floor(registeredInternships.length * 0.3), color: '#10b981' },
  ];

  return (
    <div className="min-h-screen text-black bg-gray-50">
      <div className="bg-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-5 mr-3 bg-gradient-to-b from-orange-500 via-white to-green-600 border border-gray-300"></div>
            <h1 className="text-white text-lg font-medium">Government Portal Dashboard</h1>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-gray-300">Welcome, Priya Sharma</span>
            <button 
              onClick={handleLogout}
              className="bg-orange-600 text-white px-4 py-2 rounded text-sm hover:bg-orange-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <div className="space-y-2">
              <button
                onClick={() => setActiveSection('overview')}
                className={`w-full text-left px-3 py-2 rounded ${
                  activeSection === 'overview' ? 'bg-orange-100 text-orange-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Internship Recommendations
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
                onClick={() => setActiveSection('profile')}
                className={`w-full text-left px-3 py-2 rounded ${
                  activeSection === 'profile' ? 'bg-orange-100 text-orange-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Profile & Analytics
              </button>
              <button
                onClick={() => setActiveSection('account')}
                className={`w-full text-left px-3 py-2 rounded ${
                  activeSection === 'account' ? 'bg-orange-100 text-orange-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Account Settings
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6">
          
          {activeSection === 'overview' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recommended Internships for You</h2>

              {!isRegistered ? (
                <div className="bg-white p-8 rounded-lg border text-center">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Complete Your Registration
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Please upload your resume and answer a few questions to get personalized internship recommendations.
                  </p>
                  <button
                    onClick={() => router.push('/forms')}
                    className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
                  >
                    Complete Registration
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enhancedInternships.map((internship: any, idx: number) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedInternship(internship)}
                      className="bg-white p-6 rounded-lg border hover:shadow-lg cursor-pointer transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-lg font-semibold text-gray-800">{internship.role}</h4>
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                          {internship.match_score}/5 Match
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <p className="font-medium text-gray-700">{internship.organization}</p>
                        <p>📍 {internship.location}</p>
                        <p>💰 {internship.stipend}</p>
                        <p>⏱️ {internship.duration}</p>
                        <p>📅 Apply by: {internship.deadline}</p>
                      </div>
                      
                      <p className="text-sm text-gray-500 mt-3 line-clamp-2">{internship.description}</p>
                      
                      <div className="mt-4">
                        <button className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition-colors text-sm">
                          View Details & Apply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'internships' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Internships</h2>
              {registeredInternships.length > 0 ? (
                <div className="space-y-4">
                  {registeredInternships.map((internship: any, idx: number) => (
                    <div key={idx} className="bg-white p-6 rounded-lg border">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{internship.role}</h3>
                          <p className="text-sm text-gray-600">{internship.organization}</p>
                        </div>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                          Applied
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-3">{internship.description}</p>
                      
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Location:</span>
                          <p className="text-gray-600">{internship.location || 'Remote'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Duration:</span>
                          <p className="text-gray-600">{internship.duration || '3 months'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Match Score:</span>
                          <p className="text-gray-600 font-semibold">{internship.match_score}/5</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg border text-center">
                  <p className="text-gray-500 mb-4">No internships registered yet.</p>
                  <button
                    onClick={() => setActiveSection('overview')}
                    className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                  >
                    Browse Internships
                  </button>
                </div>
              )}
            </div>
          )}

          {activeSection === 'profile' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile & Analytics</h2>
              
              {/* Personal Info Card */}
              <div className="bg-white p-6 rounded-lg border mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Name:</span>
                        <p className="text-gray-900">Priya Sharma</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Email:</span>
                        <p className="text-gray-900">priya.sharma@email.com</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Phone:</span>
                        <p className="text-gray-900">+91 98765 43210</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Education:</span>
                        <p className="text-gray-900">B.Tech Computer Science</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Year:</span>
                        <p className="text-gray-900">3rd Year</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Location:</span>
                        <p className="text-gray-900">Mumbai, Maharashtra</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Statistics */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Application Statistics</h3>
                  {applicationStats.some(stat => stat.value > 0) ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={applicationStats}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {applicationStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-8">No applications yet</p>
                  )}
                  <div className="flex justify-center space-x-4 mt-4">
                    {applicationStats.map((stat, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <div className={`w-3 h-3 rounded-full mr-2`} style={{backgroundColor: stat.color}}></div>
                        <span>{stat.name}: {stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Current Skill Scores</h3>
                  {scoreData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart 
                          data={scoreData} 
                          layout="vertical" 
                          margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" domain={[0, 10]} />
                          <YAxis type="category" dataKey="name" />
                          <Tooltip />
                          <Bar dataKey="value" fill="#f97316" barSize={30} />
                        </BarChart>
                      </ResponsiveContainer>


                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-8">Complete registration to see scores</p>
                  )}
                </div>
              </div>

             

              {/* Feedback Section */}
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">AI Feedback & Recommendations</h3>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {analysis?.feedback || "Complete your registration to receive personalized feedback and recommendations for improving your skills and finding the best internship matches."}
                  </p>
                </div>
                
                {analysis?.feedback && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Recommended Actions:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        Focus on improving communication skills through online courses
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        Build portfolio projects to showcase technical abilities
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        Apply to 2-3 internships that match your current skill level
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'account' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Account Settings</h2>
              <div className="bg-white p-6 rounded-lg border">
                <p className="text-gray-600 text-sm">Manage your account information here.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Internship Detail Modal */}
      {selectedInternship && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedInternship.role}</h3>
                  <p className="text-lg text-gray-600">{selectedInternship.organization}</p>
                </div>
                <button
                  onClick={() => setSelectedInternship(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Location:</span>
                        <p className="text-gray-900">{selectedInternship.location}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Duration:</span>
                        <p className="text-gray-900">{selectedInternship.duration}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Stipend:</span>
                        <p className="text-gray-900">{selectedInternship.stipend}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Deadline:</span>
                        <p className="text-gray-900">{selectedInternship.deadline}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center">
                      <span className="font-medium text-gray-700 mr-2">Match Score:</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-lg ${i < selectedInternship.match_score ? 'text-orange-400' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">({selectedInternship.match_score}/5)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Job Description</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{selectedInternship.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
                    <ul className="space-y-2">
                      {selectedInternship.requirements?.map((req: string, idx: number) => (
                        <li key={idx} className="flex items-start text-sm text-gray-700">
                          <span className="text-orange-500 mr-2 mt-1">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Key Responsibilities</h4>
                    <ul className="space-y-2">
                      {selectedInternship.responsibilities?.map((resp: string, idx: number) => (
                        <li key={idx} className="flex items-start text-sm text-gray-700">
                          <span className="text-orange-500 mr-2 mt-1">•</span>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Benefits</h4>
                    <ul className="space-y-2">
                      {selectedInternship.benefits?.map((benefit: string, idx: number) => (
                        <li key={idx} className="flex items-start text-sm text-gray-700">
                          <span className="text-green-500 mr-2 mt-1">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Application Process</h4>
                    <div className="space-y-3">
                      {selectedInternship.applicationProcess?.map((step: string, idx: number) => (
                        <div key={idx} className="flex items-start text-sm text-gray-700">
                          <div className="w-6 h-6 bg-orange-100 text-orange-800 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                            {idx + 1}
                          </div>
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
                <button
                  onClick={() => setSelectedInternship(null)}
                  className="px-6 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  Close
                </button>
                <button
                  onClick={() => handleApplyInternship(selectedInternship)}
                  disabled={registeredInternships.find(r => r.role === selectedInternship.role)}
                  className={`px-6 py-2 rounded text-white ${
                    registeredInternships.find(r => r.role === selectedInternship.role)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-orange-600 hover:bg-orange-700'
                  }`}
                >
                  {registeredInternships.find(r => r.role === selectedInternship.role) ? 'Already Applied' : 'Apply Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}