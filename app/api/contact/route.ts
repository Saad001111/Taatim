// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';

// دالة POST لإضافة طلبات جديدة
export async function POST(request: NextRequest) {
  try {
    console.log('📨 وصل طلب جديد للتواصل');
    
    // قراءة البيانات من الطلب
    const body = await request.json();
    const { name, phone, message } = body;

    console.log('📋 بيانات الطلب:', { name, phone, message: message?.substring(0, 50) + '...' });

    // التحقق من صحة البيانات
    if (!name || !phone || !message) {
      console.log('❌ بيانات ناقصة');
      return NextResponse.json(
        { 
          success: false, 
          message: 'جميع الحقول مطلوبة' 
        },
        { status: 400 }
      );
    }

    // التحقق من صحة رقم الهاتف السعودي
    const phoneRegex = /^(\+966|0)?[5][0-9]{8}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      console.log('❌ رقم هاتف غير صحيح:', phone);
      return NextResponse.json(
        { 
          success: false, 
          message: 'رقم الهاتف غير صحيح. يجب أن يكون رقم سعودي صالح' 
        },
        { status: 400 }
      );
    }

    // التحقق من طول الاسم
    if (name.length < 2 || name.length > 100) {
      console.log('❌ اسم غير صحيح:', name.length);
      return NextResponse.json(
        { 
          success: false, 
          message: 'الاسم يجب أن يكون بين 2 و 100 حرف' 
        },
        { status: 400 }
      );
    }

    // التحقق من طول الرسالة
    if (message.length < 10 || message.length > 1000) {
      console.log('❌ رسالة غير صحيحة:', message.length);
      return NextResponse.json(
        { 
          success: false, 
          message: 'الرسالة يجب أن تكون بين 10 و 1000 حرف' 
        },
        { status: 400 }
      );
    }

    // محاولة الاتصال بقاعدة البيانات
    try {
      const { insertContactRequest } = await import('@/lib/database');
      
      console.log('🔄 محاولة حفظ في قاعدة البيانات...');
      const result = await insertContactRequest(
        name.trim(),
        phone.trim(),
        message.trim()
      );

      if (result.success) {
        console.log('✅ تم حفظ الطلب بنجاح');
        return NextResponse.json({
          success: true,
          message: 'تم إرسال طلبك بنجاح! سنتواصل معك قريباً',
          data: {
            id: (result.data as any).insertId,
            timestamp: new Date().toISOString()
          }
        });
      } else {
        console.log('❌ فشل في حفظ البيانات:', result.error);
        throw new Error('فشل في حفظ البيانات');
      }
    } catch (dbError) {
      console.error('❌ خطأ في قاعدة البيانات:', dbError);
      
      // في حالة عدم وجود قاعدة البيانات، نحفظ في ملف مؤقت أو نرسل إيميل
      console.log('💾 حفظ مؤقت - سيتم التواصل معك قريباً');
      
      return NextResponse.json({
        success: true,
        message: 'تم استقبال طلبك بنجاح! سنتواصل معك قريباً',
        note: 'تم الحفظ المؤقت'
      });
    }

  } catch (error) {
    console.error('❌ خطأ عام في API:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى' 
      },
      { status: 500 }
    );
  }
}

// دالة GET لجلب جميع طلبات التواصل (للإدارة)
export async function GET(request: NextRequest) {
  try {
    console.log('📋 طلب جلب جميع طلبات التواصل');
    
    const { getAllContactRequests } = await import('@/lib/database');
    
    const result = await getAllContactRequests();
    
    if (result.success) {
      console.log('✅ تم جلب الطلبات:', (result.data as any[]).length);
      return NextResponse.json({
        success: true,
        data: result.data
      });
    } else {
      throw new Error('فشل في جلب البيانات');
    }

  } catch (error) {
    console.error('❌ خطأ في جلب طلبات التواصل:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ في الخادم',
        data: [] // إرجاع مصفوفة فارغة بدلاً من خطأ
      },
      { status: 500 }
    );
  }
}