import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fluxa_access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  async (error) => {
    const orig = error.config;
    if (error.response?.status === 401 && !orig._retry) {
      orig._retry = true;
      try {
        const rt = localStorage.getItem('fluxa_refresh_token');
        if (rt) {
          const { data } = await axios.post('/api/auth/refresh', { refreshToken: rt });
          localStorage.setItem('fluxa_access_token', data.data.accessToken);
          localStorage.setItem('fluxa_refresh_token', data.data.refreshToken);
          orig.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(orig);
        }
      } catch {
        localStorage.removeItem('fluxa_access_token');
        localStorage.removeItem('fluxa_refresh_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login:    (d: any) => api.post('/auth/login', d),
  register: (d: any) => api.post('/auth/register', d),
  me:       ()       => api.get('/auth/me'),
  refresh:  (rt: string) => api.post('/auth/refresh', { refreshToken: rt }),
};

export const courseService = {
  getAll:              () => api.get('/courses'),
  getFeatured:         () => api.get('/courses/featured'),
  getBySlug:    (s: string) => api.get(`/courses/${s}`),
  getFeaturedTestimonials: () => api.get('/courses/testimonials/featured'),
  enroll:       (s: string) => api.post(`/courses/${s}/enroll`),
};

export const learnService = {
  getExercises: (slug: string) => api.get(`/learn/${slug}/exercises`),
  submitAnswer: (slug: string, exerciseId: string, answer: string|number) =>
    api.post(`/learn/${slug}/exercises/${exerciseId}/answer`, { answer }),
  getProgress:  (slug: string) => api.get(`/learn/${slug}/progress`),
};

export const contactService = {
  send: (d: any) => api.post('/contact', d),
};

export default api;
