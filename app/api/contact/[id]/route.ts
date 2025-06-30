// app/api/contact/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { updateContactRequestStatus, deleteContactRequest } from '@/lib/database';

// تحديث حالة طلب التواصل
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { status } = body;

    // التحقق من صحة البيانات
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'معرف الطلب غير صحيح' },
        { status: 400 }
      );
    }

    if (!status || !['new', 'contacted', 'completed'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'حالة الطلب غير صحيحة' },
        { status: 400 }
      );
    }

    // تحديث الحالة في قاعدة البيانات
    const result = await updateContactRequestStatus(id, status);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'تم تحديث حالة الطلب بنجاح'
      });
    } else {
      throw new Error('فشل في تحديث حالة الطلب');
    }

  } catch (error) {
    console.error('خطأ في تحديث حالة الطلب:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

// حذف طلب التواصل
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // التحقق من صحة البيانات
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'معرف الطلب غير صحيح' },
        { status: 400 }
      );
    }

    // حذف الطلب من قاعدة البيانات
    const result = await deleteContactRequest(id);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'تم حذف الطلب بنجاح'
      });
    } else {
      throw new Error('فشل في حذف الطلب');
    }

  } catch (error) {
    console.error('خطأ في حذف الطلب:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}