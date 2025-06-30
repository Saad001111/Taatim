// lib/database.ts
import mysql from 'mysql2/promise';

// إعدادات قاعدة البيانات
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ta3teem_website',
  charset: 'utf8mb4',
  connectTimeout: 10000,
  acquireTimeout: 10000,
};

console.log('🔧 إعدادات قاعدة البيانات:', {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  database: dbConfig.database,
  hasPassword: !!dbConfig.password
});

// إنشاء pool للاتصالات
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

// التحقق من الاتصال
export async function testConnection(): Promise<boolean> {
  try {
    console.log('🔍 اختبار الاتصال بقاعدة البيانات...');
    const connection = await pool.getConnection();
    await connection.ping();
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ خطأ في الاتصال بقاعدة البيانات:', error);
    if (error instanceof Error) {
      console.error('تفاصيل الخطأ:', error.message);
    }
    return false;
  }
}

// إضافة طلب تواصل جديد
export async function insertContactRequest(name: string, phone: string, message: string) {
  try {
    console.log('💾 محاولة حفظ طلب تواصل جديد...');
    
    // اختبار الاتصال أولاً
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('لا يمكن الاتصال بقاعدة البيانات');
    }

    const [result]: any = await pool.execute(
      'INSERT INTO contact_requests (name, phone, message) VALUES (?, ?, ?)',
      [name, phone, message]
    );
    
    console.log('✅ تم حفظ طلب التواصل - ID:', result.insertId);
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ خطأ في حفظ الطلب:', error);
    return { success: false, error };
  }
}

// جلب جميع طلبات التواصل
export async function getAllContactRequests() {
  try {
    console.log('📋 جلب جميع طلبات التواصل...');
    
    // اختبار الاتصال أولاً
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('لا يمكن الاتصال بقاعدة البيانات');
    }

    const [rows] = await pool.execute(
      'SELECT * FROM contact_requests ORDER BY created_at DESC'
    );
    
    console.log('✅ تم جلب الطلبات:', (rows as any).length);
    return { success: true, data: rows };
  } catch (error) {
    console.error('❌ خطأ في جلب الطلبات:', error);
    return { success: false, error };
  }
}

// تحديث حالة الطلب
export async function updateContactRequestStatus(id: number, status: string) {
  try {
    console.log('🔄 تحديث حالة الطلب:', id, 'إلى:', status);
    
    const [result] = await pool.execute(
      'UPDATE contact_requests SET status = ? WHERE id = ?',
      [status, id]
    );
    
    console.log('✅ تم تحديث حالة الطلب:', id);
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ خطأ في تحديث الحالة:', error);
    return { success: false, error };
  }
}

// حذف طلب
export async function deleteContactRequest(id: number) {
  try {
    console.log('🗑️ حذف الطلب:', id);
    
    const [result] = await pool.execute(
      'DELETE FROM contact_requests WHERE id = ?',
      [id]
    );
    
    console.log('✅ تم حذف الطلب:', id);
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ خطأ في حذف الطلب:', error);
    return { success: false, error };
  }
}

export default pool;