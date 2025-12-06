import React, { useState, useEffect } from "react";

/* =====================================================
   ANNA UNIVERSITY R2021 — AI & DS SUBJECT LIST
====================================================== */

const SUBJECTS = {
  1: [
    { code: "HS3151", name: "Professional English - I" },
    { code: "MA3151", name: "Matrices and Calculus" },
    { code: "PH3151", name: "Engineering Physics" },
    { code: "CY3151", name: "Engineering Chemistry" },
    { code: "GE3151", name: "Problem Solving and Python Programming" },
    { code: "GE3171", name: "Python Programming Lab" },
  ],
  2: [
    { code: "HS3251", name: "Professional English - II" },
    { code: "MA3251", name: "Statistics and Numerical Methods" },
    { code: "PH3256", name: "Physics for Information Science" },
    { code: "BE3251", name: "Basic Electrical and Electronics Engineering" },
    { code: "CS3251", name: "Programming in C" },
    { code: "CS3271", name: "C Programming Lab" },
  ],
  3: [
    { code: "MA3354", name: "Discrete Mathematics" },
    { code: "AD3391", name: "Foundations of Data Science" },
    { code: "CS3351", name: "Digital Principles & Computer Organization" },
    { code: "AD3351", name: "Data Structures" },
    { code: "AD3352", name: "Probability and Queueing Theory" },
  ],
  4: [
    { code: "AD3401", name: "Design and Analysis of Algorithms" },
    { code: "AD3491", name: "Database Management Systems" },
    { code: "CS3491", name: "Artificial Intelligence" },
    { code: "AD3451", name: "Machine Learning" },
    { code: "AD3411", name: "Algorithms Laboratory" },
  ],
  5: [
    { code: "AD3501", name: "Deep Learning" },
    { code: "CS3551", name: "Computer Networks" },
    { code: "AD3502", name: "Big Data Analytics" },
    { code: "AD3503", name: "Reinforcement Learning" },
  ],
  6: [
    { code: "CS3691", name: "Cyber Security" },
    { code: "AD3601", name: "Natural Language Processing" },
    { code: "AD3602", name: "Cloud Computing" },
  ],
};

// Generate user ID per browser
const getUserId = () => {
  let uid = localStorage.getItem("qpUserId");
  if (!uid) {
    uid = "USER-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    localStorage.setItem("qpUserId", uid);
  }
  return uid;
};

export default function QuestionBank() {
  const userId = getUserId();

  const [tab, setTab] = useState("upload"); // upload | search | mine
  const [semester, setSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [manualSubjectName, setManualSubjectName] = useState("");
  const [manualSubjectCode, setManualSubjectCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Load saved uploads from localStorage
  const [uploads, setUploads] = useState(() => {
    const saved = localStorage.getItem("qpUploads");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem("qpUploads", JSON.stringify(uploads));
  }, [uploads]);

  // Upload handler
  const handleUpload = (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("qpFile");

    if (!fileInput.files.length) {
      alert("Please select a question paper file.");
      return;
    }

    const file = fileInput.files[0];
    const finalName =
      manualSubjectName || (selectedSubject && selectedSubject.name);
    const finalCode =
      manualSubjectCode || (selectedSubject && selectedSubject.code);

    if (!finalName || !finalCode) {
      alert("Please select or enter subject details.");
      return;
    }

    const newUpload = {
      id: Date.now(),
      userId: userId, // ← Tag upload to current user
      subject: finalName,
      code: finalCode,
      internal: document.getElementById("internalType").value,
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
    };

    setUploads([newUpload, ...uploads]);
    fileInput.value = "";
    alert("Uploaded successfully!");
  };

  // Delete functionality
  const handleDelete = (id) => {
    if (window.confirm("Do you want to delete this question paper?")) {
      setUploads(uploads.filter((u) => u.id !== id));
    }
  };

  // Search results
  const searchResults = uploads.filter(
    (u) =>
      u.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Only this user's uploads
  const myUploads = uploads.filter((u) => u.userId === userId);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <h1 className="text-3xl font-bold text-center mb-6">
        Question Paper Repository
      </h1>

      {/* TABS */}
      <div className="flex justify-center gap-4 mb-6">
        {["upload", "search", "mine"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded ${
              tab === t
                ? "bg-blue-900 text-white"
                : "bg-white border shadow text-gray-700"
            }`}
          >
            {t === "upload" && "Upload"}
            {t === "search" && "Search"}
            {t === "mine" && "My Uploads"}
          </button>
        ))}
      </div>

      {/* TAB: UPLOAD SECTION */}
      {tab === "upload" && (
        <div>
          {/* SEMESTER SELECTOR */}
          <div className="bg-white p-4 shadow rounded mb-6">
            <label className="font-semibold">Select Semester:</label>
            <select
              className="w-full p-2 border rounded mt-2"
              value={semester}
              onChange={(e) => {
                setSemester(e.target.value);
                setSelectedSubject("");
                setManualSubjectCode("");
                setManualSubjectName("");
              }}
            >
              <option value="">-- Select --</option>
              {Object.keys(SUBJECTS).map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          {/* SUBJECT SELECTOR */}
          {semester && (
            <div className="bg-white p-4 shadow rounded mb-6">
              <label className="font-semibold">Select Subject:</label>
              <select
                className="w-full p-2 border rounded mt-2"
                value={selectedSubject.code || ""}
                onChange={(e) => {
                  const subject = SUBJECTS[semester].find(
                    (s) => s.code === e.target.value
                  );
                  setSelectedSubject(subject);
                }}
              >
                <option value="">-- Choose from list --</option>
                {SUBJECTS[semester].map((sub) => (
                  <option key={sub.code} value={sub.code}>
                    {sub.code} — {sub.name}
                  </option>
                ))}
              </select>

              <p className="text-center my-3 text-gray-500">OR</p>

              <input
                type="text"
                placeholder="Subject Name"
                className="w-full p-2 border rounded mb-2"
                value={manualSubjectName}
                onChange={(e) => setManualSubjectName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Subject Code"
                className="w-full p-2 border rounded"
                value={manualSubjectCode}
                onChange={(e) => setManualSubjectCode(e.target.value)}
              />
            </div>
          )}

          {/* UPLOAD FORM */}
          {(selectedSubject || manualSubjectName) && (
            <form onSubmit={handleUpload} className="bg-white p-4 shadow rounded">
              <label className="font-semibold">Internal Type:</label>
              <select id="internalType" className="w-full p-2 border rounded mt-2">
                <option>Internal 1</option>
                <option>Internal 2</option>
              </select>

              <label className="font-semibold mt-4 block">Upload File:</label>
              <input
                type="file"
                id="qpFile"
                className="w-full p-2 border rounded mt-2 bg-white"
                accept=".pdf,.jpg,.jpeg,.png"
              />

              <button
                type="submit"
                className="mt-4 w-full bg-blue-900 text-white p-2 rounded"
              >
                Upload Question Paper
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB: SEARCH SECTION */}
      {tab === "search" && (
        <div className="bg-white p-4 shadow rounded">
          <input
            type="text"
            placeholder="Search by subject or code..."
            className="w-full p-2 border rounded mb-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {searchQuery.trim() === "" ? (
            <p className="text-gray-400 text-center">
              Type a keyword to search question papers.
            </p>
          ) : searchResults.length === 0 ? (
            <p className="text-gray-500 text-center">No question papers found.</p>
          ) : (
            searchResults.map((u) => (
              <div
                key={u.id}
                className="border p-3 rounded mb-3 bg-gray-50 shadow-sm"
              >
                <p className="font-semibold">
                  {u.code} — {u.subject}
                </p>
                <p className="text-sm text-gray-600">{u.internal}</p>

                <div className="mt-2 flex gap-2">
                  <a
                    href={u.fileUrl}
                    target="_blank"
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    View
                  </a>
                  <a
                    href={u.fileUrl}
                    download={u.fileName}
                    className="bg-gray-700 text-white px-3 py-1 rounded"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB: MY UPLOADS */}
      {tab === "mine" && (
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-bold mb-4"> My Uploads</h2>

          {myUploads.length === 0 ? (
            <p className="text-gray-500 text-center">
              You have not uploaded any question papers yet.
            </p>
          ) : (
            myUploads.map((u) => (
              <div
                key={u.id}
                className="border p-3 rounded mb-3 bg-gray-50 shadow-sm"
              >
                <p className="font-semibold">
                  {u.code} — {u.subject}
                </p>
                <p className="text-sm text-gray-600">{u.internal}</p>

                <div className="mt-2 flex gap-2">
                  <a
                    href={u.fileUrl}
                    target="_blank"
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    View
                  </a>

                  <a
                    href={u.fileUrl}
                    download={u.fileName}
                    className="bg-gray-700 text-white px-3 py-1 rounded"
                  >
                    Download
                  </a>

                  <button
                    onClick={() => handleDelete(u.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
