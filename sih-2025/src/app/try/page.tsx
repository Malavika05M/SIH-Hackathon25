"use client";

import React, { useState } from "react";
import axios from "axios";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

type Skill = {
  name: string;
  score: number;
};

type Question = {
  type: string;
  question: string;
  options?: string[];
  answer_type: string;
};

type Round = {
  name: string;
  description: string;
  time_limit: string;
  questions: Question[];
};

export default function CandidateAssessment() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("document", file);

    try {
      setLoading(true);

      // Fetch skills
      const skillsRes = await axios.post("http://127.0.0.1:5000/skills", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSkills(skillsRes.data.skills);

      // Fetch assessment
      const assessmentRes = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setRounds(assessmentRes.data.assessment.rounds);
    } catch (err) {
      console.error("Error uploading file", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-center">Candidate Assessment</h1>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleUpload}
        className="block mx-auto mb-4"
      />

      {loading && <p className="text-center">Processing document...</p>}

      {/* Skills Chart */}
      {skills.length > 0 && (
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Skill Radar</h2>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={skills}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis domain={[0, 10]} />
              <Radar
                name="Skills"
                dataKey="score"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Assessment Rounds */}
      {rounds.length > 0 && (
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-semibold mb-4">Assessment Rounds</h2>
          {rounds.map((round, idx) => (
            <div key={idx} className="mb-6 border-b pb-4">
              <h3 className="text-lg font-bold">{round.name}</h3>
              <p className="text-gray-600">{round.description}</p>
              <p className="text-sm text-gray-500 mb-2">
                ⏱ {round.time_limit} minutes
              </p>

              <ul className="space-y-3">
                {round.questions.map((q, qIdx) => (
                  <li key={qIdx} className="p-3 bg-gray-50 rounded">
                    <p className="font-medium">
                      {qIdx + 1}. {q.question}
                    </p>
                    {q.options && (
                      <ul className="ml-6 list-disc">
                        {q.options.map((opt, oIdx) => (
                          <li key={oIdx}>{opt}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
