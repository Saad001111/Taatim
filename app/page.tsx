'use client';

import React, { useState } from 'react';
import { Phone, MapPin, Mail, Star, Menu, X, Eye, Scissors, Palette, ChevronDown, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

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
      <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '2rem' }}>احجز استشارتك المجانية</h3>
      
      {submitStatus === 'success' && (
        <div style={{
          background: '#10b981',
          color: 'white',
          padding: '1rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle size={20} />
          <span>{submitMessage}</span>
        </div>
      )}

      {submitStatus === 'error' && (
        <div style={{
          background: '#ef4444',
          color: 'white',
          padding: '1rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle size={20} />
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
            className="form-input"
            style={{
              borderColor: errors.name ? '#ef4444' : 'rgba(255,255,255,0.3)'
            }}
          />
          {errors.name && (
            <p style={{ color: '#fca5a5', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              {errors.name}
            </p>
          )}
        </div>

        <div className="form-group">
          <input 
            type="tel" 
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="رقم الهاتف (مثال: 0501234567)" 
            className="form-input"
            style={{
              borderColor: errors.phone ? '#ef4444' : 'rgba(255,255,255,0.3)'
            }}
          />
          {errors.phone && (
            <p style={{ color: '#fca5a5', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              {errors.phone}
            </p>
          )}
        </div>

        <div className="form-group">
          <textarea 
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="اخبرنا عن مشروعك بالتفصيل..." 
            className="form-input textarea"
            style={{
              borderColor: errors.message ? '#ef4444' : 'rgba(255,255,255,0.3)'
            }}
          ></textarea>
          <p style={{ 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: '0.8rem', 
            marginTop: '0.5rem',
            textAlign: 'left' 
          }}>
            {formData.message.length}/1000
          </p>
          {errors.message && (
            <p style={{ color: '#fca5a5', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              {errors.message}
            </p>
          )}
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            background: isSubmitting 
              ? 'rgba(251, 146, 60, 0.7)' 
              : 'linear-gradient(135deg, #fb923c, #f87171)',
            color: 'white',
            padding: '1rem',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #fffbeb, #fff7ed)' }}>
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">ت</div>
            <div>
              <h1 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                مؤسسة تعتيم
              </h1>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>للستائر والتصميم</p>
            </div>
          </div>

          <nav className="nav">
            <button onClick={() => scrollToSection('home')} className="nav-link">الرئيسية</button>
            <button onClick={() => scrollToSection('services')} className="nav-link">خدماتنا</button>
            <button onClick={() => scrollToSection('products')} className="nav-link">منتجاتنا</button>
            <button onClick={() => scrollToSection('about')} className="nav-link">من نحن</button>
            <button onClick={() => scrollToSection('contact')} className="nav-link">تواصل معنا</button>
          </nav>

          <button 
            className="mobile-menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="mobile-nav" style={{ maxWidth: '1200px', margin: '0 auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
            <button onClick={() => scrollToSection('home')} className="nav-link">الرئيسية</button>
            <button onClick={() => scrollToSection('services')} className="nav-link">خدماتنا</button>
            <button onClick={() => scrollToSection('products')} className="nav-link">منتجاتنا</button>
            <button onClick={() => scrollToSection('about')} className="nav-link">من نحن</button>
            <button onClick={() => scrollToSection('contact')} className="nav-link">تواصل معنا</button>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="hero-bg">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="fade-in">
            <h1 className="title">
              <span style={{ background: 'linear-gradient(135deg, #fb923c, #f87171)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                تعتيم
              </span>
            </h1>
            <p className="text-large" style={{ color: 'white', maxWidth: '600px', margin: '0 auto 2rem' }}>
              نحول أحلامك إلى واقع جميل مع أجود أنواع الستائر والتصميمات العصرية في الرياض
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => scrollToSection('contact')} className="btn btn-primary">
                احجز استشارة مجانية
              </button>
              <button onClick={() => scrollToSection('products')} className="btn btn-outline">
                شاهد أعمالنا
              </button>
            </div>
          </div>
        </div>
        
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)' }} className="bounce">
          <ChevronDown size={32} color="white" />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section" style={{ background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <h2 className="subtitle gradient-text">خدماتنا المتميزة</h2>
            <p className="text-large">نقدم مجموعة شاملة من الخدمات المتخصصة في مجال الستائر والديكور</p>
          </div>

          <div className="grid grid-3">
            {services.map((service, index) => (
              <div key={index} className="card">
                <div className="service-icon">
                  {service.icon}
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
                  {service.title}
                </h3>
                <p style={{ color: '#6b7280', lineHeight: 1.6 }}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="section" style={{ background: 'linear-gradient(to bottom right, #fffbeb, #fff7ed)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <h2 className="subtitle gradient-text">منتجاتنا المتنوعة</h2>
            <p className="text-large">اكتشف مجموعتنا الواسعة من الستائر العصرية والكلاسيكية</p>
          </div>

          <div className="grid grid-3">
            {products.map((product, index) => (
              <div key={index} className="product-card">
                <span>{product}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section" style={{ background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="grid grid-2">
            <div>
              <h2 className="subtitle gradient-text">من نحن</h2>
              <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                مؤسسة تعتيم هي شركة رائدة في مجال تصميم وتفصيل وتركيب الستائر في الرياض. نتميز بخبرة واسعة تمتد لسنوات طويلة في خدمة عملائنا الكرام.
              </p>
              <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                نحن نؤمن بأن الستائر ليست مجرد قطعة قماش، بل هي لمسة فنية تضفي جمالاً وأناقة على المكان. لذلك نحرص على تقديم أفضل الخامات والتصميمات العصرية.
              </p>
              
              <div className="stats">
                <div className="stat-card">
                  <div className="stat-number">500+</div>
                  <div style={{ color: '#6b7280' }}>مشروع مكتمل</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">10+</div>
                  <div style={{ color: '#6b7280' }}>سنوات خبرة</div>
                </div>
              </div>
            </div>
            
            <div style={{ position: 'relative' }}>
              <div style={{ 
                width: '100%', 
                height: '400px', 
                background: 'linear-gradient(135deg, #34d399, #0d9488)', 
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: '600',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }}>
                صورة المؤسسة
              </div>
              <div style={{ 
                position: 'absolute', 
                bottom: '-1.5rem', 
                right: '-1.5rem', 
                width: '100px', 
                height: '100px', 
                background: 'linear-gradient(135deg, #fb923c, #f87171)', 
                borderRadius: '50%', 
                opacity: 0.8 
              }}></div>
              <div style={{ 
                position: 'absolute', 
                top: '-1.5rem', 
                left: '-1.5rem', 
                width: '70px', 
                height: '70px', 
                background: 'linear-gradient(135deg, #fbbf24, #fb923c)', 
                borderRadius: '50%', 
                opacity: 0.6 
              }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section contact-bg">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>تواصل معنا</h2>
            <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>
              نحن هنا لخدمتك وتحويل أحلامك إلى واقع جميل
            </p>
          </div>

          <div className="grid grid-2">
            <div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '2rem' }}>معلومات التواصل</h3>
              
              <div>
                <div className="contact-item">
                  <div className="contact-icon">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>الهاتف</p>
                    <p style={{ opacity: 0.9 }}>+966 50 123 4567</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>العنوان</p>
                    <p style={{ opacity: 0.9 }}>الرياض، المملكة العربية السعودية</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>البريد الإلكتروني</p>
                    <p style={{ opacity: 0.9 }}>info@ta3teem.com</p>
                  </div>
                </div>
              </div>
            </div>

            <ContactFormComponent />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="text-center">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div className="logo-icon">ت</div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>مؤسسة تعتيم</h3>
                <p style={{ color: '#9ca3af', margin: 0 }}>للستائر والتصميم</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="#fb923c" color="#fb923c" />
              ))}
            </div>
            
            <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>
              © 2025 مؤسسة تعتيم للستائر والتصميم. جميع الحقوق محفوظة.
            </p>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              صُنع بحب في الرياض، المملكة العربية السعودية
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}