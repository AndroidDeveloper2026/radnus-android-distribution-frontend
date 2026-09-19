import { useState, useCallback, useEffect, useRef } from 'react';
import API from '../../services/API/api';

const useApprovalCounts = () => {
  const [counts, setCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchCounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        API.get('/api/approvals/pending'),
        API.get('/api/approvals/processed', { params: { status: 'approved' } }),
        API.get('/api/approvals/processed', { params: { status: 'rejected' } }),
      ]);

      if (!isMounted.current) return;

      setCounts({
        pending: (pendingRes.data || []).length,
        approved: (approvedRes.data || []).length,
        rejected: (rejectedRes.data || []).length,
      });
    } catch (err) {
      if (!isMounted.current) return;
      setError(err.response?.data?.message || 'Failed to load approval counts');
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  return { ...counts, loading, error, refetch: fetchCounts };
};

export default useApprovalCounts;
