'use client';

import React, { useState } from 'react';
import { Eye, Calendar, MapPin, Star, Filter, Search, ChevronLeft, ChevronRight, X, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// بيانات المشاريع التجريبية الكاملة
const projects = [
  {
    id: 1,
    title: "فيلا راقية - حي الملقا",
    category: "منازل",
    location: "الرياض - حي الملقا",
    date: "2024-12-15",
    description: "ستائر فاخرة لفيلا عصرية مع تصميم متكامل لجميع الغرف",
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
    description: "ستائر مكتبية أنيقة مع نظام التحكم الإلكتروني",
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
    description: "تصميم عصري مع ألوان هادئة لشقة حديثة",
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
    description: "مشروع ضخم لتجهيز 200 غرفة فندقية بستائر فاخرة",
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
    description: "ستائر طبية مقاومة للبكتيريا مع إضاءة مناسبة",
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
    description: "مشروع ملكي بتصميمات حصرية وأقمشة مستوردة من إيطاليا",
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

// حساب عدد المشاريع لكل فئة بناءً على البيانات المدمجة
const categories = [
  { id: 'all', name: 'جميع المشاريع', count: projects.length },
  { id: 'منازل', name: 'المنازل', count: projects.filter(p => p.category === 'منازل').length },
  { id: 'مكاتب', name: 'المكاتب', count: projects.filter(p => p.category === 'مكاتب').length },
  { id: 'فنادق', name: 'الفنادق', count: projects.filter(p => p.category === 'فنادق').length },
  { id: 'مستشفيات', name: 'المستشفيات', count: projects.filter(p => p.category === 'مستشفيات').length },
  { id: 'قصور', name: 'القصور', count: projects.filter(p => p.category === 'قصور').length }
];

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);

  // تصفية المشاريع
  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openModal = (project: typeof projects[0]) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
    setShowModal(true);
    setShowBeforeAfter(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  const nextImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) =>
        (prev + 1) % selectedProject.images.length
      );
    }
  };

  const prevImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedProject.images.length - 1 : prev - 1
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div dir="rtl" className="min-h-screen">
      {/* Header Navigation */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link href="/" className="logo">
              <div className="logo-icon">ت</div>
              <div>
                <h1 className="text-gradient text-xl font-bold">مؤسسة تعتيم</h1>
                <p className="text-gray-500 text-sm">للستائر والتصميم</p>
              </div>
            </Link>

            <Link href="/" className="btn btn-ghost">
              <Home size={16} />
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-bg py-20">
        <div className="container">
          <div className="text-center text-white">
            <h1 className="title mb-4">
              <span className="text-gradient-secondary">معرض أعمالنا</span>
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              اكتشف مجموعة من أروع مشاريعنا المكتملة واستلهم أفكاراً جديدة لمنزلك أو مكتبك
            </p>
          </div>
        </div>
      </section>

      <div className="container py-12">
        {/* Filters Section */}
        <div className="card mb-12">
          {/* Search Bar */}
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="ابحث عن مشروع معين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pr-12"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>

          {/* Categories */}
          <div className="filter-buttons">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
              >
                <span className="bg-white/20 text-xs px-2 py-1 rounded-full mr-2">
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
            <div className="empty-state-icon">
              <Filter size={64} className="text-gray-400 mx-auto" />
            </div>
            <h3 className="text-xl font-bold mb-4">لا توجد مشاريع</h3>
            <p>لم نجد أي مشاريع تطابق البحث أو التصنيف المحدد</p>
          </div>
        ) : (
          <div className="grid grid-auto gap-8">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className={`card cursor-pointer group animate-fadeInUp animate-delay-${index * 100 + 100}`}
                onClick={() => openModal(project)}
              >
                <div className="relative overflow-hidden rounded-xl mb-6">
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {project.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{project.description}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin size={16} />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar size={16} />
                      <span>{formatDate(project.date)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < Math.floor(project.rating) ? "currentColor" : "none"}
                          className="text-secondary"
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({project.rating})</span>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-xl font-bold text-primary">{project.price}</span>
                    <div className="btn btn-primary btn-sm">
                      <Eye size={16} />
                      عرض التفاصيل
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
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
                className="w-full h-full object-cover"
              />

              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>

              {!showBeforeAfter && selectedProject.images.length > 1 && (
                <>
                  <button
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 transition-colors"
                    onClick={prevImage}
                  >
                    <ChevronRight size={20} />
                  </button>
                  <button
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 transition-colors"
                    onClick={nextImage}
                  >
                    <ChevronLeft size={20} />
                  </button>
                </>
              )}
            </div>

            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">{selectedProject.title}</h2>

              <div className="grid grid-2 gap-6 mb-8">
                <div>
                  <span className="font-semibold text-gray-700">الموقع:</span>
                  <span className="mr-2">{selectedProject.location}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">التاريخ:</span>
                  <span className="mr-2">{formatDate(selectedProject.date)}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">العميل:</span>
                  <span className="mr-2">{selectedProject.clientName}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">التكلفة:</span>
                  <span className="mr-2 text-primary font-bold">{selectedProject.price}</span>
                </div>
              </div>

              <div className="filter-buttons mb-8">
                <button
                  className={`filter-btn ${!showBeforeAfter ? 'active' : ''}`}
                  onClick={() => setShowBeforeAfter(false)}
                >
                  معرض الصور
                </button>
                <button
                  className={`filter-btn ${showBeforeAfter ? 'active' : ''}`}
                  onClick={() => setShowBeforeAfter(true)}
                >
                  قبل وبعد
                </button>
              </div>

              <p className="text-gray-600 leading-relaxed mb-8">
                {selectedProject.description}
              </p>

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">مميزات المشروع</h3>
                <div className="grid grid-2 gap-4">
                  {selectedProject.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <span className="text-success">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {showBeforeAfter && (
                <div className="mb-8">
                  <div className="relative rounded-xl overflow-hidden h-80 mb-4">
                    <img
                      src={currentImageIndex === 0 ? selectedProject.beforeImage : selectedProject.afterImage}
                      alt={currentImageIndex === 0 ? "قبل" : "بعد"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="filter-buttons">
                    <button
                      className={`filter-btn ${currentImageIndex === 0 ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(0)}
                    >
                      قبل التجديد
                    </button>
                    <button
                      className={`filter-btn ${currentImageIndex === 1 ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(1)}
                    >
                      بعد التجديد
                    </button>
                  </div>
                </div>
              )}

              {!showBeforeAfter && (
                <div className="flex justify-center gap-2 mb-8">
                  {selectedProject.images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-primary' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}

              <div className="flex justify-center items-center gap-2">
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={24}
                      fill={i < Math.floor(selectedProject.rating) ? "currentColor" : "none"}
                      className="text-secondary"
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">
                  ({selectedProject.rating}/5)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <section className="section section-bg-primary">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">هل أعجبك ما رأيت؟</h2>
            <p className="text-xl mb-8 opacity-90">
              ابدأ مشروعك الآن واحصل على نفس الجودة والإتقان
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/booking" className="btn btn-secondary btn-lg">
                <Calendar size={20} />
                احجز استشارة مجانية
                <ArrowLeft size={16} />
              </Link>
              <Link href="/calculator" className="btn btn-glass btn-lg">
                <Eye size={20} />
                احسب التكلفة
              </Link>
              <Link href="/" className="btn btn-outline btn-lg">
                <Home size={20} />
                العودة للرئيسية
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}