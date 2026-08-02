import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Recursive data normalizer for handling PascalCase fields from Spring Boot Entities (@JsonProperty)
const normalizeData = (data) => {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(normalizeData);

  const normalized = { ...data };
  for (const key of Object.keys(data)) {
    const val = data[key];
    const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
    if (!(camelKey in normalized)) {
      normalized[camelKey] = val;
    }
    if (val && typeof val === 'object') {
      normalized[key] = normalizeData(val);
      if (camelKey !== key) {
        normalized[camelKey] = normalized[key];
      }
    }
  }

  // Nested helpers for NhanVien, PhongBan, ChucVu convenience fields
  const hoTen = normalized.hoTen || normalized.HoTen;
  const email = normalized.email || normalized.Email;
  const maNhanVien = normalized.maNhanVien || normalized.MaNhanVien;
  const tenPhongBan = normalized.tenPhongBan || normalized.TenPhongBan;
  const tenChucVu = normalized.tenChucVu || normalized.TenChucVu;
  const avatar = normalized.avatar || normalized.Avatar;

  if (tenPhongBan && !normalized.phongBan) {
    normalized.phongBan = { tenPhongBan, maPhongBan: normalized.maPhongBan || normalized.MaPhongBan };
  }
  if (tenChucVu && !normalized.chucVu) {
    normalized.chucVu = { tenChucVu, maChucVu: normalized.maChucVu || normalized.MaChucVu };
  }
  if (hoTen && !normalized.nhanVien) {
    normalized.nhanVien = {
      hoTen,
      email,
      avatar,
      maNhanVien,
      phongBan: normalized.phongBan,
      chucVu: normalized.chucVu
    };
  }

  return normalized;
};

// Request Interceptor: Attach JWT Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hrm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401/403 expired sessions & normalize PascalCase JSON keys
api.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = normalizeData(response.data);
    }
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('hrm_token');
      localStorage.removeItem('hrm_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (formData) => api.post('/auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getSalaryChart: (nam) => api.get('/dashboard/chart/salary', { params: { nam } }),
  getDepartmentChart: () => api.get('/dashboard/chart/department'),
};

export const employeeAPI = {
  getAll: (params) => api.get('/employees', { params }),
  getOne: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  uploadAvatar: (id, formData) => api.post(`/employees/${id}/avatar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const departmentAPI = {
  getAll: () => api.get('/departments'),
  getOne: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
};

export const positionAPI = {
  getAll: () => api.get('/positions'),
  getOne: (id) => api.get(`/positions/${id}`),
  create: (data) => api.post('/positions', data),
  update: (id, data) => api.put(`/positions/${id}`, data),
  delete: (id) => api.delete(`/positions/${id}`),
};

export const attendanceAPI = {
  checkIn: () => api.post('/attendance/check-in'),
  checkOut: () => api.post('/attendance/check-out'),
  adminCheckIn: (data) => api.post('/attendance/admin-check-in', data),
  getDailyList: (ngay) => api.get('/attendance/daily', { params: { ngay } }),
  getMyAttendance: (thang, nam) => api.get('/attendance/my-attendance', { params: { thang, nam } }),
};

export const scheduleAPI = {
  getAll: (params) => api.get('/schedule', { params }),
  assign: (data) => api.post('/schedule', data),
  update: (id, data) => api.put(`/schedule/${id}`, data),
  delete: (id) => api.delete(`/schedule/${id}`),
};

export const salaryAPI = {
  getAll: (params) => api.get('/salary', { params }),
  getOne: (id) => api.get(`/salary/${id}`),
  create: (data) => api.post('/salary', data),
  syncFromAttendance: (thang, nam) => api.post('/salary/sync', null, { params: { thang, nam } }),
  finalizeSalary: (id) => api.put(`/salary/${id}/finalize`),
  finalizeAll: (thang, nam) => api.put('/salary/finalize-all', null, { params: { thang, nam } }),
  getMySalary: (params) => api.get('/salary/my-salary', { params }),
  exportExcel: (params) => api.get('/salary/export/excel', { params, responseType: 'blob' }),
};

export const rewardAPI = {
  getAll: (params) => api.get('/rewards', { params }),
  create: (data) => api.post('/rewards', data),
  update: (id, data) => api.put(`/rewards/${id}`, data),
  delete: (id) => api.delete(`/rewards/${id}`),
};

export const leaveAPI = {
  getAll: (params) => api.get('/leaves', { params }),
  getMyLeaves: () => api.get('/leaves/my-leaves'),
  create: (data) => api.post('/leaves', data),
  updateStatus: (id, trangThai, lyDoTuChoi) => api.put(`/leaves/${id}/status`, null, { params: { trangThai, lyDoTuChoi } }),
};

export const reportAPI = {
  getSalaryReport: (nam) => api.get('/reports/salary', { params: { nam } }),
  getEmployeeReport: () => api.get('/reports/employees'),
  getTopEmployees: (thang, nam) => api.get('/reports/top-employees', { params: { thang, nam } }),
  getTotalCost: () => api.get('/reports/cost'),
};

export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  changePassword: (data) => api.put('/profile/password', data),
};

export default api;
