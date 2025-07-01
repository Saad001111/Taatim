const mysql = require('mysql2/promise');

async function initializeDatabase() {
  let connection;
  
  try {
    console.log('🔄 بدء تهيئة قاعدة البيانات...');
    
    // الاتصال الأولي بدون قاعدة بيانات
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      charset: 'utf8mb4'
    });
    
    console.log('✅ تم الاتصال بـ MySQL بنجاح');
    
    // إنشاء قاعدة البيانات
    await connection.query('CREATE DATABASE IF NOT EXISTS ta3teem_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✅ تم إنشاء/التحقق من قاعدة البيانات: ta3teem_website');
    
    // إغلاق الاتصال الأولي وفتح اتصال جديد مع قاعدة البيانات
    await connection.end();
    
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'ta3teem_website',
      charset: 'utf8mb4'
    });
    
    console.log('✅ تم الاتصال بقاعدة البيانات ta3teem_website');
    
    // إنشاء الجداول
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS contact_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('new', 'contacted', 'completed') DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ تم إنشاء جدول contact_requests');
    
    // إنشاء جدول الحجوزات
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id VARCHAR(50) UNIQUE NOT NULL,
        service_type ENUM('consultation', 'measurement', 'premium_consultation') NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        customer_email VARCHAR(255),
        customer_area VARCHAR(100) NOT NULL,
        customer_address TEXT,
        booking_date DATE NOT NULL,
        booking_time TIME NOT NULL,
        notes TEXT,
        status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_booking_date (booking_date),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ تم إنشاء جدول bookings');
    
    // إدراج البيانات التجريبية
    await connection.execute(`
      INSERT IGNORE INTO contact_requests (id, name, phone, message, status, created_at) VALUES
      (1, 'محمود سعد أحمد حليم', '0504428189', 'أريد تركيب ستائر لفيلا كاملة مع التصميم والتنفيذ', 'completed', '2024-12-01 10:30:00'),
      (2, 'فاطمة العلي', '0551234567', 'استفسار عن ستائر مكتبية لشركة تجارية', 'contacted', '2024-12-15 14:20:00'),
      (3, 'أحمد المطيري', '0509876543', 'أحتاج ستائر بلاك آوت لغرف النوم', 'new', '2024-12-20 09:15:00')
    `);
    console.log('✅ تم إدراج البيانات التجريبية');
    
    // إدراج بيانات الحجوزات التجريبية
    await connection.execute(`
      INSERT IGNORE INTO bookings (booking_id, service_type, customer_name, customer_phone, customer_area, booking_date, booking_time, status) VALUES
      ('BOOK001', 'consultation', 'علي السالم', '0512345678', 'الملقا', '2025-01-15', '10:00:00', 'confirmed'),
      ('BOOK002', 'measurement', 'نورا الزهراني', '0523456789', 'النرجس', '2025-01-16', '14:30:00', 'confirmed'),
      ('BOOK003', 'premium_consultation', 'خالد الدوسري', '0534567890', 'الياسمين', '2025-01-17', '11:00:00', 'pending')
    `);
    console.log('✅ تم إدراج حجوزات تجريبية');
    
    console.log('🎉 تم إنجاز تهيئة قاعدة البيانات بنجاح!');
    console.log('📊 البيانات التجريبية:');
    console.log('   - 3 طلبات تواصل');
    console.log('   - 3 حجوزات تجريبية');
    console.log('🔗 يمكنك الآن الوصول للأدمن على: http://localhost:3000/admin');
    
  } catch (error) {
    console.error('❌ خطأ في تهيئة قاعدة البيانات:', error);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 تلميح: تحقق من اسم المستخدم وكلمة المرور لـ MySQL');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 تلميح: تأكد من أن MySQL يعمل على المنفذ 3306');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('✅ تم إغلاق الاتصال بقاعدة البيانات');
    }
  }
}

initializeDatabase();