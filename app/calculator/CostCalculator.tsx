'use client'; // يُشير إلى أن هذا المكون هو Client Component في Next.js

import React, { useState, useEffect } from 'react'; // استيراد React و useState و useEffect
import { Calculator, Home, Building, Hotel, Calendar, Ruler, Palette, Settings, Info, Check, Star, ArrowRight, Download, Printer } from 'lucide-react'; // استيراد أيقونات

// --- بيانات الأسعار والثوابت (Constants Data) ---
// هذه الكائنات تحتوي على البيانات الأساسية لحساب التكلفة.
// يمكنك تعديل هذه القيم لتناسب أسعارك وخدماتك.

// أنواع الأقمشة بأسعارها وميزاتها
const fabricTypes = {
  economy: {
    name: 'اقتصادي',
    description: 'أقمشة جيدة الجودة بأسعار معقولة',
    pricePerSqm: 35, // السعر لكل متر مربع
    features: ['ضمان سنة', 'ألوان متنوعة', 'سهولة العناية'],
    image: '🏠' // رمز تعبيري (emoji) للواجهة
  },
  premium: {
    name: 'بريميوم',
    description: 'أقمشة فاخرة مستوردة عالية الجودة',
    pricePerSqm: 65,
    features: ['ضمان 3 سنوات', 'مقاومة البهتان', 'نسيج فاخر'],
    image: '⭐'
  },
  luxury: {
    name: 'فاخر',
    description: 'أقمشة إيطالية وفرنسية حصرية',
    pricePerSqm: 120,
    features: ['ضمان 5 سنوات', 'تصميمات حصرية', 'خامات إيطالية'],
    image: '👑'
  }
} as const; // استخدام `as const` لجعل الكائنات للقراءة فقط وتحسين استنتاج الأنواع

// أنواع الستائر بمعاملات تأثيرها على السعر والتركيب
const curtainTypes = {
  classic: {
    name: 'ستائر كلاسيكية',
    multiplier: 1.0, // معامل ضرب السعر
    description: 'تصميم تقليدي أنيق',
    installationFactor: 1.0 // معامل تأثير على تكلفة التركيب
  },
  modern: {
    name: 'ستائر عصرية',
    multiplier: 1.2,
    description: 'تصميمات حديثة ومبتكرة',
    installationFactor: 1.1
  },
  blackout: {
    name: 'ستائر بلاك آوت',
    multiplier: 1.5,
    description: 'عازلة للضوء تماماً',
    installationFactor: 1.2
  },
  roman: {
    name: 'ستائر رومانية',
    multiplier: 1.8,
    description: 'طيات أفقية أنيقة',
    installationFactor: 1.4
  },
  motorized: {
    name: 'ستائر كهربائية',
    multiplier: 3.0,
    description: 'تحكم إلكتروني ذكي',
    installationFactor: 2.0
  }
} as const;

// أنواع الغرف بمعاملات تأثيرها على السعر
const roomTypes = {
  living: { name: 'غرفة معيشة', factor: 1.0 },
  bedroom: { name: 'غرفة نوم', factor: 0.9 },
  kitchen: { name: 'مطبخ', factor: 0.8 },
  office: { name: 'مكتب', factor: 1.1 },
  hotel: { name: 'فندق', factor: 1.3 },
  hospital: { name: 'مستشفى', factor: 1.4 }
} as const;

// الخدمات الإضافية وأسعارها، مع تحديد ما إذا كانت مشمولة تلقائيًا
type AdditionalService = {
  name: string;
  price: number;
  included: boolean;
};

const additionalServices: Record<string, AdditionalService> = {
  measurement: { name: 'القياس المجاني', price: 0, included: true },
  consultation: { name: 'الاستشارة التصميمية', price: 200, included: false },
  installation: { name: 'التركيب الاحترافي', price: 0, included: true },
  maintenance: { name: 'الصيانة السنوية', price: 150, included: false },
  express: { name: 'التنفيذ السريع (أسبوع)', price: 300, included: false }
};

// --- المكون الرئيسي (CostCalculator) ---
export default function CostCalculator() {
  // حالة لإدارة الخطوة الحالية في الحاسبة
  const [step, setStep] = useState(1);

  // حالة لتخزين مدخلات المستخدم للحسابات
  const [calculations, setCalculations] = useState({
    width: '', // عرض النافذة/الجدار
    height: '', // ارتفاع النافذة/الجدار
    rooms: 1, // عدد الغرف أو النوافذ
    fabricType: 'premium' as keyof typeof fabricTypes, // نوع القماش المختار
    curtainType: 'modern' as keyof typeof curtainTypes, // نوع الستائر المختار
    roomType: 'living' as keyof typeof roomTypes, // نوع الغرفة المختار
    selectedServices: ['measurement', 'installation'] as (keyof typeof additionalServices)[], // الخدمات الإضافية المختارة
    urgency: 'normal' // (غير مستخدم حاليا في الكود المقدم ولكن يمكن تطويره)
  });

  // حالة لتخزين نتائج الحسابات النهائية
  const [results, setResults] = useState({
    totalArea: 0,
    fabricCost: 0,
    installationCost: 0,
    servicesCost: 0,
    totalCost: 0,
    discountAmount: 0,
    finalCost: 0
  });

  // حالة للتحكم في عرض المودال الخاص بعرض السعر
  const [showQuote, setShowQuote] = useState(false);

  // --- دالة حساب التكاليف (Calculation Logic) ---
  const calculateCosts = () => {
    const width = parseFloat(calculations.width) || 0;
    const height = parseFloat(calculations.height) || 0;
    const rooms = parseInt(calculations.rooms.toString()) || 1; // التأكد من تحويل rooms إلى عدد صحيح

    // حساب المساحة الإجمالية: العرض × الارتفاع × عدد الغرف/النوافذ
    const totalArea = width * height * rooms;

    // جلب بيانات الأنواع المختارة
    const fabric = fabricTypes[calculations.fabricType];
    const curtain = curtainTypes[calculations.curtainType];
    const room = roomTypes[calculations.roomType];

    // حساب تكلفة القماش الأولية
    const fabricCost = totalArea * fabric.pricePerSqm * curtain.multiplier * room.factor;

    // حساب تكلفة التركيب (20% من تكلفة القماش، مع معامل نوع الستائر)
    const installationCost = fabricCost * 0.2 * curtain.installationFactor;

    // حساب تكلفة الخدمات الإضافية المختارة (استبعاد الخدمات المجانية/المضمونة)
    const servicesCost = calculations.selectedServices.reduce((total, serviceKey) => {
      const service = additionalServices[serviceKey];
      return total + (service.included ? 0 : service.price); // إضافة سعر الخدمة فقط إذا لم تكن مشمولة
    }, 0);

    // حساب الإجمالي الفرعي قبل الخصم
    const subtotal = fabricCost + installationCost + servicesCost;

    // حساب الخصم (خصم 10% للطلبات التي تزيد عن 10,000 ريال)
    const discountAmount = subtotal > 10000 ? subtotal * 0.1 : 0;

    // حساب التكلفة النهائية بعد الخصم
    const finalCost = subtotal - discountAmount;

    // تحديث حالة النتائج
    setResults({
      totalArea,
      fabricCost,
      installationCost,
      servicesCost,
      totalCost: subtotal,
      discountAmount,
      finalCost
    });
  };

  // --- تأثير جانبي (useEffect) لإعادة الحساب عند تغير المدخلات ---
  // سيتم تشغيل `calculateCosts` في كل مرة تتغير فيها أي من قيم `calculations`.
  useEffect(() => {
    calculateCosts();
  }, [calculations]);

  // --- دوال معالجة التغييرات (Event Handlers) ---
  const handleInputChange = (field: string, value: string | number) => {
    setCalculations(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceToggle = (serviceKey: keyof typeof additionalServices) => {
    const service = additionalServices[serviceKey];
    if (service.included) return; // لا تسمح بإلغاء اختيار الخدمات المشمولة تلقائيًا

    setCalculations(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceKey)
        ? prev.selectedServices.filter(s => s !== serviceKey) // إزالة الخدمة إذا كانت مختارة
        : [...prev.selectedServices, serviceKey] // إضافة الخدمة إذا لم تكن مختارة
    }));
  };

  // دالة لتوليد عرض السعر (تظهر المودال)
  const generateQuote = () => {
    setShowQuote(true);
  };

  // دالة لتنسيق الأرقام كعملة (ريال سعودي)
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0 // لا تعرض الكسور العشرية
    }).format(price);
  };

  // --- مكون مؤشر الخطوات (StepIndicator Component) ---
  // يعرض التقدم الحالي في خطوات الحاسبة
  const StepIndicator = () => (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
      {[1, 2, 3, 4].map((stepNum) => (
        <div key={stepNum} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: step >= stepNum ? 'linear-gradient(135deg, #059669, #0d9488)' : '#e5e7eb',
            color: step >= stepNum ? 'white' : '#6b7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}>
            {step > stepNum ? <Check size={20} /> : stepNum} {/* يعرض علامة صح إذا تم تجاوز الخطوة */}
          </div>
          {stepNum < 4 && ( // لا يعرض الخط الأفقي بعد الخطوة الأخيرة
            <div style={{
              width: '60px',
              height: '2px',
              background: step > stepNum ? '#059669' : '#e5e7eb',
              margin: '0 1rem',
              transition: 'all 0.3s ease'
            }} />
          )}
        </div>
      ))}
    </div>
  );

  // --- هيكل الواجهة الرسومية (UI Structure) ---
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #fffbeb, #fff7ed)',
      padding: '2rem 1rem',
      fontFamily: 'Noto Sans Arabic, sans-serif'
    }} dir="rtl"> {/* تحديد اتجاه النص من اليمين لليسار */}
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* قسم العنوان الرئيسي للحاسبة */}
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
            <Calculator size={32} />
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>حاسبة التكلفة</h1>
          </div>
          <p style={{ fontSize: '1.2rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
            احسب تكلفة مشروع الستائر الخاص بك بدقة واحصل على عرض سعر فوري
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
          {/* --- الخطوة 1: القياسات --- */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Ruler size={24} />
                الخطوة 1: القياسات
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {/* حقل العرض */}
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                    العرض (متر)
                  </label>
                  <input
                    type="number"
                    value={calculations.width}
                    onChange={(e) => handleInputChange('width', e.target.value)}
                    placeholder="مثال: 3.5"
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

                {/* حقل الارتفاع */}
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                    الارتفاع (متر)
                  </label>
                  <input
                    type="number"
                    value={calculations.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    placeholder="مثال: 2.8"
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

                {/* حقل عدد الغرف/النوافذ */}
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
                    عدد الغرف/النوافذ
                  </label>
                  <input
                    type="number"
                    value={calculations.rooms}
                    onChange={(e) => handleInputChange('rooms', e.target.value)}
                    min="1"
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
              </div>

              {/* بطاقة معلومات المساحة الإجمالية */}
              <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: '#f0fdf4',
                borderRadius: '0.5rem',
                border: '1px solid #bbf7d0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Info size={20} style={{ color: '#059669' }} />
                  <strong style={{ color: '#059669' }}>معلومة مفيدة</strong>
                </div>
                <p style={{ color: '#065f46', margin: 0 }}>
                  يتم حساب المساحة الإجمالية: العرض × الارتفاع × عدد الغرف = {(parseFloat(calculations.width) || 0) * (parseFloat(calculations.height) || 0) * (parseInt(calculations.rooms.toString()) || 1)} متر مربع
                </p>
              </div>
            </div>
          )}

          {/* --- الخطوة 2: نوع القماش --- */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Palette size={24} />
                الخطوة 2: اختيار نوع القماش
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {Object.entries(fabricTypes).map(([key, fabric]) => (
                  <div
                    key={key}
                    onClick={() => handleInputChange('fabricType', key)}
                    style={{
                      padding: '1.5rem',
                      border: calculations.fabricType === key ? '3px solid #059669' : '2px solid #e5e7eb',
                      borderRadius: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background: calculations.fabricType === key ? '#f0fdf4' : 'white'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{fabric.image}</div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      {fabric.name}
                    </h3>
                    <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.9rem' }}>
                      {fabric.description}
                    </p>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669', marginBottom: '1rem' }}>
                      {fabric.pricePerSqm} ريال/م²
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {fabric.features.map((feature, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                          <Check size={16} style={{ color: '#059669' }} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- الخطوة 3: نوع الستائر والغرفة --- */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Settings size={24} />
                الخطوة 3: نوع الستائر والغرفة
              </h2>

              {/* قسم اختيار نوع الستائر */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>نوع الستائر</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  {Object.entries(curtainTypes).map(([key, curtain]) => (
                    <div
                      key={key}
                      onClick={() => handleInputChange('curtainType', key)}
                      style={{
                        padding: '1rem',
                        border: calculations.curtainType === key ? '2px solid #059669' : '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        background: calculations.curtainType === key ? '#f0fdf4' : 'white'
                      }}
                    >
                      <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{curtain.name}</h4>
                      <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{curtain.description}</p>
                      <p style={{ fontSize: '0.8rem', color: '#059669', fontWeight: '600' }}>
                        معامل السعر: {curtain.multiplier}x
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* قسم اختيار نوع الغرفة/المكان */}
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>نوع الغرفة/المكان</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {Object.entries(roomTypes).map(([key, room]) => (
                    <div
                      key={key}
                      onClick={() => handleInputChange('roomType', key)}
                      style={{
                        padding: '1rem',
                        border: calculations.roomType === key ? '2px solid #059669' : '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        background: calculations.roomType === key ? '#f0fdf4' : 'white',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                        {/* عرض أيقونات رمزية لنوع الغرفة */}
                        {key === 'living' && '🛋️'}
                        {key === 'bedroom' && '🛏️'}
                        {key === 'kitchen' && '🍳'}
                        {key === 'office' && '💼'}
                        {key === 'hotel' && '🏨'}
                        {key === 'hospital' && '🏥'}
                      </div>
                      <h4 style={{ fontWeight: 'bold' }}>{room.name}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --- الخطوة 4: الخدمات الإضافية والنتائج --- */}
          {step === 4 && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Star size={24} />
                الخطوة 4: الخدمات الإضافية
              </h2>

              {/* قسم اختيار الخدمات الإضافية */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {Object.entries(additionalServices).map(([key, service]) => (
                  <div
                    key={key}
                    onClick={() => handleServiceToggle(key as keyof typeof additionalServices)}
                    style={{
                      padding: '1rem',
                      border: service.included
                        ? '2px solid #059669' // الحدود الخضراء للخدمات المشمولة
                        : calculations.selectedServices.includes(key as keyof typeof additionalServices)
                          ? '2px solid #059669' // الحدود الخضراء للخدمات المختارة
                          : '1px solid #e5e7eb', // الحدود الرمادية للخدمات غير المختارة
                      borderRadius: '0.5rem',
                      cursor: service.included ? 'default' : 'pointer', // لا يمكن النقر على الخدمات المشمولة
                      transition: 'all 0.3s ease',
                      background: service.included || calculations.selectedServices.includes(key as keyof typeof additionalServices) ? '#f0fdf4' : 'white',
                      opacity: service.included ? 0.8 : 1 // تقليل شفافية الخدمات المشمولة
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                          {service.name}
                          {service.included && (
                            <span style={{
                              fontSize: '0.8rem',
                              background: '#059669',
                              color: 'white',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '50px',
                              marginRight: '0.5rem'
                            }}>
                              مشمول
                            </span>
                          )}
                        </h4>
                        <p style={{
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                          color: service.included || service.price === 0 ? '#059669' : '#374151'
                        }}>
                          {service.price === 0 ? 'مجاني' : `${service.price} ريال`}
                        </p>
                      </div>
                      <div style={{ fontSize: '1.5rem' }}>
                        {(service.included || calculations.selectedServices.includes(key as keyof typeof additionalServices)) ? '✅' : '⭕'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* قسم عرض النتائج (ملخص التكلفة) */}
              <div style={{
                background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
                border: '2px solid #059669',
                borderRadius: '1rem',
                padding: '2rem'
              }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
                  ملخص التكلفة
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  {/* بطاقة المساحة الإجمالية */}
                  <div style={{ padding: '1rem', background: 'white', borderRadius: '0.5rem' }}>
                    <h4 style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>المساحة الإجمالية</h4>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
                      {results.totalArea.toFixed(1)} م²
                    </p>
                  </div>

                  {/* بطاقة تكلفة القماش */}
                  <div style={{ padding: '1rem', background: 'white', borderRadius: '0.5rem' }}>
                    <h4 style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>تكلفة القماش</h4>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
                      {formatPrice(results.fabricCost)}
                    </p>
                  </div>

                  {/* بطاقة تكلفة التركيب */}
                  <div style={{ padding: '1rem', background: 'white', borderRadius: '0.5rem' }}>
                    <h4 style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>تكلفة التركيب</h4>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
                      {formatPrice(results.installationCost)}
                    </p>
                  </div>

                  {/* بطاقة الخدمات الإضافية */}
                  <div style={{ padding: '1rem', background: 'white', borderRadius: '0.5rem' }}>
                    <h4 style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>الخدمات الإضافية</h4>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>
                      {formatPrice(results.servicesCost)}
                    </p>
                  </div>
                </div>

                {/* عرض الخصم إذا كان موجودًا */}
                {results.discountAmount > 0 && (
                  <div style={{
                    padding: '1rem',
                    background: '#fef3c7',
                    border: '1px solid #fbbf24',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    textAlign: 'center'
                  }}>
                    <p style={{ color: '#92400e', fontWeight: 'bold' }}>
                      🎉 تهانينا! حصلت على خصم 10% للطلبات أكثر من 10,000 ريال
                    </p>
                    <p style={{ color: '#92400e' }}>
                      قيمة الخصم: {formatPrice(results.discountAmount)}
                    </p>
                  </div>
                )}

                {/* قسم التكلفة النهائية الكبرى */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, #059669, #0d9488)',
                  color: 'white',
                  borderRadius: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <p style={{ fontSize: '1.2rem', margin: 0 }}>إجمالي التكلفة</p>
                    {results.discountAmount > 0 && (
                      <p style={{ fontSize: '1rem', opacity: 0.8, textDecoration: 'line-through', margin: 0 }}>
                        {formatPrice(results.totalCost)} {/* التكلفة قبل الخصم */}
                      </p>
                    )}
                  </div>
                  <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>
                    {formatPrice(results.finalCost)} {/* التكلفة النهائية بعد الخصم */}
                  </p>
                </div>

                {/* أزرار الإجراءات (عرض سعر، طباعة) */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={generateQuote}
                    style={{
                      background: 'linear-gradient(135deg, #fb923c, #f87171)',
                      color: 'white',
                      border: 'none',
                      padding: '1rem 2rem',
                      borderRadius: '50px',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(251, 146, 60, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Download size={20} />
                    احصل على عرض سعر
                  </button>

                  <button
                    onClick={() => window.print()} // وظيفة الطباعة المدمجة في المتصفح
                    style={{
                      background: 'white',
                      color: '#059669',
                      border: '2px solid #059669',
                      padding: '1rem 2rem',
                      borderRadius: '50px',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#059669';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.color = '#059669';
                    }}
                  >
                    <Printer size={20} />
                    طباعة التقدير
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* أزرار التنقل بين الخطوات (السابق/التالي) */}
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
                  transition: 'all 0.3s ease'
                }}
              >
                السابق
              </button>
            )}

            <div style={{ flex: 1 }} /> {/* عنصر مرن لدفع الأزرار إلى الأطراف */}

            {step < 4 && (
              <button
                onClick={() => setStep(step + 1)}
                // تعطيل زر "التالي" إذا كانت المدخلات المطلوبة فارغة
                disabled={
                  (step === 1 && (!calculations.width || !calculations.height)) ||
                  (step === 2 && !calculations.fabricType) ||
                  (step === 3 && (!calculations.curtainType || !calculations.roomType))
                }
                style={{
                  background: 'linear-gradient(135deg, #059669, #0d9488)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '50px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  opacity: ( // تقليل شفافية الزر عند تعطيله
                    (step === 1 && (!calculations.width || !calculations.height)) ||
                    (step === 2 && !calculations.fabricType) ||
                    (step === 3 && (!calculations.curtainType || !calculations.roomType))
                  ) ? 0.5 : 1,
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
          </div>
        </div>

        {/* --- مودال عرض السعر النهائي (Quote Modal) --- */}
        {showQuote && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  عرض السعر النهائي
                </h2>
                <p style={{ color: '#6b7280' }}>
                  تاريخ العرض: {new Date().toLocaleDateString('ar-SA')} {/* عرض التاريخ الحالي */}
                </p>
              </div>

              {/* تفاصيل المشروع في المودال */}
              <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
                <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>تفاصيل المشروع:</h3>
                <p>المساحة: **{results.totalArea.toFixed(1)}** متر مربع</p>
                <p>نوع القماش: **{fabricTypes[calculations.fabricType].name}**</p>
                <p>نوع الستائر: **{curtainTypes[calculations.curtainType].name}**</p>
                <p>نوع المكان: **{roomTypes[calculations.roomType].name}**</p>
                <p>الخدمات المختارة: **{calculations.selectedServices.map(s => additionalServices[s].name).join(', ')}**</p>
              </div>

              {/* عرض السعر النهائي في المودال */}
              <div style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', color: '#059669', marginBottom: '2rem' }}>
                {formatPrice(results.finalCost)}
              </div>

              {/* أزرار الإجراءات داخل المودال */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={() => setShowQuote(false)} // إغلاق المودال
                  style={{
                    background: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '50px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  إغلاق
                </button>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #059669, #0d9488)',
                    color: 'white',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '50px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  طلب عرض سعر رسمي
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}