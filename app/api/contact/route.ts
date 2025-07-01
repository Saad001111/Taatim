// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

// GET - جلب جميع طلبات التواصل
export async function GET() {
  try {
    const contacts = await query(
      'SELECT * FROM contact_requests ORDER BY created_at DESC'
    );
    
    return NextResponse.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.error('خطأ في جلب طلبات التواصل:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في جلب البيانات' },
      { status: 500 }
    );
  }
}

// POST - إضافة طلب تواصل جديد
export async function POST(request: NextRequest) {
  try {
    const { name, phone, message } = await request.json();
    
    // التحقق من البيانات المطلوبة
    if (!name || !phone || !message) {
      return NextResponse.json(
        { success: false, message: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }
    
    // التحقق من صحة رقم الهاتف
    const phoneRegex = /^(\+966|0)?[5][0-9]{8}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { success: false, message: 'رقم الهاتف غير صحيح' },
        { status: 400 }
      );
    }
    
    // إدراج الطلب في قاعدة البيانات
    const result = await query(
      'INSERT INTO contact_requests (name, phone, message, status, created_at) VALUES (?, ?, ?, ?, NOW())',
      [name, phone, message, 'new']
    );
    
    return NextResponse.json({
      success: true,
      message: 'تم إرسال طلبك بنجاح! سنتواصل معك قريباً.',
      id: (result as any).insertId
    });
    
  } catch (error) {
    console.error('خطأ في إرسال طلب التواصل:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الإرسال. يرجى المحاولة مرة أخرى' },
      { status: 500 }
    );
  }
}