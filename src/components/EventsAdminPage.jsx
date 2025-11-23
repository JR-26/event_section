import React, { useState } from "react";

export default function EventsAdminPage() {
  const [activeTab, setActiveTab] = useState("upcoming");

  // All categories shown in dropdown (used for both upcoming & past)
  const categories = [
    "Hackathon",
    "Cultural Fests",
    "Management Fests",
    "Literary Fests",
    "Sports Fests",
    "Conferences",
    "Online Events",
    "Seminar",
    "Workshops",
    "Trainings",
    "Internships",
  ];

  // Category groupings for logic (upcoming)
  const festCategories = [
    "Cultural Fests",
    "Management Fests",
    "Seminar",
    "Workshops",
  ];
  const hackathonCategories = ["Hackathon"];
  const trainingCategories = ["Trainings", "Internships"];
  const literaryCategories = ["Literary Fests"];
  const sportsCategories = ["Sports Fests"];
  const conferenceCategories = ["Conferences"];
  const onlineCategories = ["Online Events"];

  // UPCOMING: step & category
  const [step, setStep] = useState("category"); // "category" | "form"
  const [selectedCategory, setSelectedCategory] = useState("");

  // UPCOMING: data
  const [eventData, setEventData] = useState({
    // common / fest fields
    name: "",
    mode: "",
    venue: "",
    type: "",
    theme: "",
    organizer: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    description: "",
    poster: null,
    deadlines: "",
    fees: "",
    registrationLink: "",
    guestDetails: "",
    contact: "",
    maxParticipants: "",
    teamSize: "",
    eligibility: "",

    // trainings / internships
    companyName: "",
    domain: "",
    duration: "",

    // literary
    litCategory: "",
    rules: "",

    // sports
    sportType: "",
    maxTeams: "",
    equipment: "",

    // conferences
    journalInfo: "",
    keynote: "",

    // online
    platform: "",
    eventLink: "",

    // hackathon specific
    hackProblemStatements: "",
    hackTechStack: "",
    hackJudgingCriteria: "",
    hackPrizes: "",
    hackMentors: "",
    hackRules: "",
  });

  const handleEventChange = (e) => {
    const { name, value, files } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // PAST: step & category
  const [pastStep, setPastStep] = useState("category"); // "category" | "form"
  const [pastSelectedCategory, setPastSelectedCategory] = useState("");

  // PAST: outcome-only data (option A)
  const [pastData, setPastData] = useState({
    // generic
    eventName: "",
    date: "",
    summary: "",

    // hackathon
    hackWinningTeam: "",
    hackWinningMembers: "",
    hackPrizeAmount: "",
    hackRunnerUp: "",
    hackBestInnovation: "",

    // cultural / management fest
    festOverallChampion: "",
    festBestPerformance: "",
    festCategoryWinners: "",
    festJudgeComments: "",

    // literary
    litWinnerName: "",
    litCategory: "",
    litBestPerformer: "",

    // sports
    sportType: "",
    sportWinner: "",
    sportRunnerUp: "",
    sportScore: "",
    sportBestPlayer: "",

    // conferences
    confKeynote: "",
    confBestPaper: "",
    confPapersPresented: "",
    confHighlights: "",

    // trainings / internships
    trainCompanyName: "",
    trainDomain: "",
    trainStudentsCount: "",
    trainDuration: "",
    trainOutcomeSummary: "",

    // online events
    onlineType: "",
    onlineSpeaker: "",
    onlineParticipants: "",
    onlineRecordingLink: "",
  });

  const handlePastChange = (e) => {
    const { name, value } = e.target;
    setPastData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Helper to compute duration for hackathon (for upcoming description)
  const computeDuration = (d) => {
    if (!d.startDate || !d.endDate || !d.startTime || !d.endTime) {
      return "-";
    }
    const start = new Date(`${d.startDate}T${d.startTime}:00`);
    const end = new Date(`${d.endDate}T${d.endTime}:00`);
    const ms = end - start;
    if (ms <= 0) return "-";
    const hours = ms / (1000 * 60 * 60);
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remHours = Math.round(hours - days * 24);
      if (remHours === 0) return `${days} day(s)`;
      return `${days} day(s) ${remHours} hour(s)`;
    }
    return `${Math.round(hours)} hour(s)`;
  };

  // Build rich description for Google Calendar (upcoming)
  const buildDescription = (category, d) => {
    if (hackathonCategories.includes(category)) {
      const durationText = computeDuration(d);
      return `
Category: Hackathon
Hackathon Name: ${d.name || "-"}
Mode: ${d.mode || "-"}
Venue: ${d.venue || "-"}
Organizer: ${d.organizer || "-"}
Theme / Focus Area: ${d.theme || "-"}
Start: ${d.startDate || "-"} ${d.startTime || ""}
End: ${d.endDate || d.startDate || "-"} ${d.endTime || ""}
Duration: ${durationText}
Team Size: ${d.teamSize || "-"}
Max Participants / Teams: ${d.maxParticipants || "-"}
Problem Statements: ${d.hackProblemStatements || "-"}
Tech Stack Allowed / Preferred: ${d.hackTechStack || "-"}
Judging Criteria: ${d.hackJudgingCriteria || "-"}
Prizes: ${d.hackPrizes || "-"}
Mentors / Guests: ${d.hackMentors || "-"}
Rules: ${d.hackRules || "-"}
Registration Link: ${d.registrationLink || "-"}
Contact: ${d.contact || "-"}
Eligibility: ${d.eligibility || "-"}
Description:
${d.description || "-"}
`;
    }

    if (festCategories.includes(category)) {
      return `
Category: ${category}
Event Name: ${d.name}
Mode: ${d.mode || "-"}
Venue: ${d.venue || "-"}
Event Type: ${d.type || "-"}
Theme: ${d.theme || "-"}
Organizer: ${d.organizer || "-"}
Start Date: ${d.startDate || "-"}
End Date: ${d.endDate || d.startDate || "-"}
Description: ${d.description || "-"}
Deadlines: ${d.deadlines || "-"}
Registration Fees: ${d.fees || "-"}
Registration Link: ${d.registrationLink || "-"}
Guest Details: ${d.guestDetails || "-"}
Contact: ${d.contact || "-"}
Max Participants: ${d.maxParticipants || "-"}
Team Size: ${d.teamSize || "-"}
Eligibility: ${d.eligibility || "-"}
`;
    }

    if (trainingCategories.includes(category)) {
      return `
Category: ${category}
Company Name: ${d.companyName || "-"}
Domain: ${d.domain || "-"}
Duration: ${d.duration || "-"}
Venue: ${d.venue || "-"}
Fees: ${d.fees || "-"}
Registration Link: ${d.registrationLink || "-"}
Contact Number: ${d.contact || "-"}
Start Date: ${d.startDate || "-"}
`;
    }

    if (literaryCategories.includes(category)) {
      return `
Category: Literary Event
Event Name: ${d.name || "-"}
Category: ${d.litCategory || "-"}
Theme: ${d.theme || "-"}
Rules: ${d.rules || "-"}
Venue: ${d.venue || "-"}
Date: ${d.startDate || "-"}
Time: ${d.startTime || "-"}
Organizer: ${d.organizer || "-"}
Contact: ${d.contact || "-"}
`;
    }

    if (sportsCategories.includes(category)) {
      return `
Category: Sports Event
Sport: ${d.sportType || "-"}
Event Name: ${d.name || "-"}
Venue: ${d.venue || "-"}
Date: ${d.startDate || "-"}
Time: ${d.startTime || "-"}
Team Size: ${d.teamSize || "-"}
Max Teams: ${d.maxTeams || "-"}
Equipment Provided: ${d.equipment || "-"}
Contact: ${d.contact || "-"}
`;
    }

    if (conferenceCategories.includes(category)) {
      return `
Category: Conference
Conference Name: ${d.name || "-"}
Theme: ${d.theme || "-"}
Organizer: ${d.organizer || "-"}
Venue: ${d.venue || "-"}
Start Date: ${d.startDate || "-"}
End Date: ${d.endDate || d.startDate || "-"}
Timings: ${d.startTime || "-"} to ${d.endTime || "-"}
Paper Publishing Fee: ${d.fees || "-"}
Journal Publication Info: ${d.journalInfo || "-"}
Keynote Speaker: ${d.keynote || "-"}
Contact: ${d.contact || "-"}
`;
    }

    if (onlineCategories.includes(category)) {
      return `
Category: Online Event
Event Name: ${d.name || "-"}
Platform: ${d.platform || "-"}
Event Link: ${d.eventLink || "-"}
Date: ${d.startDate || "-"}
Time: ${d.startTime || "-"}
Organizer: ${d.organizer || "-"}
Description: ${d.description || "-"}
Contact: ${d.contact || "-"}
`;
    }

    // Fallback
    return `
Category: ${category}
Event Name: ${d.name || "-"}
Venue: ${d.venue || "-"}
Organizer: ${d.organizer || "-"}
Date: ${d.startDate || "-"}
Description: ${d.description || "-"}
Contact: ${d.contact || "-"}
`;
  };

  // UPCOMING submit -> send to backend (Google Calendar)
  const handleUpcomingSubmit = async (e) => {
    e.preventDefault();

    if (!eventData.startDate) {
      alert("Please select at least a start date for the event.");
      return;
    }

    const allDay = !eventData.startTime; // Option 3: all-day if no time

    const description = buildDescription(selectedCategory, eventData);

    const payload = {
      title:
        eventData.name ||
        eventData.companyName ||
        `${selectedCategory} Event`,
      venue: eventData.venue || "-",
      description,
      startDate: eventData.startDate,
      endDate: eventData.endDate || eventData.startDate,
      startTime: eventData.startTime || null,
      endTime: eventData.endTime || null,
      allDay,
    };

    console.log("Sending event to backend:", payload);

    try {
      const res = await fetch("http://localhost:5000/create-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Backend Response:", data);

      alert("Event saved and added to Google Calendar!");

      // Reset upcoming state
      setStep("category");
      setSelectedCategory("");
      setEventData({
        name: "",
        mode: "",
        venue: "",
        type: "",
        theme: "",
        organizer: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        description: "",
        poster: null,
        deadlines: "",
        fees: "",
        registrationLink: "",
        guestDetails: "",
        contact: "",
        maxParticipants: "",
        teamSize: "",
        eligibility: "",
        companyName: "",
        domain: "",
        duration: "",
        litCategory: "",
        rules: "",
        sportType: "",
        maxTeams: "",
        equipment: "",
        journalInfo: "",
        keynote: "",
        platform: "",
        eventLink: "",
        hackProblemStatements: "",
        hackTechStack: "",
        hackJudgingCriteria: "",
        hackPrizes: "",
        hackMentors: "",
        hackRules: "",
      });
    } catch (err) {
      console.error("Error creating event:", err);
      alert("Failed to sync event to Google Calendar!");
    }
  };

  // PAST submit -> only store/display, NOT Google Calendar
  const handlePastSubmit = (e) => {
    e.preventDefault();

    console.log("Past Event Category:", pastSelectedCategory);
    console.log("Past Event Data:", pastData);

    alert("Past event details saved (outcomes recorded)!");
    // Later you can send this to your backend / Supabase.
    setPastStep("category");
    setPastSelectedCategory("");
    setPastData({
      eventName: "",
      date: "",
      summary: "",
      hackWinningTeam: "",
      hackWinningMembers: "",
      hackPrizeAmount: "",
      hackRunnerUp: "",
      hackBestInnovation: "",
      festOverallChampion: "",
      festBestPerformance: "",
      festCategoryWinners: "",
      festJudgeComments: "",
      litWinnerName: "",
      litCategory: "",
      litBestPerformer: "",
      sportType: "",
      sportWinner: "",
      sportRunnerUp: "",
      sportScore: "",
      sportBestPlayer: "",
      confKeynote: "",
      confBestPaper: "",
      confPapersPresented: "",
      confHighlights: "",
      trainCompanyName: "",
      trainDomain: "",
      trainStudentsCount: "",
      trainDuration: "",
      trainOutcomeSummary: "",
      onlineType: "",
      onlineSpeaker: "",
      onlineParticipants: "",
      onlineRecordingLink: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Admin Panel – Event Management
      </h1>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <button
          className={`px-6 py-2 mx-2 rounded-xl shadow text-lg font-semibold ${
            activeTab === "upcoming"
              ? "bg-blue-600 text-white"
              : "bg-white text-black"
          }`}
          onClick={() => {
            setActiveTab("upcoming");
            setStep("category");
          }}
        >
          Create Upcoming Event
        </button>

        <button
          className={`px-6 py-2 mx-2 rounded-xl shadow text-lg font-semibold ${
            activeTab === "past"
              ? "bg-blue-600 text-white"
              : "bg-white text-black"
          }`}
          onClick={() => {
            setActiveTab("past");
            setPastStep("category");
          }}
        >
          Create Past Event
        </button>
      </div>

      {/* ------------------- UPCOMING EVENTS SECTION ------------------- */}

      {/* UPCOMING – CATEGORY SELECT */}
      {activeTab === "upcoming" && step === "category" && (
        <div className="bg-white w-full max-w-3xl mx-auto p-8 rounded-2xl shadow-xl space-y-4">
          <h2 className="text-2xl font-semibold">Select Event Category</h2>

          <select
            className="w-full p-3 border rounded-xl"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            onClick={() =>
              selectedCategory
                ? setStep("form")
                : alert("Please select a category")
            }
            className="w-full py-3 bg-blue-600 text-white rounded-xl text-lg font-semibold"
          >
            Next →
          </button>
        </div>
      )}

      {/* UPCOMING – CATEGORY-SPECIFIC FORM */}
      {activeTab === "upcoming" && step === "form" && (
        <form
          onSubmit={handleUpcomingSubmit}
          className="bg-white w-full max-w-4xl mx-auto p-8 rounded-2xl shadow-xl space-y-4"
        >
          <h2 className="text-2xl font-semibold mb-2">
            {selectedCategory} – Event Details
          </h2>

          {/* COMMON FIELD: Event Name */}
          <input
            name="name"
            placeholder="Event Name"
            className="w-full p-3 border rounded-xl"
            required
            onChange={handleEventChange}
            value={eventData.name}
          />

          {/* HACKATHON FIELDS */}
          {hackathonCategories.includes(selectedCategory) && (
            <>
              <input
                name="mode"
                placeholder="Event Mode (Online/Offline)"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.mode}
              />
              <input
                name="venue"
                placeholder="Venue"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.venue}
              />
              <input
                name="organizer"
                placeholder="Organizer"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.organizer}
              />
              <input
                name="theme"
                placeholder="Hackathon Theme / Focus Area"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.theme}
              />

              <label className="font-semibold">Start Date</label>
              <input
                type="date"
                name="startDate"
                className="w-full p-3 border rounded-xl"
                required
                onChange={handleEventChange}
                value={eventData.startDate}
              />

              <label className="font-semibold">End Date</label>
              <input
                type="date"
                name="endDate"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.endDate}
              />

              <label className="font-semibold">Start Time</label>
              <input
                type="time"
                name="startTime"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.startTime}
              />

              <label className="font-semibold">End Time</label>
              <input
                type="time"
                name="endTime"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.endTime}
              />

              <input
                name="teamSize"
                placeholder="Team Size (e.g., 3–4 members)"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.teamSize}
              />

              <input
                name="maxParticipants"
                placeholder="Max Teams / Participants"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.maxParticipants}
              />

              <textarea
                name="hackProblemStatements"
                placeholder="Problem Statements"
                className="w-full p-3 border rounded-xl h-24"
                onChange={handleEventChange}
                value={eventData.hackProblemStatements}
              ></textarea>

              <textarea
                name="hackTechStack"
                placeholder="Tech Stack Allowed / Preferred"
                className="w-full p-3 border rounded-xl h-24"
                onChange={handleEventChange}
                value={eventData.hackTechStack}
              ></textarea>

              <textarea
                name="hackJudgingCriteria"
                placeholder="Judging Criteria"
                className="w-full p-3 border rounded-xl h-24"
                onChange={handleEventChange}
                value={eventData.hackJudgingCriteria}
              ></textarea>

              <textarea
                name="hackPrizes"
                placeholder="Prizes (e.g., cash, goodies, internships)"
                className="w-full p-3 border rounded-xl h-24"
                onChange={handleEventChange}
                value={eventData.hackPrizes}
              ></textarea>

              <textarea
                name="hackMentors"
                placeholder="Mentors / Guests (names / organizations)"
                className="w-full p-3 border rounded-xl h-24"
                onChange={handleEventChange}
                value={eventData.hackMentors}
              ></textarea>

              <textarea
                name="hackRules"
                placeholder="Rules & Regulations"
                className="w-full p-3 border rounded-xl h-28"
                onChange={handleEventChange}
                value={eventData.hackRules}
              ></textarea>

              <textarea
                name="description"
                placeholder="Additional Description / Notes"
                className="w-full p-3 border rounded-xl h-28"
                onChange={handleEventChange}
                value={eventData.description}
              ></textarea>

              <input
                name="registrationLink"
                placeholder="Registration Link"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.registrationLink}
              />

              <input
                name="eligibility"
                placeholder="Eligibility (e.g., BE CSE/IT, 2nd year+)"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.eligibility}
              />

              <input
                name="contact"
                placeholder="Contact (Name & Phone / Email)"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.contact}
              />
            </>
          )}

          {/* FEST / SEMINAR / WORKSHOP */}
          {festCategories.includes(selectedCategory) && (
            <>
              <input
                name="mode"
                placeholder="Event Mode (Online/Offline)"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.mode}
              />
              <input
                name="venue"
                placeholder="Venue (if not online)"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.venue}
              />
              <input
                name="type"
                placeholder="Event Type"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.type}
              />
              <input
                name="theme"
                placeholder="Event Theme"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.theme}
              />
              <input
                name="organizer"
                placeholder="Organizer"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.organizer}
              />

              <label className="font-semibold">Start Date</label>
              <input
                type="date"
                name="startDate"
                className="w-full p-3 border rounded-xl"
                required
                onChange={handleEventChange}
                value={eventData.startDate}
              />

              <label className="font-semibold">End Date</label>
              <input
                type="date"
                name="endDate"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.endDate}
              />

              <textarea
                name="description"
                placeholder="Event Description"
                className="w-full p-3 border rounded-xl h-32"
                onChange={handleEventChange}
                value={eventData.description}
              ></textarea>

              <label className="font-semibold">Poster</label>
              <input
                type="file"
                name="poster"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
              />

              <input
                name="deadlines"
                placeholder="Deadlines (if any)"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.deadlines}
              />
              <input
                name="fees"
                placeholder="Registration Fees (if any)"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.fees}
              />
              <input
                name="registrationLink"
                placeholder="Event Registration Link (if any)"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.registrationLink}
              />
              <input
                name="guestDetails"
                placeholder="Event Guest Details (if any)"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.guestDetails}
              />
              <input
                name="contact"
                placeholder="Contact"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.contact}
              />
              <input
                name="maxParticipants"
                placeholder="Max Participants"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.maxParticipants}
              />
              <input
                name="teamSize"
                placeholder="Team Size (if team event)"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.teamSize}
              />
              <input
                name="eligibility"
                placeholder="Eligibility"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.eligibility}
              />
            </>
          )}

          {/* TRAININGS / INTERNSHIPS */}
          {trainingCategories.includes(selectedCategory) && (
            <>
              <input
                name="companyName"
                placeholder="Company Name"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.companyName}
              />
              <input
                name="domain"
                placeholder="Domain of Internship / Training"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.domain}
              />
              <input
                name="fees"
                placeholder="Fees (if any)"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.fees}
              />
              <input
                name="duration"
                placeholder="Duration"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.duration}
              />
              <input
                name="venue"
                placeholder="Venue"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.venue}
              />
              <input
                name="registrationLink"
                placeholder="Registration Link"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.registrationLink}
              />
              <input
                name="contact"
                placeholder="Contact Number"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.contact}
              />
              <label className="font-semibold">Start Date</label>
              <input
                type="date"
                name="startDate"
                className="w-full p-3 border rounded-xl"
                required
                onChange={handleEventChange}
                value={eventData.startDate}
              />
            </>
          )}

          {/* LITERARY */}
          {literaryCategories.includes(selectedCategory) && (
            <>
              <input
                name="litCategory"
                placeholder="Literary Category (Poetry, Essay, Debate, etc.)"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.litCategory}
              />
              <input
                name="theme"
                placeholder="Theme"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.theme}
              />
              <textarea
                name="rules"
                placeholder="Rules"
                className="w-full p-3 border rounded-xl h-24"
                onChange={handleEventChange}
                value={eventData.rules}
              ></textarea>
              <input
                name="venue"
                placeholder="Venue"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.venue}
              />
              <label className="font-semibold">Date</label>
              <input
                type="date"
                name="startDate"
                className="w-full p-3 border rounded-xl"
                required
                onChange={handleEventChange}
                value={eventData.startDate}
              />
              <label className="font-semibold">Time</label>
              <input
                type="time"
                name="startTime"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.startTime}
              />
              <input
                name="organizer"
                placeholder="Organizer"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.organizer}
              />
              <input
                name="contact"
                placeholder="Contact"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.contact}
              />
            </>
          )}

          {/* SPORTS */}
          {sportsCategories.includes(selectedCategory) && (
            <>
              <input
                name="sportType"
                placeholder="Sport Type (e.g., Football, Cricket)"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.sportType}
              />
              <input
                name="venue"
                placeholder="Venue"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.venue}
              />
              <label className="font-semibold">Date</label>
              <input
                type="date"
                name="startDate"
                className="w-full p-3 border rounded-xl"
                required
                onChange={handleEventChange}
                value={eventData.startDate}
              />
              <label className="font-semibold">Time</label>
              <input
                type="time"
                name="startTime"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.startTime}
              />
              <input
                name="teamSize"
                placeholder="Team Size"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.teamSize}
              />
              <input
                name="maxTeams"
                placeholder="Max Teams"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.maxTeams}
              />
              <input
                name="equipment"
                placeholder="Equipment Provided? (Yes/No/Details)"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.equipment}
              />
              <input
                name="contact"
                placeholder="Contact"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.contact}
              />
            </>
          )}

          {/* CONFERENCES */}
          {conferenceCategories.includes(selectedCategory) && (
            <>
              <input
                name="theme"
                placeholder="Conference Theme"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.theme}
              />
              <input
                name="organizer"
                placeholder="Organizer"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.organizer}
              />
              <input
                name="venue"
                placeholder="Venue"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.venue}
              />
              <label className="font-semibold">Start Date</label>
              <input
                type="date"
                name="startDate"
                className="w-full p-3 border rounded-xl"
                required
                onChange={handleEventChange}
                value={eventData.startDate}
              />
              <label className="font-semibold">End Date</label>
              <input
                type="date"
                name="endDate"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.endDate}
              />
              <label className="font-semibold">Start Time</label>
              <input
                type="time"
                name="startTime"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.startTime}
              />
              <label className="font-semibold">End Time</label>
              <input
                type="time"
                name="endTime"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.endTime}
              />
              <input
                name="fees"
                placeholder="Paper Publishing Fees"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.fees}
              />
              <input
                name="journalInfo"
                placeholder="Journal Publication Info"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.journalInfo}
              />
              <input
                name="keynote"
                placeholder="Keynote Speaker"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.keynote}
              />
              <input
                name="contact"
                placeholder="Contact"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.contact}
              />
            </>
          )}

          {/* ONLINE EVENTS */}
          {onlineCategories.includes(selectedCategory) && (
            <>
              <input
                name="platform"
                placeholder="Platform (Google Meet / Zoom / MS Teams)"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.platform}
              />
              <input
                name="eventLink"
                placeholder="Event Link"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.eventLink}
              />
              <label className="font-semibold">Date</label>
              <input
                type="date"
                name="startDate"
                className="w-full p-3 border rounded-xl"
                required
                onChange={handleEventChange}
                value={eventData.startDate}
              />
              <label className="font-semibold">Time</label>
              <input
                type="time"
                name="startTime"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.startTime}
              />
              <input
                name="organizer"
                placeholder="Organizer"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.organizer}
              />
              <textarea
                name="description"
                placeholder="Event Description"
                className="w-full p-3 border rounded-xl h-28"
                onChange={handleEventChange}
                value={eventData.description}
              ></textarea>
              <input
                name="contact"
                placeholder="Contact"
                className="w-full p-3 border rounded-xl"
                onChange={handleEventChange}
                value={eventData.contact}
              />
            </>
          )}

          {/* BUTTONS */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep("category")}
              className="px-6 py-3 bg-gray-400 text-white rounded-xl"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white rounded-xl"
            >
              Submit Event
            </button>
          </div>
        </form>
      )}

      {/* ------------------- PAST EVENTS SECTION ------------------- */}

      {/* PAST – CATEGORY SELECT */}
      {activeTab === "past" && pastStep === "category" && (
        <div className="bg-white w-full max-w-3xl mx-auto p-8 rounded-2xl shadow-xl space-y-4">
          <h2 className="text-2xl font-semibold">Select Past Event Category</h2>

          <select
            className="w-full p-3 border rounded-xl"
            value={pastSelectedCategory}
            onChange={(e) => setPastSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            onClick={() =>
              pastSelectedCategory
                ? setPastStep("form")
                : alert("Please select a category")
            }
            className="w-full py-3 bg-blue-600 text-white rounded-xl text-lg font-semibold"
          >
            Next →
          </button>
        </div>
      )}

      {/* PAST – CATEGORY-SPECIFIC OUTCOME FORM */}
      {activeTab === "past" && pastStep === "form" && (
        <form
          onSubmit={handlePastSubmit}
          className="bg-white w-full max-w-4xl mx-auto p-8 rounded-2xl shadow-xl space-y-4"
        >
          <h2 className="text-2xl font-semibold mb-2">
            {pastSelectedCategory} – Past Event Outcomes
          </h2>

          {/* Basic info */}
          <input
            name="eventName"
            placeholder="Event Name"
            className="w-full p-3 border rounded-xl"
            required
            onChange={handlePastChange}
            value={pastData.eventName}
          />
          <label className="font-semibold">Event Date (or final day)</label>
          <input
            type="date"
            name="date"
            className="w-full p-3 border rounded-xl"
            onChange={handlePastChange}
            value={pastData.date}
          />

          {/* Hackathon past outcomes */}
          {hackathonCategories.includes(pastSelectedCategory) && (
            <>
              <input
                name="hackWinningTeam"
                placeholder="Winning Team Name"
                className="w-full p-3 border rounded-xl"
                onChange={handlePastChange}
                value={pastData.hackWinningTeam}
              />
              <input
                name="hackWinningMembers"
                placeholder="Winning Team Members"
                className="w-full p-3 border rounded-xl"
                onChange={handlePastChange}
                value={pastData.hackWinningMembers}
              />
              <input
                name="hackPrizeAmount"
                placeholder="Prize Amount (e.g., ₹50,000)"
                className="w-full p-3 border rounded-xl"
                onChange={handlePastChange}
                value={pastData.hackPrizeAmount}
              />
              <input
                name="hackRunnerUp"
                placeholder="Runner-up Team"
                className="w-full p-3 border rounded-xl"
                onChange={handlePastChange}
                value={pastData.hackRunnerUp}
              />
              <input
                name="hackBestInnovation"
                placeholder="Best Innovation Award (Team/Project)"
                className="w-full p-3 border rounded-xl"
                onChange={handlePastChange}
                value={pastData.hackBestInnovation}
              />
            </>
          )}

          {/* Cultural / Management Fest past outcomes */}
          {(pastSelectedCategory === "Cultural Fests" ||
            pastSelectedCategory === "Management Fests") && (
            <>
              <input
                name="festOverallChampion"
                placeholder="Overall Champion (Department / Team)"
                className="w-full p-3 border rounded-xl"
                onChange={handlePastChange}
                value={pastData.festOverallChampion}
              />
              <input
                name="festBestPerformance"
                placeholder="Best Performance (Event / Group / Name)"
                className="w-full p-3 border rounded-xl"
                onChange={handlePastChange}
                value={pastData.festBestPerformance}
              />
              <textarea
                name="festCategoryWinners"
                placeholder="Category-wise Winners (e.g., Solo Singing – X, Group Dance – Y)"
                className="w-full p-3 border rounded-xl h-24"
                onChange={handlePastChange}
                value={pastData.festCategoryWinners}
              ></textarea>
              <textarea
                name="festJudgeComments"
                placeholder="Judge Comments / Highlights"
                className="w-full p-3 border rounded-xl h-24"
                onChange={handlePastChange}
                value={pastData.festJudgeComments}
              ></textarea>
            </>
          )}

          {/* Literary past outcomes */}
          {literaryCategories.includes(pastSelectedCategory) && (
            <>
              <input
                name="litWinnerName"
                placeholder="Overall Winner / Top Performer"
                className="w-full p-3 border rounded-xl"
                onChange={handlePastChange}
                value={pastData.litWinnerName}
              />
              <input
                name="litCategory"
                placeholder="Category (Poetry / Essay / Debate / Story, etc.)"
                className="w-full p-3 border rounded-xl"
                onChange={handlePastChange}
                value={pastData.litCategory}
              />
              <input
                name="litBestPerformer"
                placeholder="Best Speaker / Writer / Performer"
                className="w-full p-3 border rounded-xl"
                onChange={handlePastChange}
                value={pastData.litBestPerformer}
              />
            </>
          )}

          {/* Sports past outcomes */}
          {sportsCategories.includes(pastSelectedCategory) && (
            <>
              <input
                name="sportType"
                placeholder="Sport Type (e.g., Football, Cricket)"
                className="w-full p-3 border rounded-xl"
                onChange={handlePastChange}
                value={pastData.sportType}
              />
              <input
                name="sportWinner"
                placeholder="Winning Team / Player"
                className="w-full p-3 border rounded-xl"
                onChange={handlePastChange}
                value={pastData.sportWinner}
              />
              <input
                name="sportRunnerUp"
                placeholder="Runner-up Team / Player"
                className="w-full p-3 border rounded-xl"
                onChange={handlePastChange}
                value={pastData.sportRunnerUp}
              />
              <input
                name="sportScore"
                placeholder="Final Score (e.g., 3–1, 21–18)"
                className="w-full p-3 border rounded-xl"
                onChange={handlePastChange}
                value={pastData.sportScore}
              />
              <input
                name="sportBestPlayer"
                placeholder="Best Player / Man of the Match"
                className="w-full p-3 border rounded-xl"
                onChange={handlePastChange}
                value={pastData.sportBestPlayer}
              />
            </>
          )}

          {/* Conference past outcomes */}
          {conferenceCategories.includes(pastSelectedCategory) && (
            <>
              <input
                name="confKeynote"
                placeholder="Keynote Speaker Name"
                className="w-full p-3 border rounded-xl"
                onChange={handlePastChange}
                value={pastData.confKeynote}
              />
              <input
                name="confPapersPresented"
                placeholder="Total Papers Presented"
                className="w-full p-3 border rounded-xl"
                onChange={handlePastChange}
                value={pastData.confPapersPresented}
              />
              <input
                name="confBestPaper"
                placeholder="Best Paper Award (Author / Title)"
                className="w-full p-3 border rounded-xl"
                onChange={handlePastChange}
                value={pastData.confBestPaper}
              />
              <textarea
                name="confHighlights"
                placeholder="Conference Highlights / Outcomes"
                className="w-full p-3 border rounded-xl h-24"
                onChange={handlePastChange}
                value={pastData.confHighlights}
              ></textarea>
            </>
          )}

          {/* Trainings / Internships past outcomes */}
          {trainingCategories.includes(pastSelectedCategory) && (
            <>
              <input
                name="trainCompanyName"
                placeholder="Company Name"
                className="w-full p-3 border rounded-xl"
                onChange={handlePastChange}
                value={pastData.trainCompanyName}
              />
              <input
                name="trainDomain"
                placeholder="Domain / Technology"
                className="w-full p-3 border rounded-xl"
                onChange={handlePastChange}
                value={pastData.trainDomain}
              />
              <input
                name="trainStudentsCount"
                placeholder="Number of Students Participated"
                className="w-full p-3 border rounded-xl"
                onChange={handlePastChange}
                value={pastData.trainStudentsCount}
              />
              <input
                name="trainDuration"
                placeholder="Duration (e.g., 4 weeks, 6 months)"
                className="w-full p-3 border rounded-xl"
                onChange={handlePastChange}
                value={pastData.trainDuration}
              />
              <textarea
                name="trainOutcomeSummary"
                placeholder="Outcome Summary (Skills gained, offers, certificates, etc.)"
                className="w-full p-3 border rounded-xl h-24"
                onChange={handlePastChange}
                value={pastData.trainOutcomeSummary}
              ></textarea>
            </>
          )}

          {/* Online Events past outcomes */}
          {onlineCategories.includes(pastSelectedCategory) && (
            <>
              <input
                name="onlineType"
                placeholder="Event Type (Webinar, Guest Talk, Workshop, etc.)"
                className="w-full p-3 border rounded-xl"
                onChange={handlePastChange}
                value={pastData.onlineType}
              />
              <input
                name="onlineSpeaker"
                placeholder="Speaker / Resource Person"
                className="w-full p-3 border rounded-xl"
                onChange={handlePastChange}
                value={pastData.onlineSpeaker}
              />
              <input
                name="onlineParticipants"
                placeholder="Number of Participants"
                className="w-full p-3 border rounded-xl"
                onChange={handlePastChange}
                value={pastData.onlineParticipants}
              />
              <input
                name="onlineRecordingLink"
                placeholder="Recording Link (if any)"
                className="w-full p-3 border rounded-xl"
                onChange={handlePastChange}
                value={pastData.onlineRecordingLink}
              />
            </>
          )}

          {/* Generic summary (for all past events) */}
          <textarea
            name="summary"
            placeholder="Overall Session Summary / Key Takeaways"
            className="w-full p-3 border rounded-xl h-28"
            onChange={handlePastChange}
            value={pastData.summary}
          ></textarea>

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setPastStep("category")}
              className="px-6 py-3 bg-gray-400 text-white rounded-xl"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 text-white rounded-xl"
            >
              Save Past Event Details
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
