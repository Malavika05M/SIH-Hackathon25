"use client";

import React, { useEffect, useState } from "react";

interface AnalysisResult {
  scores?: Record<string, number>;
  skillGraph?: string[];
  internships?: string[];
  companies?: string[];
}

export default function SubmissionPage() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        // 1. Try reading directly from localStorage
        const stored = localStorage.getItem("analysis");
        if (stored) {
          const parsed = JSON.parse(stored);

          // Map keys from localStorage to your component's expected keys
          const mappedResult: AnalysisResult = {
            scores: parsed.attributes,
            skillGraph: parsed.skill_graph
              ? Object.entries(parsed.skill_graph).map(([k, v]) => `${k}: ${v}`)
              : [],
            internships: parsed.internship_suggestions || [],
            companies: parsed.company_suggestions || [],
          };

          setResult(mappedResult);
          setLoading(false);
          return;
        }

        // 2. Fallback: re-fetch from backend if nothing stored
        const assessment = localStorage.getItem("assessment");
        const answers = localStorage.getItem("assessmentAnswers");

        if (!assessment || !answers) {
          throw new Error("Missing assessment data.");
        }

        const response = await fetch("http://127.0.0.1:5000/analyse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assessment: JSON.parse(assessment),
            answers: JSON.parse(answers),
          }),
        });

        if (!response.ok) throw new Error("Failed to analyze results");

        const data = await response.json();
        setResult(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Analyzing your results...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-semibold">
        Error: {error}
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        No results available
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-xl mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Assessment Results</h2>

      {/* Scores Section */}
      {result.scores && Object.keys(result.scores).length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Scores</h3>
          <ul className="list-disc pl-6">
            {Object.entries(result.scores).map(([skill, score]) => (
              <li key={skill}>
                <span className="font-medium">{skill}:</span> {score}/100
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Skill Graph */}
      {result.skillGraph && result.skillGraph.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Skill Graph</h3>
          <ul className="list-disc pl-6">
            {result.skillGraph.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Internship Recommendations */}
      {result.internships && result.internships.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Recommended Internships</h3>
          <ul className="list-disc pl-6">
            {result.internships.map((internship, index) => (
              <li key={index}>{internship}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggested Companies */}
      {result.companies && result.companies.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Suggested Companies</h3>
          <ul className="list-disc pl-6">
            {result.companies.map((company, index) => (
              <li key={index}>{company}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
