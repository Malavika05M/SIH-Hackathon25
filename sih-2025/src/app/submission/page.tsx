'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ScoreResult {
  scores: {
    communication: number;
    technical_ability: number;
    reasoning: number;
    creativity: number;
    decision_making: number;
  };
  feedback: string;
  internships: {
    role: string;
    organization: string;
    description: string;
    match_score: number;
  }[];
}

export default function SubmissionPage() {
  const [results, setResults] = useState<ScoreResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Retrieve assessment data and answers from localStorage
    const assessmentData = localStorage.getItem('assessmentData');
    const answersData = localStorage.getItem('assessmentAnswers');

    if (!assessmentData || !answersData) {
      setError('No assessment data found. Please complete an assessment first.');
      setIsLoading(false);
      return;
    }

    const assessment = JSON.parse(assessmentData);
    const answers = JSON.parse(answersData);

    // Send data to backend for analysis
    analyzeResults(assessment, answers);
  }, []);

  const analyzeResults = async (assessment: any, answers: any) => {
    try {
      const response = await fetch('http://localhost:5000/analyse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assessment, answers }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze results');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to analyze assessment results. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const takeNewAssessment = () => {
    localStorage.removeItem('assessmentData');
    localStorage.removeItem('assessmentAnswers');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-red-500 rounded"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/forms')}
            className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700"
          >
            Return to Assessment
          </button>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-5 bg-gradient-to-b from-orange-500 via-white to-green-600 border border-gray-300"></div>
            <span className="text-lg font-semibold">Assessment Results</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-green-500 rounded"></div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Complete!</h1>
            <p className="text-gray-600">Your results have been analyzed and evaluated</p>
          </div>

          {/* Skills Radar Chart */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills Assessment</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <RadarChart scores={results.scores} />
                </div>
                <div className="space-y-4">
                  {Object.entries(results.scores).map(([skill, score]) => (
                    <div key={skill} className="flex items-center">
                      <span className="w-32 text-sm font-medium text-gray-700 capitalize">
                        {skill.replace('_', ' ')}
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-orange-500 h-2.5 rounded-full"
                          style={{ width: `${score * 10}%` }}
                        ></div>
                      </div>
                      <span className="w-8 text-sm font-medium text-gray-900 ml-2">
                        {score}/10
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Feedback</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-800">{results.feedback}</p>
            </div>
          </div>

          {/* Recommended Internships */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Internships</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.internships.map((internship, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{internship.role}</h3>
                      <p className="text-sm text-gray-600">{internship.organization}</p>
                    </div>
                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                      {internship.match_score}% Match
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-4">{internship.description}</p>
                  <button className="w-full bg-slate-800 text-white py-2 rounded-lg text-sm hover:bg-slate-700">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8 pt-6 border-t">
            <button
              onClick={takeNewAssessment}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Take Another Assessment
            </button>
            <button
              onClick={() => console.log('Save results')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Radar Chart Component
const RadarChart = ({ scores }: { scores: ScoreResult['scores'] }) => {
  const skills = Object.keys(scores);
  const values = Object.values(scores);
  const maxValue = 10;
  
  // Calculate points for radar chart
  const calculatePoint = (index: number, value: number, totalPoints: number) => {
    const angle = (Math.PI * 2 * index) / totalPoints;
    const radius = (value / maxValue) * 40;
    const x = 50 + radius * Math.sin(angle);
    const y = 50 - radius * Math.cos(angle);
    return { x, y };
  };

  const points = skills.map((_, i) => calculatePoint(i, values[i], skills.length));
  const pathData = points.map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x},${point.y}`).join(' ') + ' Z';

  return (
    <div className="relative">
      <svg viewBox="0 0 100 100" className="w-full h-64">
        {/* Grid circles */}
        <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="#e5e7eb" />
        <circle cx="50" cy="50" r="20" fill="none" stroke="#e5e7eb" />
        <circle cx="50" cy="50" r="10" fill="none" stroke="#e5e7eb" />
        
        {/* Skill axes */}
        {skills.map((skill, i) => {
          const point = calculatePoint(i, maxValue, skills.length);
          return (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={point.x}
              y2={point.y}
              stroke="#e5e7eb"
            />
          );
        })}
        
        {/* Data polygon */}
        <path
          d={pathData}
          fill="rgba(249, 115, 22, 0.2)"
          stroke="rgb(249, 115, 22)"
          strokeWidth="1.5"
        />
        
        {/* Data points and labels */}
        {points.map((point, i) => (
          <g key={i}>
            <circle cx={point.x} cy={point.y} r="2" fill="rgb(249, 115, 22)" />
            <text
              x={point.x + (point.x - 50) / 10}
              y={point.y + (point.y - 50) / 10}
              textAnchor="middle"
              fontSize="3"
              fill="#374151"
            >
              {skills[i].replace('_', ' ')}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};