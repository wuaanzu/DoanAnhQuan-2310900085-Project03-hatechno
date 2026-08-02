// =====================================================
// HATECHNO HRM - Utility Functions
// Dùng chung toàn hệ thống
// =====================================================

const Utils = {

    /**
     * Format số tiền sang VND
     */
    formatMoney: (amount) => {
        if (amount === null || amount === undefined) return '0 ₫';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(amount);
    },

    /**
     * Format số không có ký hiệu tiền
     */
    formatNumber: (n) => {
        if (!n) return '0';
        return new Intl.NumberFormat('vi-VN').format(n);
    },

    /**
     * Format ngày sang dd/MM/yyyy
     */
    formatDate: (dateStr) => {
        if (!dateStr) return '--';
        const d = new Date(dateStr);
        return d.toLocaleDateString('vi-VN');
    },

    /**
     * Format ngày giờ
     */
    formatDateTime: (dateStr) => {
        if (!dateStr) return '--';
        const d = new Date(dateStr);
        return d.toLocaleString('vi-VN');
    },

    /**
     * Lấy avatar URL hoặc placeholder text
     */
    getAvatarHtml: (avatar, name, size = 36) => {
        if (avatar) {
            return `<img src="${avatar}" class="employee-avatar" style="width:${size}px;height:${size}px" alt="${name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                    <div class="employee-avatar-placeholder" style="width:${size}px;height:${size}px;display:none">${(name || '?')[0].toUpperCase()}</div>`;
        }
        return `<div class="employee-avatar-placeholder" style="width:${size}px;height:${size}px">${(name || '?')[0].toUpperCase()}</div>`;
    },

    /**
     * Badge trạng thái nhân viên
     */
    statusBadge: (status) => {
        const map = {
            'DangLam': '<span class="badge badge-active"><i class="fa-solid fa-circle" style="font-size:6px"></i> Đang làm</span>',
            'NghiViec': '<span class="badge badge-inactive"><i class="fa-solid fa-circle" style="font-size:6px"></i> Nghỉ việc</span>'
        };
        return map[status] || status;
    },

    /**
     * Badge trạng thái đơn nghỉ phép
     */
    leaveBadge: (status) => {
        const map = {
            'ChoDuyet': '<span class="badge badge-pending">⏳ Chờ duyệt</span>',
            'DaDuyet': '<span class="badge badge-approved">✅ Đã duyệt</span>',
            'TuChoi': '<span class="badge badge-rejected">❌ Từ chối</span>'
        };
        return map[status] || status;
    },

    /**
     * Badge loại khen thưởng
     */
    rewardBadge: (loai) => {
        const map = {
            'Thuong': '<span class="badge badge-bonus">🏆 Thưởng</span>',
            'KyLuat': '<span class="badge badge-discipline">⚠️ Kỷ luật</span>'
        };
        return map[loai] || loai;
    },

    /**
     * Badge quyền
     */
    roleBadge: (tenQuyen) => {
        const map = {
            'Admin': '<span class="badge badge-admin">👑 Admin</span>',
            'NhanSu': '<span class="badge badge-manager">👔 Nhân sự</span>',
            'NhanVien': '<span class="badge badge-employee">👤 Nhân viên</span>'
        };
        return map[tenQuyen] || tenQuyen;
    },

    /**
     * Debounce
     */
    debounce: (fn, delay = 400) => {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn(...args), delay);
        };
    },

    /**
     * Escape HTML chống XSS
     */
    escHtml: (str) => {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    },

    /**
     * Lấy giá trị từ URL params
     */
    getParam: (key) => {
        return new URLSearchParams(window.location.search).get(key);
    },

    /**
     * Xây dựng query string từ object
     */
    buildQuery: (obj) => {
        return Object.entries(obj)
            .filter(([, v]) => v !== '' && v !== null && v !== undefined)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
            .join('&');
    }
};

// Xuất toàn cục
window.Utils = Utils;
