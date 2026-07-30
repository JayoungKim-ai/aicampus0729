function TeamMember({ member }) {
  return (
    <div className="group bg-white rounded-4xl p-6 pt-9 border border-primary-100 shadow-soft hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden animate-fade-in">
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500 rounded-t-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="w-20 h-20 rounded-full bg-primary-50 border-2 border-primary-100 overflow-hidden mb-5 group-hover:scale-105 transition-transform duration-300">
        <img
          src={member.avatar}
          alt={member.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-caption font-bold text-primary-500 bg-primary-50 px-2.5 py-0.5 rounded-md">
          {member.role}
        </span>
        <span className="text-caption font-semibold text-gray-600">
          {member.department}
        </span>
      </div>

      <h3 className="text-heading-md font-extrabold text-gray-900 mb-2">
        {member.name}
      </h3>
      <p className="text-body text-gray-500 leading-relaxed mb-5">
        {member.description}
      </p>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {/* ===== 기술스택 시작 ===== */}
        {member.skills.map((skill, idx) => (
          <span
            className="text-caption font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-md border border-gray-200"
            key={idx}
          >
            {skill}
          </span>
        ))}
        {/* ===== 기술스택 끝  ===== */}
      </div>

      <div className="w-full h-px bg-gray-100 mb-4" />

      <a
        href={member.github}
        className="flex items-center gap-2.5 w-full text-caption text-gray-500 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors"
      >
        🔗 {member.github}
      </a>
      <a
        href={member.email}
        className="flex items-center gap-2.5 w-full text-caption text-gray-500 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors mt-1"
      >
        ✉️ {member.email}
      </a>
    </div>
  );
}

export default TeamMember;
