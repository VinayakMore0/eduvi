import { atom } from "recoil";

export const routerState = atom({
  key: "routerState",
  default: "home",
});

export const selectedStandardState = atom({
  key: "selectedStandardState",
  default: 1,
});

export const mobileMenuState = atom({
  key: "mobileMenuState",
  default: false,
});

export const authFormState = atom({
  key: "authFormState",
  default: {
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  },
});

export const coursesFilterState = atom({
  key: "coursesFilterState",
  default: {
    category: "all",
    level: "all",
    price: "all",
    search: "",
  },
});

export const standardsDataState = atom({
  key: "standardsDataState",
  default: [
    {
      id: 1,
      title: "Standard One",
      description:
        "Standard 1 is a foundation Standard that reflects 7 important concepts...",
      price: 99,
      rating: 4.8,
      students: 1200,
    },
    {
      id: 2,
      title: "Standard Two",
      description:
        "Standard 2 is a foundation Standard that reflects 7 important concepts...",
      price: 129,
      rating: 4.9,
      students: 980,
    },
    {
      id: 3,
      title: "Standard Three",
      description:
        "Standard 3 is a foundation Standard that reflects 7 important concepts...",
      price: 89,
      rating: 4.7,
      students: 1500,
    },
    {
      id: 4,
      title: "Standard Four",
      description:
        "Standard 4 is a foundation Standard that reflects 7 important concepts...",
      price: 149,
      rating: 4.9,
      students: 750,
    },
    {
      id: 5,
      title: "Standard Five",
      description:
        "Standard 5 is a foundation Standard that reflects 7 important concepts...",
      price: 199,
      rating: 4.8,
      students: 620,
    },
    {
      id: 6,
      title: "Standard Six",
      description:
        "Standard 6 is a foundation Standard that reflects 7 important concepts...",
      price: 179,
      rating: 4.9,
      students: 890,
    },
    {
      id: 7,
      title: "Standard Seven",
      description:
        "Standard 7 is a foundation Standard that reflects 7 important concepts...",
      price: 159,
      rating: 4.8,
      students: 1100,
    },
    {
      id: 8,
      title: "Standard Eight",
      description:
        "Standard 8 is a foundation Standard that reflects 7 important concepts...",
      price: 219,
      rating: 4.9,
      students: 540,
    },
  ],
});

export const creatorsDataState = atom({
  key: "creatorsDataState",
  default: [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      title: "Full Stack Development Expert",
      avatar: "👩‍💻",
      rating: 4.9,
      students: 15420,
      courses: 12,
      experience: "8 years",
      bio: "Passionate educator with extensive experience in web development and software engineering. Former senior developer at top tech companies.",
      skills: ["React", "Node.js", "Python", "AWS"],
      social: { linkedin: "#", twitter: "#", github: "#" },
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      title: "Data Science & AI Specialist",
      avatar: "👨‍🎓",
      rating: 4.8,
      students: 12800,
      courses: 8,
      experience: "10 years",
      bio: "Leading researcher in machine learning and artificial intelligence. Published author and consultant for Fortune 500 companies.",
      skills: ["Python", "TensorFlow", "Machine Learning", "Statistics"],
      social: { linkedin: "#", twitter: "#", github: "#" },
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      title: "UX/UI Design Master",
      avatar: "👩‍🎨",
      rating: 4.9,
      students: 9650,
      courses: 6,
      experience: "6 years",
      bio: "Award-winning designer with a passion for creating intuitive and beautiful user experiences. Design lead at innovative startups.",
      skills: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping"],
      social: { linkedin: "#", twitter: "#", github: "#" },
    },
    {
      id: 4,
      name: "David Kumar",
      title: "DevOps & Cloud Architecture",
      avatar: "👨‍💼",
      rating: 4.8,
      students: 7890,
      courses: 10,
      experience: "12 years",
      bio: "Infrastructure expert specializing in scalable cloud solutions and DevOps practices. Certified AWS and Azure architect.",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      social: { linkedin: "#", twitter: "#", github: "#" },
    },
  ],
});
