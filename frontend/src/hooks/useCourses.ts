import { useState, useEffect, useCallback } from 'react';
import { courseService } from '@/services/api.service';
import type { Course, Testimonial } from '@/types';

// ─── useCourses ────────────────────────────────────────────────────
export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await courseService.getAll();
      setCourses(Array.isArray(data.data?.courses) ? data.data.courses : []);
    } catch {
      setError('Erro ao carregar cursos.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { courses, loading, error, refetch: fetch };
};

// ─── useCourse ────────────────────────────────────────────────────
export const useCourse = (slug: string) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await courseService.getBySlug(slug);
        setCourse(data.data?.course ?? null);
        setTestimonials(Array.isArray(data.data?.testimonials) ? data.data.testimonials : []);
      } catch {
        setError('Curso não encontrado.');
        setCourse(null);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug]);

  return { course, testimonials, loading, error };
};

// ─── useFeaturedTestimonials ───────────────────────────────────────
export const useFeaturedTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseService.getFeaturedTestimonials().then(({ data }) => {
      setTestimonials(Array.isArray(data.data?.testimonials) ? data.data.testimonials : []);
    }).catch(() => {
      setTestimonials([]);
    }).finally(() => setLoading(false));
  }, []);

  return { testimonials, loading };
};
