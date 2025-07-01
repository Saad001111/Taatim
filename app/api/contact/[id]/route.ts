// app/api/contact/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

// PATCH - تحديث حالة طلب التواصل
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const { id } = params;
    
    // التحقق من صحة الحالة
    const validStatuses = ['new', 'contacted', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'حالة غير صحيحة' },
        { status: 400 }
      );
    }
    
    // تحديث الحالة في قاعدة البيانات
    await query(
      'UPDATE contact_requests SET status = ? WHERE id = ?',
      [status, parseInt(id)]
    );
    
    return NextResponse.json({
      success: true,
      message: 'تم تحديث الحالة بنجاح'
    });
    
  } catch (error) {
    console.error('خطأ في تحديث الحالة:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في التحديث' },
      { status: 500 }
    );
  }
}

// DELETE - حذف طلب التواصل
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // حذف الطلب من قاعدة البيانات
    await query(
      'DELETE FROM contact_requests WHERE id = ?',
      [parseInt(id)]
    );
    
    return NextResponse.json({
      success: true,
      message: 'تم حذف الطلب بنجاح'
    });
    
  } catch (error) {
    console.error('خطأ في حذف الطلب:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الحذف' },
      { status: 500 }
    );
  }
}