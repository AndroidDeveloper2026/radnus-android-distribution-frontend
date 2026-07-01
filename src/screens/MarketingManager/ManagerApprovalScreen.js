import React from 'react';
import ApprovalDashboardScreen from '../Common/ApprovalDashboardScreen';

// Marketing Manager approves Distributors and Marketing Executives.
// Scope/authorization is enforced server-side based on the logged-in
// Marketing Manager's id (parentId match) — this screen just displays it.
const ManagerApprovalScreen = () => (
  <ApprovalDashboardScreen title="Distributor / Executive Approvals" />
);

export default ManagerApprovalScreen;
