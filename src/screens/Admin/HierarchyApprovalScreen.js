import React from 'react';
import ApprovalDashboardScreen from '../Common/ApprovalDashboardScreen';

// Admin approves Radnus Employees and Marketing Managers.
// (Radnus-specific legacy screen/endpoints under /api/admin remain
// untouched; this screen additionally surfaces Marketing Manager
// approvals using the new generalized /api/approvals endpoints.)
const HierarchyApprovalScreen = () => (
  <ApprovalDashboardScreen title="Radnus / Managers Approvals" /> //Pending Approvals (Radnus & Managers)
);

export default HierarchyApprovalScreen;
