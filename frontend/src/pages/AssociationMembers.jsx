// frontend/src/pages/AssociationMembers.jsx
import React from "react";
import MemberCard from "../components/MemberCard";
import membersData from "../data/membersData";

const AssociationMembers = () => {
  // General Association roles
  const associationMembers = membersData.filter(
    (member) => member.domain === "Association"
  );

  // Club-based members
  const clubMembers = membersData.filter(
    (member) => member.domain !== "Association"
  );

  // Group club members by domain (club name)
  const clubGroups = clubMembers.reduce((acc, member) => {
    if (!acc[member.domain]) {
      acc[member.domain] = [];
    }
    acc[member.domain].push(member);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-5 rounded-2xl mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Association Members
        </h2>
        <p className="text-gray-500 mt-1">
          Leadership and club representatives of the AI & DS Association
        </p>
      </div>

      {/* =========================
          GENERAL ASSOCIATION TEAM
          ========================= */}
      <section className="mb-14">
        <h3 className="text-2xl font-bold text-blue-900 mb-2">
          General Association Members
        </h3>
        <p className="text-gray-500 mb-6">
          Office bearers responsible for the overall functioning of the association
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {associationMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </section>

      {/* =========================
          CLUB REPRESENTATIVES
          ========================= */}
      <section>
        <h3 className="text-2xl font-bold text-blue-900 mb-6">
          Club Representatives
        </h3>

        {/* Iterate through each club */}
        {Object.entries(clubGroups).map(([clubName, members]) => (
          <div key={clubName} className="mb-12">
            {/* Club Heading */}
            <h4 className="text-xl font-semibold text-gray-800 mb-1">
              {clubName}
            </h4>
            <p className="text-gray-500 mb-5">
              Representatives coordinating activities under {clubName}
            </p>

            {/* Club Members */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AssociationMembers;
