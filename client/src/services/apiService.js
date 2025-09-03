const API_BASE_URL = "https://jsonplaceholder.typicode.com"; // Mock API

class ApiService {
  static async get(endpoint) {
    try {
      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 500)); // Loading simulation

      switch (endpoint) {
        case "/courses":
          return {
            data: [
              {
                id: 1,
                title: "Complete Web Development Bootcamp",
                description:
                  "Learn HTML, CSS, JavaScript, React, Node.js and become a full-stack developer",
                instructor: "Dr. Sarah Johnson",
                price: 89.99,
                originalPrice: 199.99,
                rating: 4.8,
                students: 15420,
                duration: "40 hours",
                level: "beginner",
                category: "web-development",
                thumbnail:
                  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
                lessons: 156,
                certificate: true,
                bestseller: true,
                lastUpdated: "2024-01-15",
              },
              {
                id: 2,
                title: "Machine Learning & Data Science Masterclass",
                description:
                  "Master Python, TensorFlow, and build real-world ML projects",
                instructor: "Prof. Michael Chen",
                price: 129.99,
                originalPrice: 249.99,
                rating: 4.9,
                students: 8750,
                duration: "65 hours",
                level: "intermediate",
                category: "data-science",
                thumbnail:
                  "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400",
                lessons: 198,
                certificate: true,
                bestseller: false,
                lastUpdated: "2024-02-10",
              },
              {
                id: 3,
                title: "UX/UI Design Complete Course",
                description:
                  "Learn Figma, Adobe XD, and design thinking principles",
                instructor: "Emily Rodriguez",
                price: 79.99,
                originalPrice: 159.99,
                rating: 4.7,
                students: 12300,
                duration: "30 hours",
                level: "beginner",
                category: "design",
                thumbnail:
                  "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
                lessons: 120,
                certificate: true,
                bestseller: true,
                lastUpdated: "2024-01-28",
              },
              {
                id: 4,
                title: "Advanced React & Redux",
                description:
                  "Build scalable applications with React, Redux, and modern tools",
                instructor: "David Kumar",
                price: 99.99,
                originalPrice: 179.99,
                rating: 4.8,
                students: 9650,
                duration: "45 hours",
                level: "advanced",
                category: "web-development",
                thumbnail:
                  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
                lessons: 178,
                certificate: true,
                bestseller: false,
                lastUpdated: "2024-02-05",
              },
              {
                id: 5,
                title: "Digital Marketing Mastery",
                description:
                  "Complete guide to SEO, social media, and online advertising",
                instructor: "Lisa Thompson",
                price: 69.99,
                originalPrice: 139.99,
                rating: 4.6,
                students: 18200,
                duration: "25 hours",
                level: "beginner",
                category: "marketing",
                thumbnail:
                  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
                lessons: 95,
                certificate: true,
                bestseller: true,
                lastUpdated: "2024-01-20",
              },
              {
                id: 6,
                title: "Mobile App Development with Flutter",
                description:
                  "Build iOS and Android apps with Google's Flutter framework",
                instructor: "James Wilson",
                price: 119.99,
                originalPrice: 199.99,
                rating: 4.7,
                students: 6800,
                duration: "55 hours",
                level: "intermediate",
                category: "mobile-development",
                thumbnail:
                  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400",
                lessons: 145,
                certificate: true,
                bestseller: false,
                lastUpdated: "2024-02-15",
              },
            ],
          };
        case "/instructors":
          return {
            data: [
              {
                id: 1,
                name: "Dr. Sarah Johnson",
                title: "Full Stack Development Expert",
                avatar:
                  "https://images.unsplash.com/photo-1494790108755-2616b612b494?w=150",
                rating: 4.9,
                students: 25420,
                courses: 8,
                experience: "8 years",
                bio: "Passionate educator with extensive experience in web development and software engineering. Former senior developer at top tech companies including Google and Microsoft.",
                skills: ["React", "Node.js", "Python", "AWS", "MongoDB"],
                social: {
                  linkedin: "https://linkedin.com/in/sarahjohnson",
                  twitter: "https://twitter.com/sarahjohnsondev",
                  github: "https://github.com/sarahjohnson",
                },
                totalEarnings: "$180,000",
                joinDate: "2019-03-15",
                verified: true,
              },
              {
                id: 2,
                name: "Prof. Michael Chen",
                title: "Data Science & AI Specialist",
                avatar:
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
                rating: 4.8,
                students: 18800,
                courses: 6,
                experience: "12 years",
                bio: "Leading researcher in machine learning and artificial intelligence. PhD from Stanford, published 50+ papers, consultant for Fortune 500 companies.",
                skills: [
                  "Python",
                  "TensorFlow",
                  "Machine Learning",
                  "Statistics",
                  "R",
                ],
                social: {
                  linkedin: "https://linkedin.com/in/michaelchen",
                  twitter: "https://twitter.com/profmichaelchen",
                  github: "https://github.com/michaelchen",
                },
                totalEarnings: "$220,000",
                joinDate: "2018-08-20",
                verified: true,
              },
              {
                id: 3,
                name: "Emily Rodriguez",
                title: "UX/UI Design Master",
                avatar:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
                rating: 4.9,
                students: 16650,
                courses: 5,
                experience: "7 years",
                bio: "Award-winning designer with a passion for creating intuitive and beautiful user experiences. Design lead at innovative startups and Fortune 500 companies.",
                skills: [
                  "Figma",
                  "Adobe Creative Suite",
                  "User Research",
                  "Prototyping",
                  "Design Systems",
                ],
                social: {
                  linkedin: "https://linkedin.com/in/emilyrodriguez",
                  twitter: "https://twitter.com/emilyuxdesign",
                  github: "https://github.com/emilyrodriguez",
                },
                totalEarnings: "$150,000",
                joinDate: "2020-01-10",
                verified: true,
              },
            ],
          };
        default:
          return { data: [] };
      }
    } catch (error) {
      throw new Error(`API Error: ${error.message}`);
    }
  }

  static async post(endpoint, data) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (endpoint === "/auth/login") {
        if (data.email === "demo@eduvi.com" && data.password === "demo123") {
          return {
            data: {
              user: {
                id: 1,
                name: "Demo User",
                email: "demo@eduvi.com",
                avatar:
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
              },
              token: "mock-jwt-token",
            },
          };
        } else {
          throw new Error("Invalid credentials");
        }
      }

      if (endpoint === "/auth/register") {
        return {
          data: {
            user: {
              id: 2,
              name: data.name,
              email: data.email,
              avatar:
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
            },
            token: "mock-jwt-token",
          },
        };
      }

      return { data: { success: true } };
    } catch (error) {
      throw new Error(`API Error: ${error.message}`);
    }
  }
}

export default ApiService;


// import axios from 'axios';
// import { toast } from 'react-hot-toast';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.eduvi.com';

// // Create axios instance
// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('eduvi_token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('eduvi_token');
//       localStorage.removeItem('eduvi_user');
//       window.location.href = '/login';
//     }

//     const message = error.response?.data?.message || error.message || 'An error occurred';
//     toast.error(message);

//     return Promise.reject(error);
//   }
// );

// // API service class
// class ApiService {
//   // Auth endpoints
//   static async login(credentials) {
//     try {
//       const response = await apiClient.post('/auth/login', credentials);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   }

//   static async register(userData) {
//     try {
//       const response = await apiClient.post('/auth/register', userData);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   }

//   static async refreshToken() {
//     try {
//       const response = await apiClient.post('/auth/refresh');
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   }

//   static async logout() {
//     try {
//       await apiClient.post('/auth/logout');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   }

//   // Courses endpoints
//   static async getCourses(params = {}) {
//     try {
//       const response = await apiClient.get('/courses', { params });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   }

//   static async getCourse(id) {
//     try {
//       const response = await apiClient.get(`/courses/${id}`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   }

//   static async searchCourses(query, filters = {}) {
//     try {
//       const response = await apiClient.get('/courses/search', {
//         params: { q: query, ...filters }
//       });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   }

//   // Instructors endpoints
//   static async getInstructors(params = {}) {
//     try {
//       const response = await apiClient.get('/instructors', { params });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   }

//   static async getInstructor(id) {
//     try {
//       const response = await apiClient.get(`/instructors/${id}`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   }

//   // User endpoints
//   static async getProfile() {
//     try {
//       const response = await apiClient.get('/user/profile');
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   }

//   static async updateProfile(userData) {
//     try {
//       const response = await apiClient.put('/user/profile', userData);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   }

//   static async enrollCourse(courseId) {
//     try {
//       const response = await apiClient.post(`/enrollments`, { courseId });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   }

//   static async getEnrollments() {
//     try {
//       const response = await apiClient.get('/enrollments');
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   }

//   // Reviews endpoints
//   static async getCourseReviews(courseId, params = {}) {
//     try {
//       const response = await apiClient.get(`/courses/${courseId}/reviews`, { params });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   }

//   static async createReview(courseId, reviewData) {
//     try {
//       const response = await apiClient.post(`/courses/${courseId}/reviews`, reviewData);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   }

//   // Payment endpoints
//   static async createPaymentIntent(items) {
//     try {
//       const response = await apiClient.post('/payments/create-intent', { items });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   }

//   static async confirmPayment(paymentIntentId, paymentMethodId) {
//     try {
//       const response = await apiClient.post('/payments/confirm', {
//         paymentIntentId,
//         paymentMethodId
//       });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   }

//   // Wishlist endpoints
//   static async getWishlist() {
//     try {
//       const response = await apiClient.get('/wishlist');
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   }

//   static async addToWishlist(courseId) {
//     try {
//       const response = await apiClient.post('/wishlist', { courseId });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   }

//   static async removeFromWishlist(courseId) {
//     try {
//       const response = await apiClient.delete(`/wishlist/${courseId}`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   }

//   // Contact endpoints
//   static async sendContactMessage(messageData) {
//     try {
//       const response = await apiClient.post('/contact', messageData);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   }

//   // Analytics endpoints
//   static async getCourseStats(courseId) {
//     try {
//       const response = await apiClient.get(`/courses/${courseId}/stats`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   }

//   static async trackProgress(courseId, lessonId, progress) {
//     try {
//       const response = await apiClient.post('/progress', {
//         courseId,
//         lessonId,
//         progress
//       });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error;
//     }
//   }
// }

// export default ApiService;
