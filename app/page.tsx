'use client';

import React, { useState } from 'react';
import { Phone, MapPin, Mail, Star, Menu, X, Eye, Scissors, Palette, ChevronDown, CheckCircle, CircleAlert, Loader2, Image, ArrowLeft, Calculator, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

// نموذج التواصل كـ component منفصل
function ContactFormComponent() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState<{name?: string, phone?: string, message?: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = 'الاسم مطلوب';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'الاسم يجب أن يكون حرفين على الأقل';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else {
      const phoneRegex = /^(\+966|0)?[5][0-9]{8}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'رقم الهاتف غير صحيح (مثال: 0501234567)';
      }
    }

    if (!formData.message.trim()) {
      newErrors.message = 'الرسالة مطلوبة';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'الرسالة قصيرة جداً (10 أحرف على الأقل)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setSubmitMessage(result.message);
        setFormData({ name: '', phone: '', message: '' });

        setTimeout(() => {
          setSubmitStatus('idle');
        }, 5000);
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.message || 'حدث خطأ غير متوقع');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold mb-8 text-white">احجز استشارتك المجانية</h3>

      {submitStatus === 'success' && (
        <div className="alert alert-success mb-6">
          <CheckCircle size={20} />
          <span>{submitMessage}</span>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="alert alert-error mb-6">
          <CircleAlert size={20} />
          <span>{submitMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="الاسم الكامل"
            className={`form-input ${errors.name ? 'border-red-400' : ''}`}
          />
          {errors.name && (
            <p className="text-red-300 text-sm mt-2">{errors.name}</p>
          )}
        </div>

        <div className="form-group">
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="رقم الهاتف (مثال: 0501234567)"
            className={`form-input ${errors.phone ? 'border-red-400' : ''}`}
          />
          {errors.phone && (
            <p className="text-red-300 text-sm mt-2">{errors.phone}</p>
          )}
        </div>

        <div className="form-group">
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="اخبرنا عن مشروعك بالتفصيل..."
            className={`form-textarea ${errors.message ? 'border-red-400' : ''}`}
          ></textarea>
          <p className="text-white/70 text-sm mt-2 text-left">
            {formData.message.length}/1000
          </p>
          {errors.message && (
            <p className="text-red-300 text-sm mt-2">{errors.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`btn w-full ${
            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'btn-secondary'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              جاري الإرسال...
            </>
          ) : (
            'إرسال الطلب'
          )}
        </button>
      </form>
    </div>
  );
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const services = [
    {
      icon: <Eye size={32} />,
      title: "التصميم والاستشارة",
      description: "تصميم مخصص يناسب ديكور منزلك مع استشارة مجانية من خبرائنا"
    },
    {
      icon: <Scissors size={32} />,
      title: "الخياطة والتفصيل",
      description: "خياطة عالية الجودة بأحدث المعدات وأفضل الخامات المتاحة"
    },
    {
      icon: <Palette size={32} />,
      title: "التركيب الاحترافي",
      description: "تركيب دقيق ومحترف على يد فنيين متخصصين ومدربين"
    }
  ];

  const products = [
    "ستائر كلاسيكية",
    "ستائر عصرية",
    "ستائر رومانية",
    "ستائر بلاك آوت",
    "ستائر مكتبية",
    "ستائر فنادق"
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen" dir="rtl">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <div className="logo-icon animate-pulse">ت</div>
              <div>
                <h1 className="text-gradient text-xl font-bold">
                  مؤسسة تعتيم
                </h1>
                <p className="text-gray-500 text-sm">للستائر والتصميم</p>
              </div>
            </div>

            <nav className="nav">
              <button onClick={() => scrollToSection('home')} className="nav-link">الرئيسية</button>
              <button onClick={() => scrollToSection('services')} className="nav-link">خدماتنا</button>
              <button onClick={() => scrollToSection('products')} className="nav-link">منتجاتنا</button>
              <Link href="/portfolio" className="nav-link flex items-center gap-2">
                <Image size={16} />
                معرض الأعمال
              </Link>
              <Link href="/calculator" className="nav-link flex items-center gap-2">
                <Calculator size={16} />
                حاسبة التكلفة
              </Link>
              <Link href="/booking" className="nav-link flex items-center gap-2">
                <Calendar size={16} />
                حجز موعد
              </Link>
              <button onClick={() => scrollToSection('about')} className="nav-link">من نحن</button>
              <button onClick={() => scrollToSection('contact')} className="nav-link">تواصل معنا</button>
            </nav>

            <button
              className="lg:hidden p-2 text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {isMenuOpen && (
            <nav className="lg:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col gap-4">
                <button onClick={() => scrollToSection('home')} className="nav-link text-right">الرئيسية</button>
                <button onClick={() => scrollToSection('services')} className="nav-link text-right">خدماتنا</button>
                <button onClick={() => scrollToSection('products')} className="nav-link text-right">منتجاتنا</button>
                <Link href="/portfolio" className="nav-link flex items-center gap-2 justify-end">
                  <span>معرض الأعمال</span>
                  <Image size={16} />
                </Link>
                <Link href="/calculator" className="nav-link flex items-center gap-2 justify-end">
                  <span>حاسبة التكلفة</span>
                  <Calculator size={16} />
                </Link>
                <Link href="/booking" className="nav-link flex items-center gap-2 justify-end">
                  <span>حجز موعد</span>
                  <Calendar size={16} />
                </Link>
                <button onClick={() => scrollToSection('about')} className="nav-link text-right">من نحن</button>
                <button onClick={() => scrollToSection('contact')} className="nav-link text-right">تواصل معنا</button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero-bg">
        <div className="hero-content">
          <div className="animate-fadeInUp">
            <h1 className="title mb-4">
              <span className="text-gradient-secondary">تعتيم</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
              نحول أحلامك إلى واقع جميل مع أجود أنواع الستائر والتصميمات العصرية في الرياض
            </p>
            <div className="flex flex-wrap gap-4 justify-center animate-delay-300 animate-fadeInUp">
              <Link href="/booking" className="btn btn-secondary btn-lg">
                <Calendar size={20} />
                احجز استشارة مجانية
              </Link>
              <Link href="/calculator" className="btn btn-glass btn-lg">
                <Calculator size={20} />
                احسب التكلفة
              </Link>
              <Link href="/portfolio" className="btn btn-outline btn-lg">
                <Image size={20} />
                شاهد أعمالنا
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
          <ChevronDown size={32} className="text-white" />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section section-bg-gray">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="section-title text-gradient mb-4">خدماتنا المتميزة</h2>
            <p className="section-subtitle">
              نقدم مجموعة شاملة من الخدمات المتخصصة في مجال الستائر والديكور
            </p>
          </div>

          <div className="grid grid-auto">
            {services.map((service, index) => (
              <div key={index} className={`card animate-fadeInUp animate-delay-${index * 100 + 100}`}>
                <div className="service-icon">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Booking CTA Section */}
      <section className="section section-bg-primary">
        <div className="container">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              احجز استشارتك المجانية اليوم
            </h2>
            <p className="text-xl mb-12 opacity-90">
              خبراء التصميم في خدمتك لتحويل أحلامك إلى واقع جميل
            </p>

            <div className="grid grid-auto-sm mb-12">
              <div className="card-glass p-8 text-center">
                <Calendar size={48} className="mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">حجز سهل وسريع</h3>
                <p className="opacity-90">احجز موعدك في 3 خطوات بسيطة</p>
              </div>

              <div className="card-glass p-8 text-center">
                <Clock size={48} className="mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">مواعيد مرنة</h3>
                <p className="opacity-90">نتوفر 6 أيام في الأسبوع من 9 صباحاً لـ 7 مساءً</p>
              </div>

              <div className="card-glass p-8 text-center">
                <CheckCircle size={48} className="mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">تأكيد فوري</h3>
                <p className="opacity-90">احصل على تأكيد الحجز مباشرة عبر الهاتف</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/booking" className="btn btn-secondary btn-xl">
                <Calendar size={24} />
                احجز موعدك الآن
                <ArrowLeft size={20} />
              </Link>

              <Link href="/calculator" className="btn btn-glass btn-xl">
                <Calculator size={20} />
                احسب التكلفة أولاً
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="section section-bg-gray">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="section-title text-gradient mb-4">منتجاتنا المتنوعة</h2>
            <p className="section-subtitle">
              اكتشف مجموعتنا الواسعة من الستائر العصرية والكلاسيكية
            </p>

            <div className="mt-8">
              <Link href="/portfolio" className="btn btn-primary btn-lg">
                <Image size={20} />
                شاهد معرض أعمالنا المكتملة
                <ArrowLeft size={16} />
              </Link>
            </div>
          </div>

          <div className="grid grid-auto">
            {products.map((product, index) => (
              <div
                key={index}
                className={`product-card animate-fadeInUp animate-delay-${index * 100 + 100}`}
              >
                <span className="text-white font-semibold">{product}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator CTA Section */}
      <section className="section section-bg-primary">
        <div className="container">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              احسب تكلفة مشروعك فوراً
            </h2>
            <p className="text-xl mb-12 opacity-90">
              استخدم حاسبة التكلفة التفاعلية للحصول على تقدير دقيق لمشروع الستائر الخاص بك
            </p>

            <div className="grid grid-auto-sm mb-12">
              <div className="card-glass p-8 text-center">
                <Calculator size={48} className="mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">حساب سريع</h3>
                <p className="opacity-90">احصل على تقدير التكلفة في دقائق معدودة</p>
              </div>

              <div className="card-glass p-8 text-center">
                <Palette size={48} className="mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">خيارات متنوعة</h3>
                <p className="opacity-90">اختر من بين أنواع متعددة من الأقمشة والتصميمات</p>
              </div>

              <div className="card-glass p-8 text-center">
                <Star size={48} className="mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">شفافية كاملة</h3>
                <p className="opacity-90">تفاصيل واضحة لجميع التكاليف بدون مفاجآت</p>
              </div>
            </div>

            <Link href="/calculator" className="btn btn-secondary btn-xl">
              <Calculator size={24} />
              ابدأ الحساب الآن
              <ArrowLeft size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section section-bg-gray">
        <div className="container">
          <div className="grid grid-2 items-center">
            <div className="animate-fadeInRight">
              <h2 className="section-title text-gradient text-right mb-6">من نحن</h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                مؤسسة تعتيم هي شركة رائدة في مجال تصميم وتفصيل وتركيب الستائر في الرياض. نتميز بخبرة واسعة تمتد لسنوات طويلة في خدمة عملائنا الكرام.
              </p>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                نحن نؤمن بأن الستائر ليست مجرد قطعة قماش، بل هي لمسة فنية تضفي جمالاً وأناقة على المكان. لذلك نحرص على تقديم أفضل الخامات والتصميمات العصرية.
              </p>

              <div className="stats-grid mb-8">
                <div className="stat-card">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">مشروع مكتمل</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">10+</div>
                  <div className="stat-label">سنوات خبرة</div>
                </div>
              </div>

              <Link href="/portfolio" className="btn btn-secondary">
                <Eye size={16} />
                استعرض جميع مشاريعنا
              </Link>
            </div>

            <div className="relative animate-fadeInLeft">
              <div className="w-full h-96 bg-gradient-primary rounded-2xl flex items-center justify-center text-white text-xl font-semibold shadow-2xl">
                صورة المؤسسة
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-secondary rounded-full opacity-80 animate-float"></div>
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-60 animate-float animate-delay-300"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section contact-bg">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">تواصل معنا</h2>
            <p className="text-xl opacity-90">
              نحن هنا لخدمتك وتحويل أحلامك إلى واقع جميل
            </p>
          </div>

          <div className="grid grid-2 gap-12">
            <div className="animate-fadeInRight">
              <h3 className="text-2xl font-bold mb-8 text-white">معلومات التواصل</h3>

              <div className="space-y-6">
                <div className="contact-item">
                  <div className="contact-icon">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">الهاتف</p>
                    <p className="opacity-90">+966 50 123 4567</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">العنوان</p>
                    <p className="opacity-90">الرياض، المملكة العربية السعودية</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">البريد الإلكتروني</p>
                    <p className="opacity-90">info@ta3teem.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-fadeInLeft">
              <ContactFormComponent />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="logo-icon">ت</div>
              <div>
                <h3 className="text-xl font-bold">مؤسسة تعتيم</h3>
                <p className="text-gray-400">للستائر والتصميم</p>
              </div>
            </div>

            <div className="flex justify-center gap-2 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="currentColor" className="text-secondary" />
              ))}
            </div>

            <div className="flex justify-center gap-8 mb-8 flex-wrap">
              <button onClick={() => scrollToSection('home')} className="footer-link">
                الرئيسية
              </button>
              <Link href="/portfolio" className="footer-link">
                معرض الأعمال
              </Link>
              <Link href="/calculator" className="footer-link">
                حاسبة التكلفة
              </Link>
              <Link href="/booking" className="footer-link">
                حجز موعد
              </Link>
              <button onClick={() => scrollToSection('services')} className="footer-link">
                خدماتنا
              </button>
              <button onClick={() => scrollToSection('contact')} className="footer-link">
                تواصل معنا
              </button>
            </div>

            <div className="footer-bottom">
              <p className="mb-2">
                © 2025 مؤسسة تعتيم للستائر والتصميم. جميع الحقوق محفوظة.
              </p>
              <p className="text-sm text-gray-500">
                صُنع بحب في الرياض، المملكة العربية السعودية
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}