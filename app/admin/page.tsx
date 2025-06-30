'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Phone, Calendar, CheckCircle, Clock, AlertCircle, Trash2, RefreshCw } from 'lucide-react';

interface ContactRequest {
  id: number;
  name: string;
  phone: string;
  message: string;
  status: 'new' | 'contacted' | 'completed';
  created_at: string;
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'completed'>('all');

  // جلب طلبات التواصل
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contact');
      const result = await response.json();
      
      if (result.success) {
        setRequests(result.data);
      } else {
        console.error('فشل في جلب البيانات');
      }
    } catch (error) {
      console.error('خطأ في جلب البيانات:', error);
    } finally {
      setLoading(false);
    }
  };

  // تحديث حالة الطلب
  const updateStatus = async (id: number, status: 'new' | 'contacted' | 'completed') => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setRequests(prev =>
          prev.map(req =>
            req.id === id ? { ...req, status } : req
          )
        );
      }
    } catch (error) {
      console.error('خطأ في تحديث الحالة:', error);
    }
  };

  // حذف طلب
  const deleteRequest = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;

    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRequests(prev => prev.filter(req => req.id !== id));
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error('خطأ في حذف الطلب:', error);
    }
  };

  // تحميل البيانات عند بداية الصفحة
  useEffect(() => {
    fetchRequests();
  }, []);

  // تصفية الطلبات حسب الحالة
  const filteredRequests = requests.filter(req => 
    filter === 'all' || req.status === filter
  );

  // إحصائيات سريعة
  const stats = {
    total: requests.length,
    new: requests.filter(r => r.status === 'new').length,
    contacted: requests.filter(r => r.status === 'contacted').length,
    completed: requests.filter(r => r.status === 'completed').length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle style={{ width: '16px', height: '16px', color: '#ef4444' }} />;
      case 'contacted': return <Clock style={{ width: '16px', height: '16px', color: '#eab308' }} />;
      case 'completed': return <CheckCircle style={{ width: '16px', height: '16px', color: '#22c55e' }} />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'جديد';
      case 'contacted': return 'تم التواصل';
      case 'completed': return 'مكتمل';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: 'Noto Sans Arabic', sans-serif;
          background-color: #f3f4f6;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        .header-bg {
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border-bottom: 1px solid #e5e7eb;
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 0;
        }
        
        .title {
          font-size: 2rem;
          font-weight: bold;
          color: #111827;
          margin: 0;
        }
        
        .subtitle {
          color: #6b7280;
          margin-top: 0.25rem;
        }
        
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #059669;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s;
        }
        
        .btn:hover {
          background: #047857;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .stat-card {
          background: white;
          border-radius: 0.5rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .stat-header {
          display: flex;
          align-items: center;
        }
        
        .stat-icon {
          padding: 0.5rem;
          border-radius: 0.5rem;
          margin-left: 1rem;
        }
        
        .icon-blue { background: #dbeafe; }
        .icon-red { background: #fee2e2; }
        .icon-yellow { background: #fef3c7; }
        .icon-green { background: #dcfce7; }
        
        .stat-text {
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }
        
        .stat-number {
          font-size: 1.5rem;
          font-weight: bold;
          color: #111827;
        }
        
        .filters {
          background: white;
          border-radius: 0.5rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 1.5rem;
        }
        
        .filter-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .filter-btn {
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s;
        }
        
        .filter-active {
          color: white;
        }
        
        .filter-inactive {
          background: #f3f4f6;
          color: #374151;
        }
        
        .filter-inactive:hover {
          background: #e5e7eb;
        }
        
        .main-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        
        @media (max-width: 1024px) {
          .main-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .requests-panel, .details-panel {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .panel-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .panel-title {
          font-size: 1.25rem;
          font-weight: bold;
          color: #111827;
        }
        
        .requests-list {
          max-height: 400px;
          overflow-y: auto;
        }
        
        .request-item {
          padding: 1rem;
          border-bottom: 1px solid #f3f4f6;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .request-item:hover {
          background: #f9fafb;
        }
        
        .request-selected {
          background: #ecfdf5;
          border-right: 4px solid #059669;
        }
        
        .request-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }
        
        .request-name {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }
        
        .name-text {
          font-weight: 600;
          color: #111827;
        }
        
        .contact-info {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }
        
        .date-info {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          color: #9ca3af;
        }
        
        .status-badge {
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          border-radius: 9999px;
          font-weight: 600;
        }
        
        .status-new {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .status-contacted {
          background: #fef3c7;
          color: #92400e;
        }
        
        .status-completed {
          background: #dcfce7;
          color: #166534;
        }
        
        .message-preview {
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 0.5rem;
          line-height: 1.4;
        }
        
        .details-content {
          padding: 1.5rem;
        }
        
        .detail-item {
          margin-bottom: 1rem;
        }
        
        .detail-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.25rem;
        }
        
        .detail-value {
          font-size: 1rem;
          color: #111827;
        }
        
        .detail-large {
          font-size: 1.125rem;
          font-weight: 600;
        }
        
        .detail-flex {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .phone-link {
          color: #059669;
          text-decoration: none;
        }
        
        .phone-link:hover {
          text-decoration: underline;
        }
        
        .status-current {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .message-box {
          background: #f9fafb;
          border-radius: 0.5rem;
          padding: 1rem;
        }
        
        .message-text {
          color: #111827;
          white-space: pre-wrap;
          line-height: 1.6;
        }
        
        .status-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        .status-btn {
          padding: 0.25rem 0.75rem;
          font-size: 0.875rem;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s;
        }
        
        .actions {
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
          margin-top: 1rem;
        }
        
        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }
        
        .btn-call {
          background: #059669;
          color: white;
        }
        
        .btn-call:hover {
          background: #047857;
        }
        
        .btn-delete {
          background: #dc2626;
          color: white;
        }
        
        .btn-delete:hover {
          background: #b91c1c;
        }
        
        .empty-state {
          padding: 1.5rem;
          text-align: center;
          color: #6b7280;
        }
        
        .loading {
          padding: 1.5rem;
          text-align: center;
        }
        
        .spinner {
          display: inline-block;
          width: 2rem;
          height: 2rem;
          border: 2px solid #e5e7eb;
          border-top: 2px solid #059669;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 0.5rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .loading-text {
          color: #6b7280;
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f3f4f6' }} dir="rtl">
        {/* Header */}
        <div className="header-bg">
          <div className="container">
            <div className="header-content">
              <div>
                <h1 className="title">لوحة إدارة طلبات التواصل</h1>
                <p className="subtitle">إدارة ومتابعة طلبات العملاء</p>
              </div>
              <button onClick={fetchRequests} className="btn">
                <RefreshCw style={{ width: '16px', height: '16px' }} />
                تحديث
              </button>
            </div>
          </div>
        </div>

        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          {/* الإحصائيات */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon icon-blue">
                  <Eye style={{ width: '24px', height: '24px', color: '#2563eb' }} />
                </div>
                <div>
                  <p className="stat-text">إجمالي الطلبات</p>
                  <p className="stat-number">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon icon-red">
                  <AlertCircle style={{ width: '24px', height: '24px', color: '#dc2626' }} />
                </div>
                <div>
                  <p className="stat-text">طلبات جديدة</p>
                  <p className="stat-number">{stats.new}</p>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon icon-yellow">
                  <Clock style={{ width: '24px', height: '24px', color: '#d97706' }} />
                </div>
                <div>
                  <p className="stat-text">تم التواصل</p>
                  <p className="stat-number">{stats.contacted}</p>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon icon-green">
                  <CheckCircle style={{ width: '24px', height: '24px', color: '#16a34a' }} />
                </div>
                <div>
                  <p className="stat-text">مكتملة</p>
                  <p className="stat-number">{stats.completed}</p>
                </div>
              </div>
            </div>
          </div>

          {/* فلاتر */}
          <div className="filters">
            <div className="filter-buttons">
              <button
                onClick={() => setFilter('all')}
                className={`filter-btn ${filter === 'all' ? 'filter-active' : 'filter-inactive'}`}
                style={{
                  background: filter === 'all' ? '#059669' : '#f3f4f6',
                  color: filter === 'all' ? 'white' : '#374151'
                }}
              >
                جميع الطلبات ({stats.total})
              </button>
              <button
                onClick={() => setFilter('new')}
                className={`filter-btn ${filter === 'new' ? 'filter-active' : 'filter-inactive'}`}
                style={{
                  background: filter === 'new' ? '#dc2626' : '#f3f4f6',
                  color: filter === 'new' ? 'white' : '#374151'
                }}
              >
                جديدة ({stats.new})
              </button>
              <button
                onClick={() => setFilter('contacted')}
                className={`filter-btn ${filter === 'contacted' ? 'filter-active' : 'filter-inactive'}`}
                style={{
                  background: filter === 'contacted' ? '#d97706' : '#f3f4f6',
                  color: filter === 'contacted' ? 'white' : '#374151'
                }}
              >
                تم التواصل ({stats.contacted})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`filter-btn ${filter === 'completed' ? 'filter-active' : 'filter-inactive'}`}
                style={{
                  background: filter === 'completed' ? '#16a34a' : '#f3f4f6',
                  color: filter === 'completed' ? 'white' : '#374151'
                }}
              >
                مكتملة ({stats.completed})
              </button>
            </div>
          </div>

          <div className="main-grid">
            {/* قائمة الطلبات */}
            <div className="requests-panel">
              <div className="panel-header">
                <h2 className="panel-title">طلبات التواصل</h2>
              </div>
              
              <div className="requests-list">
                {loading ? (
                  <div className="loading">
                    <div className="spinner"></div>
                    <p className="loading-text">جاري التحميل...</p>
                  </div>
                ) : filteredRequests.length === 0 ? (
                  <div className="empty-state">
                    لا توجد طلبات {filter !== 'all' ? getStatusText(filter) : ''}
                  </div>
                ) : (
                  filteredRequests.map((request) => (
                    <div
                      key={request.id}
                      onClick={() => setSelectedRequest(request)}
                      className={`request-item ${selectedRequest?.id === request.id ? 'request-selected' : ''}`}
                    >
                      <div className="request-header">
                        <div style={{ flex: 1 }}>
                          <div className="request-name">
                            {getStatusIcon(request.status)}
                            <h3 className="name-text">{request.name}</h3>
                          </div>
                          <p className="contact-info">
                            <Phone style={{ width: '12px', height: '12px' }} />
                            {request.phone}
                          </p>
                          <p className="date-info">
                            <Calendar style={{ width: '12px', height: '12px' }} />
                            {formatDate(request.created_at)}
                          </p>
                        </div>
                        <span className={`status-badge status-${request.status}`}>
                          {getStatusText(request.status)}
                        </span>
                      </div>
                      <p className="message-preview">
                        {request.message.substring(0, 100)}...
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* تفاصيل الطلب */}
            <div className="details-panel">
              <div className="panel-header">
                <h2 className="panel-title">تفاصيل الطلب</h2>
              </div>
              
              {selectedRequest ? (
                <div className="details-content">
                  <div className="detail-item">
                    <label className="detail-label">اسم العميل</label>
                    <p className="detail-value detail-large">{selectedRequest.name}</p>
                  </div>

                  <div className="detail-item">
                    <label className="detail-label">رقم الهاتف</label>
                    <p className="detail-value detail-flex">
                      <Phone style={{ width: '16px', height: '16px' }} />
                      <a href={`tel:${selectedRequest.phone}`} className="phone-link">
                        {selectedRequest.phone}
                      </a>
                    </p>
                  </div>

                  <div className="detail-item">
                    <label className="detail-label">تاريخ الطلب</label>
                    <p className="detail-value detail-flex">
                      <Calendar style={{ width: '16px', height: '16px' }} />
                      {formatDate(selectedRequest.created_at)}
                    </p>
                  </div>

                  <div className="detail-item">
                    <label className="detail-label">الحالة الحالية</label>
                    <div className="status-current">
                      {getStatusIcon(selectedRequest.status)}
                      <span className={`status-badge status-${selectedRequest.status}`}>
                        {getStatusText(selectedRequest.status)}
                      </span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <label className="detail-label">تفاصيل المشروع</label>
                    <div className="message-box">
                      <p className="message-text">{selectedRequest.message}</p>
                    </div>
                  </div>

                  <div className="detail-item">
                    <label className="detail-label">تحديث الحالة</label>
                    <div className="status-buttons">
                      <button
                        onClick={() => updateStatus(selectedRequest.id, 'new')}
                        className="status-btn"
                        style={{
                          background: selectedRequest.status === 'new' ? '#dc2626' : '#fee2e2',
                          color: selectedRequest.status === 'new' ? 'white' : '#991b1b'
                        }}
                      >
                        جديد
                      </button>
                      <button
                        onClick={() => updateStatus(selectedRequest.id, 'contacted')}
                        className="status-btn"
                        style={{
                          background: selectedRequest.status === 'contacted' ? '#d97706' : '#fef3c7',
                          color: selectedRequest.status === 'contacted' ? 'white' : '#92400e'
                        }}
                      >
                        تم التواصل
                      </button>
                      <button
                        onClick={() => updateStatus(selectedRequest.id, 'completed')}
                        className="status-btn"
                        style={{
                          background: selectedRequest.status === 'completed' ? '#16a34a' : '#dcfce7',
                          color: selectedRequest.status === 'completed' ? 'white' : '#166534'
                        }}
                      >
                        مكتمل
                      </button>
                    </div>
                  </div>

                  <div className="actions">
                    <div className="action-buttons">
                      <a href={`tel:${selectedRequest.phone}`} className="btn btn-call">
                        <Phone style={{ width: '16px', height: '16px' }} />
                        اتصال
                      </a>
                      <button
                        onClick={() => deleteRequest(selectedRequest.id)}
                        className="btn btn-delete"
                      >
                        <Trash2 style={{ width: '16px', height: '16px' }} />
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  اختر طلباً لعرض التفاصيل
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}