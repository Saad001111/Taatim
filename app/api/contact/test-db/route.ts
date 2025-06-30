// app/api/test-db/route.ts
// ملف لاختبار الاتصال بقاعدة البيانات

import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/database';

export async function GET() {
  try {
    console.log('🔍 اختبار الاتصال بقاعدة البيانات...');
    
    // تجربة الاتصال
    const isConnected = await testConnection();
    
    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: '✅ تم الاتصال بقاعدة البيانات بنجاح!',
        config: {
          host: process.env.DB_HOST || 'localhost',
          port: process.env.DB_PORT || '3306',
          user: process.env.DB_USER || 'root',
          database: process.env.DB_NAME || 'ta3teem_website'
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: '❌ فشل في الاتصال بقاعدة البيانات',
        config: {
          host: process.env.DB_HOST || 'localhost',
          port: process.env.DB_PORT || '3306',
          user: process.env.DB_USER || 'root',
          database: process.env.DB_NAME || 'ta3teem_website'
        }
      }, { status: 500 });
    }
  } catch (error) {
    console.error('خطأ في اختبار قاعدة البيانات:', error);
    return NextResponse.json({
      success: false,
      message: '❌ خطأ في اختبار قاعدة البيانات',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    }, { status: 500 });
  }
}