'use client'; // يُشير إلى أن هذا المكون هو Client Component في Next.js

import React, { useState, useEffect } from 'react'; // استيراد React و useState و useEffect
import { Calendar, Clock, User, Phone, MapPin, CheckCircle, AlertCircle, Loader2, Star, Eye, Calculator, Home, ArrowRight } from 'lucide-react'; // استيراد أيقونات من مكتبة lucide-react

// --- بيانات وثوابت نظام الحجز (Constants Data) ---
// يمكنك تعديل هذه البيانات لتناسب خدماتك ومواعيدك.

// أنواع الخدمات المتاحة، مع تفاصيل كل خدمة
const serviceTypes = {
  consultation: {
    name: 'استشارة مجانية',
    duration: 30, // المدة بالدقائق
    price: 0, // السعر
    description: 'استشارة تصميمية مجانية لاختيار أفضل الحلول لمشروعك.',
    icon: '💡', // رمز تعبيري أو أيقونة
    included: ['تحليل المساحة', 'اقتراح التصميمات', 'توضيح الخيارات المتاحة'] // ما يشمله الخدمة
  },
  measurement: {
    name: 'قياس وتقدير',
    duration: 45,
    price: 0,
    description: 'زيارة مجانية لأخذ القياسات الدقيقة وتقدير التكلفة للمشروع.',
    icon: '📏',
    included: ['القياس الدقيق في الموقع', 'عرض سعر مفصل', 'جدولة التنفيذ المبدئية']
  },
  premium_consultation: {
    name: 'استشارة متقدمة',
    duration: 60,
    price: 200, // خدمة مدفوعة
    description: 'استشارة شاملة مع مصمم متخصص، تتضمن عرضًا ثلاثي الأبعاد لتصور مشروعك.',
    icon: '🎨',
    included: ['تصميم ثلاثي الأبعاد', 'اختيار الألوان والمواد', 'تنسيق مع الديكور الحالي', 'ملف تصميمي كامل']
  }
} as const; // استخدام `as const` لتحسين استنتاج الأنواع وجعلها للقراءة فقط

// المناطق المتاحة للحجز في الرياض
const areas = [
  'الملقا', 'النرجس', 'الياسمين', 'الورود', 'الصحافة', 'الملك فهد',
  'العليا', 'المروج', 'الفلاح', 'الصواري', 'الوادي', 'حي الوزارات',
  'المحمدية', 'الربوة', 'الواحة', 'النزهة', 'المعذر', 'العقيق'
] as const;

// الأوقات المتاحة للحجز يومياً
const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
] as const;

// --- المكون الرئيسي لنظام الحجز (BookingSystem) ---
export default function BookingSystem() {
  // حالة لإدارة الخطوة الحالية في عملية الحجز
  const [step, setStep] = useState(1);

  // حالات لتخزين اختيارات المستخدم ومعلوماته
  const [selectedService, setSelectedService] = useState<keyof typeof serviceTypes>('consultation');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    area: '' as typeof areas[number] | '', // تحديد نوع المنطقة ليكون من قائمة المناطق أو فارغًا
    address: '',
    notes: ''
  });

  // حالات للتحكم في عملية الإرسال وتأكيد الحجز
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null); // تفاصيل الحجز المؤكدة

  // --- دالة لتوليد التواريخ المتاحة للحجز ---
  // تولد تواريخ للأسبوعين القادمين وتستبعد أيام الجمعة.
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // لإزالة الوقت وجعل المقارنات دقيقة

    for (let i = 1; i <= 14; i++) { // الأسبوعين القادمين (14 يومًا من الغد)
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // تخطي يوم الجمعة (يوم الجمعة هو 5 في JavaScript حيث الأحد 0)
      if (date.getDay() !== 5) {
        dates.push({
          date: date.toISOString().split('T')[0], // تنسيق YYYY-MM-DD
          day: date.toLocaleDateString('ar-SA', { weekday: 'long' }), // اسم اليوم بالعربية
          formatted: date.toLocaleDateString('ar-SA', { // تنسيق كامل وودي
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        });
      }
    }
    return dates;
  };

  const availableDates = generateAvailableDates(); // يتم حسابها مرة واحدة عند تحميل المكون

  // --- دالة لمعالجة تغييرات حقول معلومات العميل ---
  const handleCustomerInfoChange = (field: keyof typeof customerInfo, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // --- دالة للتحقق من صحة المدخلات في كل خطوة قبل الانتقال ---
  const validateStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return !!selectedService; // يجب اختيار خدمة
      case 2:
        return selectedDate !== '' && selectedTime !== ''; // يجب اختيار تاريخ ووقت
      case 3:
        // يجب أن يكون الاسم ورقم الهاتف والمنطقة موجودة
        return customerInfo.name.trim() !== '' && customerInfo.phone.trim() !== '' && customerInfo.area !== '';
      default:
        return true;
    }
  };

  // --- دالة لإرسال الحجز (محاكاة) ---
  const submitBooking = async () => {
    setIsSubmitting(true); // تفعيل حالة التحميل

    // محاكاة تأخير لمدة ثانيتين لتمثيل عملية إرسال البيانات إلى الخادم
    await new Promise(resolve => setTimeout(resolve, 2000));

    // إنشاء كائن الحجز بالتفاصيل
    const booking = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(), // توليد معرف حجز عشوائي
      service: serviceTypes[selectedService],
      date: selectedDate,
      time: selectedTime,
      customer: customerInfo,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    setBookingDetails(booking); // حفظ تفاصيل الحجز المؤكدة
    setBookingConfirmed(true); // تأكيد الحجز لعرض صفحة التأكيد
    setIsSubmitting(false); // إخفاء حالة التحميل
  };

  // --- دالة لتنسيق الأرقام كعملة (ريال سعودي) ---
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0 // لا تعرض الكسور العشرية
    }).format(price);
  };

  // --- مكون مؤشر الخطوات (StepIndicator Component) ---
  // يعرض التقدم الحالي في خطوات الحجز
  const StepIndicator = () => (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
      {[1, 2, 3].map((stepNum) => (
        <div key={stepNum} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: step >= stepNum ? 'linear-gradient(135deg, #059669, #0d9488)' : '#e5e7eb',
            color: step >= stepNum ? 'white' : '#6b7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            transition: 'all 0.3s ease'
          }}>
            {step > stepNum ? <CheckCircle size={24} /> : stepNum} {/* يعرض علامة صح إذا تم تجاوز الخطوة */}
          </div>
          {stepNum < 3 && ( // لا يعرض الخط الأفقي بعد الخطوة الأخيرة
            <div style={{
              width: '80px',
              height: '3px',
              background: step > stepNum ? '#059669' : '#e5e7eb',
              margin: '0 1rem',
              transition: 'all 0.3s ease'
            }} />
          )}
        </div>
      ))}
    </div>
  );

  // --- عرض صفحة التأكيد بعد الحجز الناجح (Booking Confirmed View) ---
  // إذا تم تأكيد الحجز، يتم عرض هذه الواجهة.
  if (bookingConfirmed && bookingDetails) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #f0fdf4, #ecfdf5)',
        padding: '2rem 1rem',
        fontFamily: 'Noto Sans Arabic, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }} dir="rtl">
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '3rem',
          maxWidth: '600px',
          width: '100%',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #059669, #0d9488)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem'
          }}>
            <CheckCircle size={40} color="white" />
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#059669' }}>
            تم تأكيد الحجز! 🎉
          </h1>

          <p style={{ fontSize: '1.2rem', color: '#6b7280', marginBottom: '2rem' }}>
            شكراً لك على ثقتك بنا. تم حجز موعدك بنجاح وسنتواصل معك قريباً.
          </p>

          {/* تفاصيل الحجز المؤكدة */}
          <div style={{
            background: '#f9fafb',
            border: '2px solid #059669',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '2rem',
            textAlign: 'right'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
              تفاصيل الحجز
            </h3>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold' }}>رقم الحجز:</span>
                <span style={{ color: '#059669', fontWeight: 'bold' }}>{bookingDetails.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold' }}>الخدمة:</span>
                <span>{bookingDetails.service.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold' }}>التاريخ:</span>
                <span>{new Date(bookingDetails.date).toLocaleDateString('ar-SA', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold' }}>الوقت:</span>
                <span>{bookingDetails.time}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold' }}>المنطقة:</span>
                <span>{bookingDetails.customer.area}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold' }}>التكلفة:</span>
                <span style={{ color: '#059669', fontWeight: 'bold' }}>
                  {bookingDetails.service.price === 0 ? 'مجاني' : formatPrice(bookingDetails.service.price)}
                </span>
              </div>
            </div>
          </div>

          {/* رسالة تأكيد إضافية */}
          <div style={{
            background: '#fef3c7',
            border: '1px solid #fbbf24',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            <p style={{ color: '#92400e', fontWeight: 'bold', margin: 0 }}>
              📱 سنرسل لك رسالة تأكيد على رقم: {bookingDetails.customer.phone}
            </p>
          </div>

          {/* أزرار الإجراءات بعد التأكيد */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                // إعادة تعيين جميع الحالات لبدء عملية حجز جديدة
                setBookingConfirmed(false);
                setStep(1);
                setSelectedService('consultation');
                setSelectedDate('');
                setSelectedTime('');
                setCustomerInfo({
                  name: '',
                  phone: '',
                  email: '',
                  area: '',
                  address: '',
                  notes: ''
                });
              }}
              style={{
                background: 'linear-gradient(135deg, #059669, #0d9488)',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '50px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              حجز موعد آخر
            </button>

            <button
              onClick={() => window.location.href = '/'} // العودة للصفحة الرئيسية
              style={{
                background: 'white',
                color: '#059669',
                border: '2px solid #059669',
                padding: '1rem 2rem',
                borderRadius: '50px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- هيكل الواجهة الرسومية الرئيسي لنظام الحجز (Booking Form View) ---
  // هذا الجزء يتم عرضه طالما أن الحجز لم يتم تأكيده بعد.
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #fffbeb, #fff7ed)',
      padding: '2rem 1rem',
      fontFamily: 'Noto Sans Arabic, sans-serif'
    }} dir="rtl">
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* قسم العنوان الرئيسي لنظام الحجز */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'linear-gradient(135deg, #059669, #0d9488)',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '50px',
            marginBottom: '1rem'
          }}>
            <Calendar size={32} />
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>حجز موعد</h1>
          </div>
          <p style={{ fontSize: '1.2rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
            احجز موعد استشارة مجانية أو قياس دقيق لمشروع الستائر الخاص بك.
          </p>
        </div>

        {/* عرض مؤشر الخطوات */}
        <StepIndicator />

        {/* الحاوية الرئيسية للخطوات */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          {/* --- الخطوة 1: اختيار الخدمة --- */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
                اختر نوع الخدمة المطلوبة
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {Object.entries(serviceTypes).map(([key, service]) => (
                  <div
                    key={key}
                    onClick={() => setSelectedService(key as keyof typeof serviceTypes)}
                    style={{
                      padding: '2rem',
                      border: selectedService === key ? '3px solid #059669' : '2px solid #e5e7eb',
                      borderRadius: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background: selectedService === key ? '#f0fdf4' : 'white',
                      position: 'relative'
                    }}
                  >
                    {selectedService === key && (
                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        background: '#059669',
                        color: 'white',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CheckCircle size={20} />
                      </div>
                    )}

                    <div style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>
                      {service.icon}
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center' }}>
                      {service.name}
                    </h3>

                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                      <span style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: service.price === 0 ? '#059669' : '#374151'
                      }}>
                        {service.price === 0 ? 'مجاني' : formatPrice(service.price)}
                      </span>
                      <span style={{ color: '#6b7280', fontSize: '0.9rem', marginRight: '0.5rem' }}>
                        ({service.duration} دقيقة)
                      </span>
                    </div>

                    <p style={{ color: '#6b7280', marginBottom: '1rem', textAlign: 'center' }}>
                      {service.description}
                    </p>

                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151' }}>
                        ما يشمله:
                      </h4>
                      {service.included.map((item, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <CheckCircle size={14} style={{ color: '#059669' }} />
                          <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- الخطوة 2: اختيار التاريخ والوقت --- */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
                اختر التاريخ والوقت المناسب
              </h2>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>التاريخ</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {availableDates.map((dateObj) => (
                    <div
                      key={dateObj.date}
                      onClick={() => setSelectedDate(dateObj.date)}
                      style={{
                        padding: '1rem',
                        border: selectedDate === dateObj.date ? '2px solid #059669' : '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        background: selectedDate === dateObj.date ? '#f0fdf4' : 'white',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                        {dateObj.day}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                        {new Date(dateObj.date).toLocaleDateString('ar-SA', { month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedDate && ( // عرض أوقات الحجز فقط إذا تم اختيار تاريخ
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>الوقت</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
                    {timeSlots.map((time) => (
                      <div
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        style={{
                          padding: '1rem',
                          border: selectedTime === time ? '2px solid #059669' : '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          background: selectedTime === time ? '#f0fdf4' : 'white',
                          textAlign: 'center',
                          fontWeight: selectedTime === time ? 'bold' : 'normal'
                        }}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- الخطوة 3: معلومات العميل --- */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
                معلومات التواصل
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* حقل الاسم الكامل */}
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                    placeholder="مثال: أحمد محمد العلي"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#059669'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                {/* حقل رقم الهاتف */}
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                    placeholder="مثال: 0501234567"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#059669'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                {/* حقل البريد الإلكتروني (اختياري) */}
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                    placeholder="مثال: ahmed@email.com"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#059669'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                {/* حقل اختيار المنطقة */}
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                    المنطقة *
                  </label>
                  <select
                    value={customerInfo.area}
                    onChange={(e) => handleCustomerInfoChange('area', e.target.value as typeof areas[number])}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      transition: 'border-color 0.3s ease',
                      background: 'white'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#059669'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  >
                    <option value="">اختر المنطقة</option>
                    {areas.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* حقل العنوان التفصيلي (اختياري) */}
              <div style={{ marginTop: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                  العنوان التفصيلي
                </label>
                <textarea
                  value={customerInfo.address}
                  onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                  placeholder="مثال: شارع الأمير سلطان، مجمع الغدير، فيلا رقم 123"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#059669'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              {/* حقل الملاحظات الإضافية (اختياري) */}
              <div style={{ marginTop: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                  ملاحظات إضافية
                </label>
                <textarea
                  value={customerInfo.notes}
                  onChange={(e) => handleCustomerInfoChange('notes', e.target.value)}
                  placeholder="أي تفاصيل إضافية تود مشاركتها معنا..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#059669'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              {/* ملخص الحجز قبل الإرسال */}
              <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: '#f0fdf4',
                border: '2px solid #059669',
                borderRadius: '1rem'
              }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
                  ملخص الحجز
                </h3>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 'bold' }}>الخدمة:</span>
                    <span>{serviceTypes[selectedService].name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 'bold' }}>التاريخ:</span>
                    <span>{selectedDate && new Date(selectedDate).toLocaleDateString('ar-SA', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 'bold' }}>الوقت:</span>
                    <span>{selectedTime}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 'bold' }}>المدة:</span>
                    <span>{serviceTypes[selectedService].duration} دقيقة</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 'bold' }}>التكلفة:</span>
                    <span style={{ color: '#059669', fontWeight: 'bold' }}>
                      {serviceTypes[selectedService].price === 0 ? 'مجاني' : formatPrice(serviceTypes[selectedService].price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* أزرار التنقل بين الخطوات (السابق/التالي/تأكيد الحجز) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                style={{
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                السابق
              </button>
            )}

            <div style={{ flex: 1 }} /> {/* عنصر مرن لدفع الأزرار إلى الأطراف */}

            {step < 3 && ( // زر "التالي" يظهر فقط قبل الخطوة الأخيرة
              <button
                onClick={() => setStep(step + 1)}
                disabled={!validateStep(step)} // تعطيل الزر إذا كانت الحقول المطلوبة فارغة
                style={{
                  background: validateStep(step)
                    ? 'linear-gradient(135deg, #059669, #0d9488)'
                    : '#e5e7eb',
                  color: validateStep(step) ? 'white' : '#6b7280',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  cursor: validateStep(step) ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                التالي
                <ArrowRight size={20} />
              </button>
            )}

            {step === 3 && ( // زر "تأكيد الحجز" يظهر فقط في الخطوة الأخيرة
              <button
                onClick={submitBooking}
                disabled={!validateStep(step) || isSubmitting} // تعطيل الزر أثناء الإرسال أو إذا كانت الحقول فارغة
                style={{
                  background: validateStep(step) && !isSubmitting
                    ? 'linear-gradient(135deg, #fb923c, #f87171)'
                    : '#e5e7eb',
                  color: validateStep(step) && !isSubmitting ? 'white' : '#6b7280',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  cursor: validateStep(step) && !isSubmitting ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1.1rem'
                }}
              >
                {isSubmitting ? ( // عرض أيقونة تحميل ونص "جاري التأكيد" أثناء الإرسال
                  <>
                    <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                    جاري التأكيد...
                  </>
                ) : ( // عرض أيقونة تأكيد ونص "تأكيد الحجز" في الوضع الطبيعي
                  <>
                    <CheckCircle size={20} />
                    تأكيد الحجز
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* روابط سريعة لخدمات أخرى */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            خدمات أخرى قد تهمك
          </h3>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.location.href = '/portfolio'} // الانتقال لصفحة معرض الأعمال
              style={{
                background: 'linear-gradient(135deg, #059669, #0d9488)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '50px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Eye size={16} />
              معرض الأعمال
            </button>

            <button
              onClick={() => window.location.href = '/calculator'} // الانتقال لصفحة حاسبة التكلفة
              style={{
                background: 'linear-gradient(135deg, #fb923c, #f87171)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '50px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Calculator size={16} />
              حاسبة التكلفة
            </button>

            <button
              onClick={() => window.location.href = '/'} // الانتقال للصفحة الرئيسية
              style={{
                background: 'white',
                color: '#059669',
                border: '2px solid #059669',
                padding: '0.75rem 1.5rem',
                borderRadius: '50px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Home size={16} />
              الرئيسية
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}