import { Certificate, Course, Internship, UserRole } from "./types";

// Sample video URLs (Open source samples for demo purposes)
const SAMPLE_VIDEO_1 = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
const SAMPLE_VIDEO_2 = "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
const SAMPLE_VIDEO_3 = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

export const MOCK_COURSES: Course[] = [
  // --- Quiz Zone Courses ---
  {
    id: 'quiz_1',
    title: 'General Knowledge Master',
    description: 'Test your knowledge about the world, history, and current events in this ultimate quiz challenge.',
    lessonsCount: 3,
    duration: '15m',
    category: 'Quiz',
    progress: 0,
    imageColor: 'bg-indigo-500',
    lessons: [
      {
        id: 'gk_1',
        title: 'Level 1: Geography',
        duration: '5:00',
        videoUrl: '', // No video for quizzes
        isLocked: false,
        quiz: [
           { id: 'q1', question: 'Which is the largest continent by land area?', options: ['Africa', 'Asia', 'North America', 'Europe'], correctAnswer: 1 },
           { id: 'q2', question: 'What is the capital city of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], correctAnswer: 2 },
           { id: 'q3', question: 'Which river is the longest in the world?', options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], correctAnswer: 1 },
           { id: 'q4', question: 'Which country is known as the Land of the Rising Sun?', options: ['China', 'South Korea', 'Japan', 'Thailand'], correctAnswer: 2 }
        ]
      },
      {
        id: 'gk_2',
        title: 'Level 2: History',
        duration: '5:00',
        videoUrl: '',
        isLocked: true,
        quiz: [
           { id: 'q1', question: 'Who was the first President of the United States?', options: ['Thomas Jefferson', 'Abraham Lincoln', 'George Washington', 'John Adams'], correctAnswer: 2 },
           { id: 'q2', question: 'In which year did World War II end?', options: ['1942', '1945', '1950', '1939'], correctAnswer: 1 },
           { id: 'q3', question: 'Who discovered America in 1492?', options: ['Christopher Columbus', 'Vasco da Gama', 'Ferdinand Magellan', 'Marco Polo'], correctAnswer: 0 }
        ]
      },
      {
        id: 'gk_3',
        title: 'Level 3: Sports & Culture',
        duration: '5:00',
        videoUrl: '',
        isLocked: true,
        quiz: [
           { id: 'q1', question: 'Which country won the 2022 FIFA World Cup?', options: ['France', 'Brazil', 'Argentina', 'Germany'], correctAnswer: 2 },
           { id: 'q2', question: 'Who wrote "Romeo and Juliet"?', options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'], correctAnswer: 1 }
        ]
      }
    ]
  },
  {
    id: 'quiz_2',
    title: 'Science & Logic Whiz',
    description: 'Sharpen your mind with these science trivia and logic puzzles.',
    lessonsCount: 2,
    duration: '10m',
    category: 'Quiz',
    progress: 0,
    imageColor: 'bg-emerald-600',
    lessons: [
      {
        id: 'sci_1',
        title: 'Level 1: Basic Science',
        duration: '5:00',
        videoUrl: '',
        isLocked: false,
        quiz: [
           { id: 'q1', question: 'What is the chemical symbol for Gold?', options: ['Ag', 'Au', 'Fe', 'Pb'], correctAnswer: 1 },
           { id: 'q2', question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correctAnswer: 1 },
           { id: 'q3', question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Cytoplasm'], correctAnswer: 1 }
        ]
      },
      {
        id: 'sci_2',
        title: 'Level 2: Logic & Math',
        duration: '5:00',
        videoUrl: '',
        isLocked: true,
        quiz: [
           { id: 'q1', question: 'What is the square root of 144?', options: ['10', '11', '12', '14'], correctAnswer: 2 },
           { id: 'q2', question: 'If you have a 3 gallon jug and a 5 gallon jug, how can you measure exactly 4 gallons?', options: ['Fill 3, pour into 5', 'Fill 5, pour into 3, empty 3, pour remaining 2 into 3, fill 5, pour into 3', 'Impossible', 'Guess'], correctAnswer: 1 }
        ]
      }
    ]
  },

  // --- Academic Excellence (K-12) ---
  {
    id: 'k12_1',
    title: 'Mathematics - Class 10 (Real Numbers & Algebra)',
    description: 'Master the fundamentals of Real Numbers, Polynomials, and Quadratic Equations with visual problem-solving techniques.',
    lessonsCount: 45,
    duration: '32h',
    category: 'Academic',
    progress: 0,
    imageColor: 'bg-blue-500',
    lessons: [
      { 
        id: 'l1', 
        title: 'Introduction to Real Numbers', 
        duration: '10:05', 
        videoUrl: SAMPLE_VIDEO_1, 
        isLocked: false,
        quiz: [
          {
            id: 'q1',
            question: 'Which of the following is NOT a real number?',
            options: ['0', '-5', 'Square root of -1', 'Pi'],
            correctAnswer: 2
          },
          {
            id: 'q2',
            question: 'Euclid’s Division Lemma states that for any two positive integers a and b, there exist unique integers q and r such that:',
            options: ['a = bq + r, 0 ≤ r < b', 'a = bq - r, 0 ≤ r < b', 'a = bq + r, 0 < r < b', 'a = bq + r, r > b'],
            correctAnswer: 0
          }
        ]
      },
      { id: 'l2', title: 'Euclid’s Division Lemma', duration: '15:30', videoUrl: SAMPLE_VIDEO_2, isLocked: false },
      { id: 'l3', title: 'Fundamental Theorem of Arithmetic', duration: '12:45', videoUrl: SAMPLE_VIDEO_3, isLocked: false },
      { id: 'l4', title: 'Revisiting Irrational Numbers', duration: '18:20', videoUrl: SAMPLE_VIDEO_1, isLocked: true },
    ]
  },
  {
    id: 'k12_2',
    title: 'Physics - Class 12 (Electrostatics & Optics)',
    lessonsCount: 60,
    duration: '45h',
    category: 'Academic',
    progress: 0,
    imageColor: 'bg-cyan-600',
    lessons: [
      { id: 'p1', title: 'Electric Charges and Fields', duration: '14:20', videoUrl: SAMPLE_VIDEO_2, isLocked: false },
      { id: 'p2', title: 'Electrostatic Potential', duration: '20:10', videoUrl: SAMPLE_VIDEO_3, isLocked: false },
      { id: 'p3', title: 'Capacitance and Dielectrics', duration: '16:05', videoUrl: SAMPLE_VIDEO_1, isLocked: true },
      { id: 'p4', title: 'Magnetism and Matter', duration: '18:30', videoUrl: SAMPLE_VIDEO_2, isLocked: true },
      { id: 'p5', title: 'Electromagnetic Induction', duration: '22:15', videoUrl: SAMPLE_VIDEO_3, isLocked: true },
      { id: 'p6', title: 'Ray Optics and Optical Instruments', duration: '25:00', videoUrl: SAMPLE_VIDEO_1, isLocked: true },
    ]
  },
  {
    id: 'k12_3',
    title: 'Chemistry - Class 11 (Organic Fundamentals)',
    lessonsCount: 50,
    duration: '38h',
    category: 'Academic',
    progress: 0,
    imageColor: 'bg-teal-500',
    lessons: [
      { id: 'c1', title: 'Introduction to Organic Chemistry', duration: '12:30', videoUrl: SAMPLE_VIDEO_2, isLocked: false },
      { id: 'c2', title: 'IUPAC Nomenclature', duration: '18:45', videoUrl: SAMPLE_VIDEO_3, isLocked: false },
      { id: 'c3', title: 'Isomerism: Structural & Stereo', duration: '15:20', videoUrl: SAMPLE_VIDEO_1, isLocked: false },
      { id: 'c4', title: 'Reaction Mechanisms Basics', duration: '20:10', videoUrl: SAMPLE_VIDEO_2, isLocked: true },
    ]
  },
  {
    id: 'k12_4',
    title: 'Biology - Class 12 (Genetics & Evolution)',
    lessonsCount: 55,
    duration: '40h',
    category: 'Academic',
    progress: 0,
    imageColor: 'bg-emerald-500'
  },

  // --- Higher Education (Degree/Diploma) ---
  {
    id: 'high_1',
    title: 'Engineering Mathematics I (Matrices & Calculus)',
    lessonsCount: 80,
    duration: '60h',
    category: 'Higher Ed',
    progress: 0,
    imageColor: 'bg-indigo-600',
    lessons: [
       { id: 'h1', title: 'Matrices: Rank & System of Equations', duration: '25:00', videoUrl: SAMPLE_VIDEO_3, isLocked: false },
       { id: 'h2', title: 'Eigenvalues and Eigenvectors', duration: '30:15', videoUrl: SAMPLE_VIDEO_1, isLocked: true },
    ]
  },
  {
    id: 'high_2',
    title: 'Data Structures & Algorithms (B.Tech CS)',
    lessonsCount: 120,
    duration: '90h',
    category: 'Higher Ed',
    progress: 0,
    imageColor: 'bg-violet-600'
  },
  {
    id: 'high_3',
    title: 'Human Anatomy - Year 1 (MBBS)',
    lessonsCount: 150,
    duration: '110h',
    category: 'Higher Ed',
    progress: 0,
    imageColor: 'bg-rose-600'
  },
  {
    id: 'high_4',
    title: 'Financial Accounting (B.Com/MBA)',
    lessonsCount: 70,
    duration: '50h',
    category: 'Higher Ed',
    progress: 0,
    imageColor: 'bg-blue-700'
  },

  // --- Emerging Technologies (Certified Skills) ---
  {
    id: 'tech_1',
    title: 'Generative AI & LLM Engineering',
    description: 'Learn how to build Large Language Model applications using modern frameworks and prompt engineering.',
    lessonsCount: 40,
    duration: '35h',
    category: 'Skills',
    progress: 0,
    imageColor: 'bg-fuchsia-600',
    lessons: [
      { id: 't1', title: 'Introduction to GenAI', duration: '08:45', videoUrl: SAMPLE_VIDEO_1, isLocked: false },
      { id: 't2', title: 'Prompt Engineering Basics', duration: '12:30', videoUrl: SAMPLE_VIDEO_2, isLocked: false },
      { id: 't3', title: 'Fine-tuning LLMs', duration: '22:15', videoUrl: SAMPLE_VIDEO_3, isLocked: true },
    ]
  },
  {
    id: 'tech_2',
    title: 'Electric Vehicle (EV) Battery Systems',
    lessonsCount: 35,
    duration: '28h',
    category: 'Skills',
    progress: 0,
    imageColor: 'bg-green-600'
  },
  {
    id: 'tech_3',
    title: 'Full Stack Web Dev (MERN Stack)',
    lessonsCount: 90,
    duration: '75h',
    category: 'Skills',
    progress: 0,
    imageColor: 'bg-cyan-500'
  },
  {
    id: 'tech_4',
    title: 'Cloud Solutions Architect (AWS)',
    lessonsCount: 50,
    duration: '40h',
    category: 'Skills',
    progress: 0,
    imageColor: 'bg-orange-500'
  },

  // --- Business School ---
  {
    id: 'bus_1',
    title: 'Digital Marketing & SEO Strategy',
    lessonsCount: 45,
    duration: '30h',
    category: 'Business',
    progress: 0,
    imageColor: 'bg-purple-500'
  },
  {
    id: 'bus_2',
    title: 'Startup Zero to One: Entrepreneurship',
    lessonsCount: 25,
    duration: '20h',
    category: 'Business',
    progress: 0,
    imageColor: 'bg-pink-600'
  },
  {
    id: 'bus_3',
    title: 'Corporate Finance & Valuation',
    lessonsCount: 30,
    duration: '25h',
    category: 'Business',
    progress: 0,
    imageColor: 'bg-slate-700'
  },

  // --- Advanced Masterclass (Premium) ---
  {
    id: 'adv_1',
    title: 'Advanced Quantum Computing',
    lessonsCount: 60,
    duration: '50h',
    category: 'Advanced',
    progress: 0,
    imageColor: 'bg-slate-900',
    description: 'Deep dive into Qubits, Quantum Gates, and Shor\'s Algorithm.',
    lessons: [
      { id: 'q1', title: 'Introduction to Qubits', duration: '25:00', videoUrl: SAMPLE_VIDEO_3, isLocked: false }, // Free Preview
      { id: 'q2', title: 'Superposition & Entanglement', duration: '35:10', videoUrl: SAMPLE_VIDEO_1, isLocked: true }, // Locked
      { id: 'q3', title: 'Shor\'s Algorithm Explained', duration: '40:20', videoUrl: SAMPLE_VIDEO_2, isLocked: true }, // Locked
      { id: 'q4', title: 'Quantum Error Correction (Premium)', duration: '45:30', videoUrl: SAMPLE_VIDEO_3, isLocked: true } // New Locked Lesson
    ]
  },
  {
    id: 'adv_2',
    title: 'Strategic Global Management',
    lessonsCount: 40,
    duration: '35h',
    category: 'Advanced',
    progress: 0,
    imageColor: 'bg-amber-600',
    description: 'Executive leadership strategies for multinational corporations.',
    lessons: [
      { id: 's1', title: 'Global Market Entry Strategies', duration: '28:15', videoUrl: SAMPLE_VIDEO_2, isLocked: false },
      { id: 's2', title: 'Cross-Cultural Leadership', duration: '32:00', videoUrl: SAMPLE_VIDEO_3, isLocked: true }
    ]
  },
  {
    id: 'adv_3',
    title: 'AI System Architecture',
    lessonsCount: 55,
    duration: '45h',
    category: 'Advanced',
    progress: 0,
    imageColor: 'bg-indigo-900',
    description: 'Designing scalable AI infrastructure for enterprise applications.',
    lessons: [
      { id: 'a1', title: 'Distributed Training Patterns', duration: '45:00', videoUrl: SAMPLE_VIDEO_1, isLocked: false },
      { id: 'a2', title: 'Inference Optimization', duration: '38:30', videoUrl: SAMPLE_VIDEO_2, isLocked: true }
    ]
  },
  {
    id: 'adv_4',
    title: 'Esports Mastery: BGMI',
    lessonsCount: 12,
    duration: '10h',
    category: 'Advanced',
    progress: 0,
    imageColor: 'bg-orange-700',
    description: 'Professional strategies for Battlegrounds Mobile India, including map rotation and recoil control.',
    lessons: [
      { id: 'b1', title: 'Introduction to Competitive BGMI', duration: '10:00', videoUrl: SAMPLE_VIDEO_1, isLocked: false },
      { id: 'b2', title: 'Advanced Zone Rotations', duration: '15:30', videoUrl: SAMPLE_VIDEO_2, isLocked: true },
      { id: 'b3', title: 'Squad Synergy & Comms', duration: '12:45', videoUrl: SAMPLE_VIDEO_3, isLocked: true }
    ]
  }
];

export const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: 'cert1',
    title: 'Python for Data Science',
    issueDate: 'Jan 15, 2025',
    downloadUrl: '#'
  },
  {
    id: 'cert2',
    title: 'Digital Marketing Fundamentals',
    issueDate: 'Dec 20, 2024',
    downloadUrl: '#'
  },
  {
    id: 'cert3',
    title: 'Introduction to Cloud Computing',
    issueDate: 'Nov 05, 2024',
    downloadUrl: '#'
  }
];

export const MOCK_INTERNSHIPS: Internship[] = [
  {
    id: 'int1',
    title: 'React Native Developer',
    company: 'AppInnovate Labs',
    mentor: 'Sarah Chen (Senior Dev)',
    status: 'Active',
    week: 3,
    totalWeeks: 8,
    description: 'Build cross-platform mobile applications for fintech startups.',
    location: 'Bangalore',
    type: 'Remote',
    stipend: '₹15,000/mo',
    tags: ['React Native', 'Mobile', 'Frontend'],
    linkedinUrl: 'https://www.linkedin.com/jobs/search/?keywords=React+Native+Developer'
  },
  {
    id: 'int2',
    title: 'AI/ML Research Intern',
    company: 'Neural Nexus',
    mentor: 'Dr. A. Patel',
    status: 'Available',
    totalWeeks: 12,
    spotsLeft: 3,
    description: 'Work on cutting-edge NLP models and fine-tune LLMs for healthcare data.',
    location: 'Mumbai',
    type: 'Hybrid',
    stipend: '₹25,000/mo',
    tags: ['Python', 'PyTorch', 'LLMs'],
    linkedinUrl: 'https://www.linkedin.com/jobs/search/?keywords=AI+ML+Intern'
  },
  {
    id: 'int3',
    title: 'EV Battery Systems Engineer',
    company: 'Future Motors',
    mentor: 'Mike Ross',
    status: 'Available',
    totalWeeks: 10,
    spotsLeft: 7,
    description: 'Design and simulate thermal management systems for EV battery packs.',
    location: 'Pune',
    type: 'On-site',
    stipend: '₹20,000/mo',
    tags: ['EV', 'Thermal Engineering', 'Simulink'],
    linkedinUrl: 'https://www.linkedin.com/jobs/search/?keywords=EV+Battery+Engineer'
  },
  {
    id: 'int4',
    title: 'Social Media Strategist',
    company: 'GrowthHack Agency',
    mentor: 'Jessica Pearson',
    status: 'Available',
    totalWeeks: 6,
    spotsLeft: 12,
    description: 'Create viral content strategies and manage campaigns for D2C brands.',
    location: 'Remote',
    type: 'Remote',
    stipend: 'Performance Based',
    tags: ['Marketing', 'Content', 'Social Media'],
    linkedinUrl: 'https://www.linkedin.com/jobs/search/?keywords=Social+Media+Strategist'
  },
  {
    id: 'int5',
    title: 'Financial Analyst Intern',
    company: 'Global FinCorp',
    mentor: 'Harvey Specter',
    status: 'Available',
    totalWeeks: 8,
    spotsLeft: 5,
    description: 'Analyze market trends and assist in portfolio management for HNI clients.',
    location: 'Gurgaon',
    type: 'Hybrid',
    stipend: '₹18,000/mo',
    tags: ['Finance', 'Excel', 'Valuation'],
    linkedinUrl: 'https://www.linkedin.com/jobs/search/?keywords=Financial+Analyst+Intern'
  },
   {
    id: 'int6',
    title: 'Full Stack Web Developer',
    company: 'TechFlow Systems',
    mentor: 'David Miller',
    status: 'Available',
    totalWeeks: 12,
    spotsLeft: 4,
    description: 'Develop scalable web applications using the MERN stack.',
    location: 'Remote',
    type: 'Remote',
    stipend: '₹12,000/mo',
    tags: ['MERN', 'Web', 'Backend'],
    linkedinUrl: 'https://www.linkedin.com/jobs/search/?keywords=Full+Stack+Web+Developer'
  }
];

export const PERSONA_OPTIONS = [
  {
    id: UserRole.Student,
    title: 'School Student',
    subtitle: '1st to 12th Standard',
    icon: 'book',
    gradient: 'from-cyan-400 to-blue-500'
  },
  {
    id: UserRole.College,
    title: 'College Student',
    subtitle: 'Degree & Diploma',
    icon: 'graduation-cap',
    gradient: 'from-fuchsia-400 to-purple-600'
  },
  {
    id: UserRole.Professional,
    title: 'Professional',
    subtitle: 'Upskilling & Career',
    icon: 'briefcase',
    gradient: 'from-orange-400 to-red-500'
  }
];