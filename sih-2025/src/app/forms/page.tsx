"use client";

import { useState } from "react";

type Question = {
  type: "multiple_choice" | "open_text" | "coding" | "scenario";
  question: string;
  options?: string[];
  answer_type: "single" | "multiple" | "text";
};

type Round = {
  name: string;
  description: string;
  time_limit: string;
  questions: Question[];
};

type Assessment = {
  rounds: Round[];
};

export default function QnAPage() {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [activeRound, setActiveRound] = useState(0);
  const [uploading, setUploading] = useState(false);

  // Handle resume upload
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fileInput = e.currentTarget.elements.namedItem(
      "resume"
    ) as HTMLInputElement;
    if (!fileInput?.files?.length) return;

    const formData = new FormData();
    formData.append("document", fileInput.files[0]);

    setUploading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.assessment) {
        const parsed: Assessment = data.assessment;

        // Save assessment
        setAssessment(parsed);
        localStorage.setItem("assessment", JSON.stringify(parsed));

        // Initialize answers if not already saved
        if (!localStorage.getItem("assessmentAnswers")) {
          localStorage.setItem("assessmentAnswers", JSON.stringify({}));
        }
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  // Handle changes to answers
  const handleChange = (
    roundIndex: number,
    qIndex: number,
    value: string
  ) => {
    const key = `${roundIndex}-${qIndex}`;
    setAnswers((prev) => {
      const prevVal = prev[key];
      if (Array.isArray(prevVal)) {
        return {
          ...prev,
          [key]: prevVal.includes(value)
            ? prevVal.filter((v) => v !== value)
            : [...prevVal, value],
        };
      }
      return { ...prev, [key]: value };
    });
  };

  // If no assessment yet → show upload screen
  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-600 p-6">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            Upload Your Resume
          </h1>
          <p className="text-gray-600 mb-6">
            Please upload your PDF or DOCX resume to generate your personalized
            assessment.
          </p>
          <form onSubmit={handleUpload} className="space-y-4">
            <input
              type="file"
              name="resume"
              accept=".pdf,.docx"
              className="block w-full text-sm text-gray-700 border rounded-lg cursor-pointer focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={uploading}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
            >
              {uploading ? "Processing..." : "Upload & Generate Assessment"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Normal Assessment UI
  const round = assessment.rounds[activeRound];
  const isLastRound = activeRound === assessment.rounds.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-600 p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          Internship Candidate Evaluation
        </h1>

        {/* Round Tabs */}
        <div className="flex space-x-4 mb-8 overflow-x-auto">
          {assessment.rounds.map((r, index) => (
            <button
              key={index}
              onClick={() => setActiveRound(index)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                activeRound === index
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>

        {/* Active Round Content */}
        <div>
          <h2 className="text-2xl font-semibold text-orange-600">
            {round.name}
          </h2>
          <p className="text-black mb-4">
            {round.description} ({round.time_limit} mins)
          </p>

          <div className="space-y-6">
            {round.questions.map((q, qIndex) => {
              const key = `${activeRound}-${qIndex}`;
              const value =
                answers[key] ?? (q.answer_type === "multiple" ? [] : "");

              return (
                <div
                  key={qIndex}
                  className="p-6 border rounded-xl shadow-sm bg-gray-50"
                >
                  <h3 className="text-lg font-semibold mb-3 text-black">
                    Q{qIndex + 1}.{" "}
                    {typeof q.question === "string"
                      ? q.question
                      : JSON.stringify(q.question)}
                  </h3>

                  {/* Multiple Choice */}
                  {q.type === "multiple_choice" && q.options && (
                    <div className="space-y-2 text-black">
                      {q.options.map((opt, i) => (
                        <label
                          key={i}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type={
                              q.answer_type === "multiple"
                                ? "checkbox"
                                : "radio"
                            }
                            name={`round-${activeRound}-q-${qIndex}`}
                            value={opt}
                            checked={
                              Array.isArray(value)
                                ? value.includes(opt)
                                : value === opt
                            }
                            onChange={(e) =>
                              handleChange(activeRound, qIndex, e.target.value)
                            }
                          />
                          <span className="text-black">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Open Text */}
                  {q.type === "open_text" && (
                    <textarea
                      className="w-full border rounded-lg p-3 text-black"
                      rows={3}
                      value={value as string}
                      onChange={(e) =>
                        handleChange(activeRound, qIndex, e.target.value)
                      }
                      placeholder="Write your answer..."
                    />
                  )}

                  {/* Coding */}
                  {q.type === "coding" && (
                    <textarea
                      className="w-full font-mono border rounded-lg p-3 bg-black text-green-300"
                      rows={6}
                      value={value as string}
                      onChange={(e) =>
                        handleChange(activeRound, qIndex, e.target.value)
                      }
                      placeholder="Write your code here..."
                    />
                  )}

                  {/* Scenario */}
                  {q.type === "scenario" && (
                    <textarea
                      className="w-full border rounded-lg p-3 text-black"
                      rows={4}
                      value={value as string}
                      onChange={(e) =>
                        handleChange(activeRound, qIndex, e.target.value)
                      }
                      placeholder="Your decision..."
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation & Submit */}
        <div className="mt-10 flex justify-between">
          <button
            disabled={activeRound === 0}
            onClick={() => setActiveRound((prev) => Math.max(0, prev - 1))}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeRound === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            Previous
          </button>

          {!isLastRound ? (
            <button
              onClick={() =>
                setActiveRound((prev) =>
                  Math.min(assessment.rounds.length - 1, prev + 1)
                )
              }
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Next
            </button>
          ) : (
            <button
              onClick={async () => {
                if (!assessment) return;

                const payload = { assessment, answers };

                try {
                  const res = await fetch("http://127.0.0.1:5000/analyse", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  });
                  const result = await res.json();

                  // Save results + assessment + answers
                  localStorage.setItem("analysis", JSON.stringify(result));
                  localStorage.setItem("assessment", JSON.stringify(assessment));
                  localStorage.setItem(
                    "assessmentAnswers",
                    JSON.stringify(answers)
                  );

                  // Redirect to submission page
                  window.location.href = "/submission";
                } catch (err) {
                  console.error("Failed to send answers", err);
                }
              }}
              className="bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition"
            >
              Submit Assessment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
