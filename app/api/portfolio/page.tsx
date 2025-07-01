// app/portfolio/page.tsx
'use client';

// -----------------------------------------------------------------------------
// الواردات (Imports)
// -----------------------------------------------------------------------------
import React, { useState } from 'react';
import { Eye, Calendar, MapPin, Star, Filter, Search, ChevronLeft, ChevronRight, X, Home, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// -----------------------------------------------------------------------------
// بيانات المشاريع التجريبية (Dummy Project Data)
// -----------------------------------------------------------------------------
const projects = [
  {
    id: 1,
    title: "فيلا راقية - حي الملقا",
    category: "منازل",
    location: "الرياض - حي الملقا",
    date: "2024-12-15",
    description: "ستائر فاخرة لفيلا عصرية مع تصميم متكامل لجميع الغرف، تم استخدام أجود الأقمشة المستوردة مع نظام تحكم ذكي متطور",
    images: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600",
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600",
      "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=600"
    ],
    beforeImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
    afterImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600",
    rating: 5,
    clientName: "عائلة الأحمد",
    features: ["ستائر بلاك آوت", "تحكم ذكي", "أقمشة مستوردة", "ضمان 5 سنوات"],
    price: "25,000 ريال"
  },
  {
    id: 2,
    title: "مكتب تنفيذي - برج المملكة",
    category: "مكاتب",
    location: "الرياض - وسط المدينة",
    date: "2024-11-28",
    description: "ستائر مكتبية أنيقة مع نظام التحكم الإلكتروني، مصممة خصيصاً لتوفير بيئة عمل مريحة ومهنية",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600"
    ],
    beforeImage: "https://images.unsplash.com/photo-1497366672420-4d9df2f15b37?w=600",
    afterImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600",
    rating: 4.8,
    clientName: "شركة الرؤية للاستثمار",
    features: ["مقاومة الحريق", "عزل صوتي", "سهولة التنظيف"],
    price: "18,500 ريال"
  },
  {
    id: 3,
    title: "شقة عصرية - كمباوند النرجس",
    category: "منازل",
    location: "الرياض - حي النرجس",
    date: "2024-10-12",
    description: "تصميم عصري مع ألوان هادئة لشقة حديثة، يجمع بين الأناقة والعملية",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600"
    ],
    beforeImage: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600",
    afterImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
    rating: 4.9,
    clientName: "المهندس سعد المطيري",
    features: ["تصميم معاصر", "ألوان متناسقة", "تركيب احترافي"],
    price: "12,800 ريال"
  },
  {
    id: 4,
    title: "فندق الرياض الكبير",
    category: "فنادق",
    location: "الرياض - طريق الملك فهد",
    date: "2024-09-20",
    description: "مشروع ضخم لتجهيز 200 غرفة فندقية بستائر فاخرة مقاومة للحريق ومطابقة للمعايير الدولية",
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600"
    ],
    beforeImage: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600",
    afterImage: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600",
    rating: 5,
    clientName: "فندق الرياض الكبير",
    features: ["مقاومة الحريق", "عازلة للصوت", "سهلة التنظيف", "متانة عالية"],
    price: "180,000 ريال"
  },
  {
    id: 5,
    title: "عيادة طبية متخصصة",
    category: "مستشفيات",
    location: "الرياض - حي الوزارات",
    date: "2024-08-15",
    description: "ستائر طبية مقاومة للبكتيريا مع إضاءة مناسبة، مصممة خصيصاً للبيئة الطبية",
    images: [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600"
    ],
    beforeImage: "https://images.unsplash.com/photo-1519494140681-8b17d830a3e9?w=600",
    afterImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600",
    rating: 4.7,
    clientName: "عيادات الصحة المتقدمة",
    features: ["مضادة للبكتيريا", "سهلة التعقيم", "ألوان هادئة"],
    price: "8,500 ريال"
  },
  {
    id: 6,
    title: "قصر الأمير - حي الدرعية",
    category: "قصور",
    location: "الرياض - الدرعية التاريخية",
    date: "2024-07-30",
    description: "مشروع ملكي بتصميمات حصرية وأقمشة مستوردة من إيطاليا مع تذهيب يدوي فاخر",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600"
    ],
    beforeImage: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600",
    afterImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600",
    rating: 5,
    clientName: "قصر خاص",
    features: ["تصميم حصري", "أقمشة إيطالية", "تذهيب يدوي", "ضمان مدى الحياة"],
    price: "350,000 ريال"
  }
];

// -----------------------------------------------------------------------------
// بيانات الفئات (Category Data)
// -----------------------------------------------------------------------------
const categories = [
  { id: 'all', name: 'جميع المشاريع', count: projects.length },
  { id: 'منازل', name: 'المنازل', count: projects.filter(p => p.category === 'منازل').length },
  { id: 'مكاتب', name: 'المكاتب', count: projects.filter(p => p.category === 'مكاتب').length },
  { id: 'فنادق', name: 'الفنادق', count: projects.filter(p => p.category === 'فنادق').length },
  { id: 'مستشفيات', name: 'المستشفيات', count: projects.filter(p => p.category === 'مستشفيات').length },
  { id: 'قصور', name: 'القصور', count: projects.filter(p => p.category === 'قصور').length }
];

// -----------------------------------------------------------------------------
// المكون الرئيسي (Main Component)
// -----------------------------------------------------------------------------
export default function PortfolioPage() {
  // ---------------------------------------------------------------------------
  // حالات المكون (Component States)
  // ---------------------------------------------------------------------------
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);

  // ---------------------------------------------------------------------------
  // الوظائف المساعدة (Helper Functions)
  // ---------------------------------------------------------------------------
  // تصفية المشاريع بناءً على الفئة وبحث المستخدم
  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // فتح نافذة عرض تفاصيل المشروع
  const openModal = (project: typeof projects[0]) => {
    setSelectedProject(project);
    setCurrentImageIndex(0); // إعادة تعيين مؤشر الصورة عند فتح مشروع جديد
    setShowModal(true);
    setShowBeforeAfter(false); // إظهار معرض الصور افتراضيًا
  };

  // إغلاق نافذة عرض تفاصيل المشروع
  const closeModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  // الانتقال إلى الصورة التالية في معرض الصور
  const nextImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) =>
        (prev + 1) % selectedProject.images.length
      );
    }
  };

  // الانتقال إلى الصورة السابقة في معرض الصور
  const prevImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedProject.images.length - 1 : prev - 1
      );
    }
  };

  // تنسيق التاريخ لعرضه بشكل مقروء
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // ---------------------------------------------------------------------------
  // عرض المكون (Component Render)
  // ---------------------------------------------------------------------------
  return (
    <>
      {/* ------------------------------------------------------------------- */}
      {/* CSS العام باستخدام JSX Global Style */}
      {/* ------------------------------------------------------------------- */}
      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Noto Sans Arabic', sans-serif;
          background: linear-gradient(to bottom right, #fffbeb, #fff7ed);
          min-height: 100vh;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .header {
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          max-width: 1200px;
          margin: 0 auto;
          padding-left: 1rem;
          padding-right: 1rem;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #059669, #0d9488);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1.5rem;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .breadcrumb-link {
          color: #059669;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .breadcrumb-link:hover {
          color: #047857;
        }

        .hero-section {
          background: linear-gradient(135deg, rgba(6, 78, 59, 0.9), rgba(19, 78, 74, 0.9));
          color: white;
          padding: 4rem 0;
          text-align: center;
          margin-bottom: 3rem;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #fb923c, #f87171);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .page-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }

        .stats-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: bold;
          color: #059669;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: #6b7280;
          font-weight: 500;
        }

        .filters-section {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          margin-bottom: 3rem;
        }

        .search-bar {
          position: relative;
          margin-bottom: 2rem;
        }

        .search-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem; /* Adjusted padding for right-to-left icon */
          border: 2px solid #e5e7eb;
          border-radius: 50px;
          font-size: 1rem;
          font-family: 'Noto Sans Arabic', sans-serif;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
        }

        .search-icon {
          position: absolute;
          right: 1rem; /* Adjusted for right-to-left */
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
        }

        .categories {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .category-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          font-family: 'Noto Sans Arabic', sans-serif;
          transition: all 0.3s ease;
          position: relative;
        }

        .category-active {
          background: linear-gradient(135deg, #059669, #0d9488);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(5, 150, 105, 0.3);
        }

        .category-inactive {
          background: #f3f4f6;
          color: #374151;
        }

        .category-inactive:hover {
          background: #e5e7eb;
          transform: translateY(-2px);
        }

        .category-count {
          background: rgba(255,255,255,0.2);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 50px;
          font-size: 0.8rem;
          margin-left: 0.5rem; /* Adjusted for right-to-left */
        }

        .category-count-inactive {
          background: #059669;
          color: white;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .project-card {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .project-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .project-image {
          width: 100%;
          height: 250px;
          object-fit: cover;
          position: relative;
        }

        .project-content {
          padding: 1.5rem;
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .project-title {
          font-size: 1.25rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .project-category {
          background: linear-gradient(135deg, #059669, #0d9488);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .project-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .project-description {
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .project-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .rating-stars {
          display: flex;
          gap: 0.25rem;
        }

        .rating-text {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .project-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .project-price {
          font-size: 1.25rem;
          font-weight: bold;
          color: #059669;
        }

        .view-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #fb923c, #f87171);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .view-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(251, 146, 60, 0.3);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: 1rem;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .modal-header {
          position: relative;
          height: 400px;
          overflow: hidden;
        }

        .modal-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .modal-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0,0,0,0.5);
          color: white;
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .modal-nav:hover {
          background: rgba(0,0,0,0.7);
        }

        .modal-nav-prev {
          right: 1rem;
        }

        .modal-nav-next {
          left: 1rem;
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: rgba(0,0,0,0.5);
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
        }

        .modal-body {
          padding: 2rem;
        }

        .modal-title {
          font-size: 2rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .modal-meta {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: #f9fafb;
          border-radius: 1rem;
        }

        .modal-features {
          margin-bottom: 2rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: #f9fafb;
          border-radius: 0.5rem;
        }

        .feature-check {
          color: #059669;
          font-weight: bold;
        }

        .before-after-toggle {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          justify-content: center;
        }

        .toggle-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          border: 2px solid #059669;
          cursor: pointer;
          font-weight: 600;
          font-family: 'Noto Sans Arabic', sans-serif;
          transition: all 0.3s ease;
        }

        .toggle-active {
          background: #059669;
          color: white;
        }

        .toggle-inactive {
          background: white;
          color: #059669;
        }

        .before-after-container {
          position: relative;
          height: 300px;
          border-radius: 1rem;
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .before-after-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-indicator {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .indicator-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .indicator-active {
          background: #059669;
        }

        .indicator-inactive {
          background: #d1d5db;
        }

        .indicator-inactive:hover {
          background: #9ca3af;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #6b7280;
        }

        .empty-icon {
          margin-bottom: 1rem;
        }

        .back-to-home {
          background: linear-gradient(135deg, #059669, #0d9488);
          color: white;
          padding: 1rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          margin-bottom: 2rem;
        }

        .back-to-home:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(5, 150, 105, 0.3);
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 2rem;
          }

          .projects-grid {
            grid-template-columns: 1fr;
          }

          .categories {
            flex-direction: column;
            align-items: center;
          }

          .modal-meta {
            grid-template-columns: 1fr;
          }

          .before-after-toggle {
            flex-direction: column;
          }

          .stats-section {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      {/* ------------------------------------------------------------------- */}
      {/* هيكل الصفحة (Page Structure) */}
      {/* ------------------------------------------------------------------- */}
      <div dir="rtl">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <div className="logo">
              <div className="logo-icon">ت</div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, background: 'linear-gradient(135deg, #059669, #0d9488)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  مؤسسة تعتيم
                </h1>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>للستائر والتصميم</p>
              </div>
            </div>

            <div className="breadcrumb">
              <Link href="/" className="breadcrumb-link">
                <Home size={16} />
                الرئيسية
              </Link>
              <ArrowRight size={14} />
              <span>معرض الأعمال</span>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <h1 className="page-title">معرض أعمالنا</h1>
            <p className="page-subtitle">
              اكتشف مجموعة من أروع مشاريعنا المكتملة واستلهم أفكاراً جديدة لمنزلك أو مكتبك
            </p>
          </div>
        </section>

        <div className="container">
          {/* Stats Section */}
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-number">99%</div>
              <div className="stat-label">رضا العملاء</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">دعم فني</div>
            </div>
            {/* تم نقل هذا الجزء من الكود إلى هنا من نهاية الكود الأصلي */}
            <div className="stat-card">
              <div className="stat-number">500+</div>
              <div className="stat-label">مشروع مكتمل</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">10+</div>
              <div className="stat-label">سنوات خبرة</div>
            </div>
          </div>

          {/* Back to Home */}
          <Link href="/" className="back-to-home">
            <ArrowRight size={20} />
            العودة للرئيسية
          </Link>

          {/* Filters Section */}
          <div className="filters-section">
            {/* Search Bar */}
            <div className="search-bar">
              <input
                type="text"
                placeholder="ابحث عن مشروع معين..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <Search className="search-icon" size={20} />
            </div>

            {/* Categories */}
            <div className="categories">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`category-btn ${
                    selectedCategory === category.id ? 'category-active' : 'category-inactive'
                  }`}
                >
                  <span className={selectedCategory === category.id ? 'category-count' : 'category-count-inactive'}>
                    {category.count}
                  </span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="empty-state">
              <Filter className="empty-icon" size={64} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>لا توجد مشاريع</h3>
              <p>لم نجد أي مشاريع تطابق البحث أو التصنيف المحدد</p>
            </div>
          ) : (
            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <div key={project.id} className="project-card" onClick={() => openModal(project)}>
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="project-image"
                  />

                  <div className="project-content">
                    <div className="project-header">
                      <div>
                        <h3 className="project-title">{project.title}</h3>
                      </div>
                      <span className="project-category">{project.category}</span>
                    </div>

                    <div className="project-meta">
                      <div className="meta-item">
                        <MapPin size={16} />
                        <span>{project.location}</span>
                      </div>
                      <div className="meta-item">
                        <Calendar size={16} />
                        <span>{formatDate(project.date)}</span>
                      </div>
                    </div>

                    <p className="project-description">{project.description}</p>

                    <div className="project-rating">
                      <div className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={i < Math.floor(project.rating) ? "#fb923c" : "none"}
                            color="#fb923c"
                          />
                        ))}
                      </div>
                      <span className="rating-text">({project.rating})</span>
                    </div>

                    <div className="project-footer">
                      <span className="project-price">{project.price}</span>
                      <button className="view-btn">
                        <Eye size={16} />
                        عرض التفاصيل
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal (نافذة عرض تفاصيل المشروع المنبثقة) */}
        {showModal && selectedProject && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <img
                  src={showBeforeAfter
                    ? (currentImageIndex === 0 ? selectedProject.beforeImage : selectedProject.afterImage)
                    : selectedProject.images[currentImageIndex]
                  }
                  alt={selectedProject.title}
                  className="modal-image"
                />

                <button className="modal-close" onClick={closeModal}>
                  <X size={20} />
                </button>

                {!showBeforeAfter && selectedProject.images.length > 1 && (
                  <>
                    <button className="modal-nav modal-nav-prev" onClick={prevImage}>
                      <ChevronRight size={20} />
                    </button>
                    <button className="modal-nav modal-nav-next" onClick={nextImage}>
                      <ChevronLeft size={20} />
                    </button>
                  </>
                )}
              </div>

              <div className="modal-body">
                <h2 className="modal-title">{selectedProject.title}</h2>

                <div className="modal-meta">
                  <div className="meta-item">
                    <strong>الموقع:</strong> {selectedProject.location}
                  </div>
                  <div className="meta-item">
                    <strong>التاريخ:</strong> {formatDate(selectedProject.date)}
                  </div>
                  <div className="meta-item">
                    <strong>العميل:</strong> {selectedProject.clientName}
                  </div>
                  <div className="meta-item">
                    <strong>التكلفة:</strong> {selectedProject.price}
                  </div>
                </div>

                <div className="before-after-toggle">
                  <button
                    className={`toggle-btn ${!showBeforeAfter ? 'toggle-active' : 'toggle-inactive'}`}
                    onClick={() => setShowBeforeAfter(false)}
                  >
                    معرض الصور
                  </button>
                  <button
                    className={`toggle-btn ${showBeforeAfter ? 'toggle-active' : 'toggle-inactive'}`}
                    onClick={() => setShowBeforeAfter(true)}
                  >
                    قبل وبعد
                  </button>
                </div>

                <p style={{ color: '#6b7280', lineHeight: 1.6, marginBottom: '2rem' }}>
                  {selectedProject.description}
                </p>

                <div className="modal-features">
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    مميزات المشروع
                  </h3>
                  <div className="features-grid">
                    {selectedProject.features.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <span className="feature-check">✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {showBeforeAfter && (
                  <div className="before-after-container">
                    <img
                      src={currentImageIndex === 0 ? selectedProject.beforeImage : selectedProject.afterImage}
                      alt={currentImageIndex === 0 ? "قبل" : "بعد"}
                      className="before-after-image"
                    />
                  </div>
                )}

                {showBeforeAfter && (
                  <div className="before-after-toggle">
                    <button
                      className={`toggle-btn ${currentImageIndex === 0 ? 'toggle-active' : 'toggle-inactive'}`}
                      onClick={() => setCurrentImageIndex(0)}
                    >
                      قبل التجديد
                    </button>
                    <button
                      className={`toggle-btn ${currentImageIndex === 1 ? 'toggle-active' : 'toggle-inactive'}`}
                      onClick={() => setCurrentImageIndex(1)}
                    >
                      بعد التجديد
                    </button>
                  </div>
                )}

                {!showBeforeAfter && (
                  <div className="image-indicator">
                    {selectedProject.images.map((_, index) => (
                      <button
                        key={index}
                        className={`indicator-dot ${
                          index === currentImageIndex ? 'indicator-active' : 'indicator-inactive'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}

                <div className="project-rating" style={{ justifyContent: 'center', marginTop: '2rem' }}>
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={24}
                        fill={i < Math.floor(selectedProject.rating) ? "#fb923c" : "none"}
                        color="#fb923c"
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '1.1rem', fontWeight: '600', marginRight: '0.5rem' }}>
                    ({selectedProject.rating}/5)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}