
export const profile = {
  name: "Ajith Kumar Rayeeshetti",
  title: "Software Engineer | Backend & Full-Stack Developer",
  stack: "Java · Spring Boot · React.js · Next.js · TypeScript · MySQL",
  bio: "B.Tech Computer Science (Artificial Intelligence) student at Parul University, graduating in 2027. I build end-to-end applications using Java, Spring Boot, React.js, Next.js, and Node.js. I have working knowledge of REST APIs, JWT authentication, role-based access control, database design, real-time messaging, Docker deployment, and AI integration.",
  email: "ajithkumarpatel03@gmail.com",
  phone: "+91 7569826552",
  location: "Warangal, Telangana, India",
  linkedin: "https://linkedin.com/in/ajith-kumar-rayeeshetti",
  github: "https://github.com/ajithkumarrayeeshetti",
  resume: process.env.NEXT_PUBLIC_RESUME_URL || "",
  education:
    "B.Tech Computer Science (Artificial Intelligence), Parul University, Vadodara, Gujarat. Expected graduation 2027.",
};

export const experience = [
  {
    company: "Brotech Websolutions",
    role: "Founder & CEO",
    period: "2025 – Present",
    points: [
      "Founded a client-facing web development startup and architected custom full-stack web applications for 3+ small business clients, managing complete delivery from system design to production deployment.",
      "Owned the full Software Development Life Cycle (SDLC), including requirements analysis, database schema design, API development, frontend implementation, QA testing, deployment pipelines, and post-launch maintenance.",
      "Applied Agile development practices for sprint planning, feature prioritization, and iterative delivery, consistently meeting client deadlines with production-ready software.",
    ],
  },
];
export const skills = [
  {
    group: "Programming Languages",
    items: ["Java", "SQL", "TypeScript", "JavaScript (Basic)", "Python (Basic)"],
  },
  {
    group: "Backend & APIs",
    items: [
      "Spring Boot 3",
      "Spring Security",
      "Node.js",
      "Express.js",
      "REST API Design",
      "JWT Authentication",
      "RBAC",
      "WebSockets",
      "Socket.IO",
    ],
  },
  {
    group: "Frontend",
    items: ["React.js", "Next.js 15", "Tailwind CSS", "HTML5", "CSS3"],
  },
  {
    group: "Databases",
    items: [
      "MySQL",
      "MongoDB",
      "Mongoose ODM",
      "Firebase Realtime Database",
      "Schema Design & Normalization",
      "Flyway Migrations",
    ],
  },
  {
    group: "Tools & DevOps",
    items: [
      "Git",
      "GitHub",
      "Docker",
      "Docker Compose",
      "Postman",
      "IntelliJ IDEA",
      "VS Code",
    ],
  },
  {
    group: "AI Integration",
    items: ["AI API Integration", "Ollama (Local LLM)", "Prompt Engineering"],
  },
  {
    group: "CS Fundamentals",
    items: [
      "Data Structures & Algorithms",
      "Object-Oriented Programming",
      "DBMS",
      "Operating Systems",
      "Computer Networks",
      "System Design",
    ],
  },
];

export const projects = [
  {
    title: "College Portal System: Academic ERP",
    blurb:
      "Role-based academic ERP web application for students, faculty, heads of department and administrators, featuring attendance validation, real-time dashboard updates, and grade calculation.",
    points: [
      "Built a Spring Boot REST API backend and React.js frontend for four roles: student, faculty, head of department, and admin",
      "Attendance validation using QR codes and GPS to verify student location against classroom coordinates and help prevent proxy attendance",
      "Implemented JWT authentication and role-based authorization for REST endpoints",
      "Used WebSockets to update dashboards in real time",
      "Added a grade and GPA calculation module",
    ],
    tags: [
      "Java",
      "Spring Boot",
      "React.js",
      "MySQL",
      "JWT",
      "REST APIs",
      "WebSockets",
      "QR Code API",
      "GPS Validation",
    ],
    link: "https://github.com/ajithkumarrayeeshetti/college-portal",
    shots: [
      { src: "/portal-student.jpg", caption: "Student dashboard" },
      { src: "/portal-admin.jpg", caption: "Admin dashboard" },
      { src: "/portal-faculty.jpg", caption: "Faculty dashboard" },
      { src: "/portal-hod.jpg", caption: "Head of Department dashboard" },
    ],
  },
  {
    title: "AI Job Outreach Platform",
    blurb:
      "Automated cold email and tracking system that parses resumes and job listings, generates personalized outreach emails using a locally hosted LLM, and tracks replies and follow-ups.",
    points: [
      "Built a multi-tier application with a Spring Boot 3 backend and Next.js 15 frontend using TypeScript",
      "Created an 8-table normalized MySQL schema containing users, jobs, emails, applications, follow-ups, replies, settings, and resumes with Flyway migrations",
      "Implemented Spring Security authentication and AES-256 encryption of stored SMTP credentials",
      "Built two scheduled background jobs for AI-based reply classification and Day-7/Day-14 follow-ups",
      "Containerized the backend, database, and LLM service using Docker Compose",
      "Tested API endpoints using Postman",
    ],
    tags: [
      "Java",
      "Spring Boot 3",
      "Next.js 15",
      "TypeScript",
      "MySQL",
      "Flyway",
      "Ollama",
      "Docker Compose",
      "JWT",
      "AES-256",
    ],
    link: "https://github.com/ajithkumarrayeeshetti/AI-Job-Outreach-Platform",
    shots: [
      { src: "/outreach-dashboard.jpg", caption: "Dashboard" },
      { src: "/outreach-upload.jpg", caption: "Upload workflow" },
      { src: "/outreach-settings.jpg", caption: "AI provider settings" },
    ],
  },
  {
    title: "KisanMithra: Agricultural Marketplace",
    blurb:
      "Full-stack agricultural marketplace connecting farmers directly with consumers through product listings, role-based dashboards, real-time communication, and AI-powered features.",
    points: [
      "Built an Express.js and MongoDB REST API for an agricultural marketplace connecting farmers with consumers",
      "Developed role-based dashboards for farmers, consumers, and administrators",
      "Implemented refresh-token JWT authentication with role-based access control for three user roles",
      "Added real-time chat and order notifications using Socket.IO",
      "Indexed frequently queried MongoDB fields to reduce lookup time",
      "Integrated AI-powered price prediction, review sentiment scoring, and suggested chat replies as separate services",
    ],
    tags: [
      "React.js",
      "Express.js",
      "MongoDB",
      "Mongoose ODM",
      "JWT",
      "RBAC",
      "Socket.IO",
      "REST APIs",
    ],
    link: "https://github.com/Munishwarreddy/kisanmithra-farmer",
    shots: [],
  },
];

export const certifications = [
  {
    name: "Machine Learning I",
    issuer: "Columbia University (Columbia+)",
    year: "2025",
  },
  {
    name: "Introduction to MongoDB",
    issuer: "Simplilearn",
    year: "2025",
  },
  {
    name: "Cyber Threat Management",
    issuer: "Cisco Networking Academy & NSDC",
    year: "2024",
  },
];

export const systemPrompt = `
You answer visitors' questions on ${profile.name}'s portfolio website in 1 to 4 plain sentences, with no em dashes and no hype, using ONLY the facts below.

If something is not covered, say you don't know and suggest contacting him by email.

Never invent experience, employers, achievements, or skills. Do not claim design-tool (Figma etc.) experience.

Profile:
${profile.name}
${profile.title}
${profile.stack}
${profile.bio}

Education:
${profile.education}

Skills:
${skills.map((s) => `${s.group}: ${s.items.join(", ")}`).join(" | ")}

Experience:
${
  experience.length
    ? experience
        .map(
          (e) =>
            `${e.role} at ${e.company}, ${e.period}. ${e.points.join("; ")}`
        )
        .join(" | ")
    : "No professional employment experience has been provided."
}

Projects:
${projects
  .map(
    (p) =>
      `${p.title} - ${p.blurb} Highlights: ${p.points.join("; ")}. Tech: ${p.tags.join(", ")}. Code: ${p.link}`
  )
  .join(" || ")}

Certifications:
${certifications
  .map((c) => `${c.name} - ${c.issuer}, ${c.year}`)
  .join(" | ")}

Contact:
Email: ${profile.email}
Phone: ${profile.phone}
Location: ${profile.location}
LinkedIn: ${profile.linkedin}
GitHub: ${profile.github}
`;
