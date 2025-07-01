'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Phone, Calendar, CheckCircle, Clock, AlertTriangle, Trash2, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

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
        if (selectedRequest && selectedRequest.id === id) {
          setSelectedRequest({ ...selectedRequest, status });
        }
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
      case 'new': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'contacted': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
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
    <div style={{ minHeight: '100vh', background: '#f3f4f6', fontFamily: 'Noto Sans Arabic, sans-serif' }} dir="rtl">
      {/* Header */}
      <div style={{ background: 'white', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', borderBottom: '1px solid #e5e7eb', padding: '1.5rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>لوحة إدارة طلبات التواصل</h1>
              <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>إدارة ومتابعة طلبات العملاء</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={fetchRequests} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#1e3a8a', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '500' }}>
                <RefreshCw style={{ width: '16px', height: '16px' }} />
                تحديث
              </button>
              <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#f3f4f6', color: '#374151', padding: '0.5rem 1rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: '500' }}>
                <Home style={{ width: '16px', height: '16px' }} />
                الرئيسية
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* الإحصائيات */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '60px', height: '60px', background: '#1e3a8a', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '1rem' }}>
                <Eye style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>إجمالي الطلبات</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e3a8a', margin: 0 }}>{stats.total}</p>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '60px', height: '60px', background: '#dc2626', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '1rem' }}>
                <AlertTriangle style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>طلبات جديدة</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626', margin: 0 }}>{stats.new}</p>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '60px', height: '60px', background: '#f59e0b', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '1rem' }}>
                <Clock style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>تم التواصل</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b', margin: 0 }}>{stats.contacted}</p>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '60px', height: '60px', background: '#10b981', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '1rem' }}>
                <CheckCircle style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>مكتملة</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* فلاتر */}
        <div style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                border: '2px solid',
                borderColor: filter === 'all' ? '#1e3a8a' : '#e5e7eb',
                background: filter === 'all' ? '#1e3a8a' : 'white',
                color: filter === 'all' ? 'white' : '#374151',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              جميع الطلبات ({stats.total})
            </button>
            <button
              onClick={() => setFilter('new')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                border: '2px solid',
                borderColor: filter === 'new' ? '#dc2626' : '#e5e7eb',
                background: filter === 'new' ? '#dc2626' : 'white',
                color: filter === 'new' ? 'white' : '#374151',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              جديدة ({stats.new})
            </button>
            <button
              onClick={() => setFilter('contacted')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                border: '2px solid',
                borderColor: filter === 'contacted' ? '#f59e0b' : '#e5e7eb',
                background: filter === 'contacted' ? '#f59e0b' : 'white',
                color: filter === 'contacted' ? 'white' : '#374151',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              تم التواصل ({stats.contacted})
            </button>
            <button
              onClick={() => setFilter('completed')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                border: '2px solid',
                borderColor: filter === 'completed' ? '#10b981' : '#e5e7eb',
                background: filter === 'completed' ? '#10b981' : 'white',
                color: filter === 'completed' ? 'white' : '#374151',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              مكتملة ({stats.completed})
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* قائمة الطلبات */}
          <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>طلبات التواصل</h2>
            </div>
            
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <div style={{ width: '2rem', height: '2rem', border: '2px solid #e5e7eb', borderTop: '2px solid #1e3a8a', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                  <p style={{ color: '#6b7280' }}>جاري التحميل...</p>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                  لا توجد طلبات {filter !== 'all' ? getStatusText(filter) : ''}
                </div>
              ) : (
                filteredRequests.map((request) => (
                  <div
                    key={request.id}
                    onClick={() => setSelectedRequest(request)}
                    style={{
                      padding: '1.5rem',
                      borderBottom: '1px solid #f3f4f6',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background: selectedRequest?.id === request.id ? '#ecfdf5' : 'white',
                      borderRight: selectedRequest?.id === request.id ? '4px solid #1e3a8a' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedRequest?.id !== request.id) {
                        e.currentTarget.style.background = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedRequest?.id !== request.id) {
                        e.currentTarget.style.background = 'white';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          {getStatusIcon(request.status)}
                          <h3 style={{ fontWeight: '600', color: '#111827', margin: 0 }}>{request.name}</h3>
                        </div>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0' }}>
                          <Phone style={{ width: '12px', height: '12px' }} />
                          {request.phone}
                        </p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: '#9ca3af', margin: 0 }}>
                          <Calendar style={{ width: '12px', height: '12px' }} />
                          {formatDate(request.created_at)}
                        </p>
                      </div>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.75rem',
                        borderRadius: '9999px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        background: request.status === 'new' ? '#fee2e2' : request.status === 'contacted' ? '#fef3c7' : '#dcfce7',
                        color: request.status === 'new' ? '#991b1b' : request.status === 'contacted' ? '#92400e' : '#065f46',
                        border: `1px solid ${request.status === 'new' ? 'rgba(239, 68, 68, 0.2)' : request.status === 'contacted' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                      }}>
                        {getStatusText(request.status)}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem', lineHeight: 1.4 }}>
                      {request.message.substring(0, 100)}...
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* تفاصيل الطلب */}
          <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>تفاصيل الطلب</h2>
            </div>
            
            {selectedRequest ? (
              <div style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>اسم العميل</label>
                  <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>{selectedRequest.name}</p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>رقم الهاتف</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                    <a href={`tel:${selectedRequest.phone}`} style={{ color: '#1e3a8a', textDecoration: 'none', fontWeight: '500' }}>
                      {selectedRequest.phone}
                    </a>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>تاريخ الطلب</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                    <span>{formatDate(selectedRequest.created_at)}</span>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>الحالة الحالية</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {getStatusIcon(selectedRequest.status)}
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.75rem',
                      borderRadius: '9999px',
                      fontWeight: '600',
                      background: selectedRequest.status === 'new' ? '#fee2e2' : selectedRequest.status === 'contacted' ? '#fef3c7' : '#dcfce7',
                      color: selectedRequest.status === 'new' ? '#991b1b' : selectedRequest.status === 'contacted' ? '#92400e' : '#065f46'
                    }}>
                      {getStatusText(selectedRequest.status)}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>تفاصيل المشروع</label>
                  <div style={{ background: '#f9fafb', borderRadius: '0.5rem', padding: '1rem' }}>
                    <p style={{ color: '#111827', whiteSpace: 'pre-wrap', lineHeight: 1.6, margin: 0 }}>{selectedRequest.message}</p>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>تحديث الحالة</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => updateStatus(selectedRequest.id, 'new')}
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '500',
                        background: selectedRequest.status === 'new' ? '#dc2626' : '#f3f4f6',
                        color: selectedRequest.status === 'new' ? 'white' : '#374151'
                      }}
                    >
                      جديد
                    </button>
                    <button
                      onClick={() => updateStatus(selectedRequest.id, 'contacted')}
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '500',
                        background: selectedRequest.status === 'contacted' ? '#f59e0b' : '#f3f4f6',
                        color: selectedRequest.status === 'contacted' ? 'white' : '#374151'
                      }}
                    >
                      تم التواصل
                    </button>
                    <button
                      onClick={() => updateStatus(selectedRequest.id, 'completed')}
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '500',
                        background: selectedRequest.status === 'completed' ? '#10b981' : '#f3f4f6',
                        color: selectedRequest.status === 'completed' ? 'white' : '#374151'
                      }}
                    >
                      مكتمل
                    </button>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <a href={`tel:${selectedRequest.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#1e3a8a', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: '500' }}>
                      <Phone style={{ width: '16px', height: '16px' }} />
                      اتصال
                    </a>
                    <button
                      onClick={() => deleteRequest(selectedRequest.id)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#dc2626', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '500' }}
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                اختر طلباً لعرض التفاصيل
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}