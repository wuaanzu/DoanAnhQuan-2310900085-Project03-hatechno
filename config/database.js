// =====================================================
// HATECHNO HRM - Database Configuration
// Kết nối MySQL với connection pool
// =====================================================

const mysql = require('mysql2/promise');
require('dotenv').config();

// Tạo connection pool để quản lý kết nối hiệu quả
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'HATECHNO',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
    timezone: '+07:00'
});

// Kiểm tra kết nối khi khởi động
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Kết nối MySQL thành công! Database: ' + process.env.DB_NAME);
        connection.release();
    } catch (error) {
        console.error('❌ Lỗi kết nối MySQL:', error.message);
        process.exit(1);
    }
};

testConnection();

module.exports = pool;
