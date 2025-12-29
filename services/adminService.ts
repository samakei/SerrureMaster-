import { User, AdminLog, DailySales } from '../types';
import { MOCK_USER_ID } from '../constants';

// Mock Data
const MOCK_USERS: User[] = [
  { id: MOCK_USER_ID, email: 'client@test.com', name: 'Client Test', purchasedProductIds: ['p1_door_slammed'], role: 'user', status: 'active', joinedAt: '2023-10-15' },
  { id: 'u2', email: 'jean.dupont@gmail.com', name: 'Jean Dupont', purchasedProductIds: ['p1_door_slammed', 'p3_cylinder_replace'], role: 'user', status: 'active', joinedAt: '2023-10-18' },
  { id: 'u3', email: 'marie.curie@yahoo.fr', name: 'Marie Curie', purchasedProductIds: [], role: 'user', status: 'active', joinedAt: '2023-10-20' },
  { id: 'u4', email: 'hacker@bad.com', name: 'Hacker', purchasedProductIds: ['p4_security_audit'], role: 'user', status: 'blocked', joinedAt: '2023-10-21' },
  { id: 'u5', email: 'samakeissa161@gmail.com', name: 'Thomas Admin', purchasedProductIds: [], role: 'admin', status: 'active', joinedAt: '2023-01-01' },
];

const MOCK_LOGS: AdminLog[] = [
  { id: 'l1', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), ip: '192.168.1.45', action: 'DOWNLOAD_PDF', userId: 'u2', details: 'Guide Complet.pdf', severity: 'info' },
  { id: 'l2', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), ip: '45.23.12.99', action: 'LOGIN_FAILED', userId: 'unknown', details: 'Wrong password 3 times', severity: 'warning' },
  { id: 'l3', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), ip: '192.168.1.45', action: 'DOWNLOAD_PDF', userId: 'u2', details: 'Guide Complet.pdf', severity: 'info' },
  { id: 'l4', timestamp: new Date(Date.now() - 1000 * 60 * 46).toISOString(), ip: '192.168.1.45', action: 'DOWNLOAD_PDF', userId: 'u2', details: 'Guide Complet.pdf', severity: 'warning' },
  { id: 'l5', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), ip: '88.12.34.56', action: 'PURCHASE_SUCCESS', userId: 'u4', details: 'Product: p4_security_audit', severity: 'info' },
  { id: 'l6', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), ip: '10.0.0.1', action: 'ADMIN_LOGIN', userId: 'u5', details: 'Successful login', severity: 'info' },
];

export const getAdminStats = async () => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 600));

  const totalRevenue = MOCK_USERS.reduce((acc, user) => acc + (user.purchasedProductIds.length * 100), 0);
  const activeClients = MOCK_USERS.filter(u => u.role === 'user' && u.status === 'active').length;
  
  // Sales trend data (last 7 days simulation)
  const salesTrend: DailySales[] = Array.from({ length: 14 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    return {
      date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      amount: Math.floor(Math.random() * 5) * 100 // Random sales between 0 and 400€
    };
  });

  return {
    revenue: totalRevenue,
    clients: activeClients,
    conversionRate: 3.4, // Mocked percentage
    salesTrend,
    users: MOCK_USERS,
    logs: MOCK_LOGS
  };
};

export const blockUser = async (userId: string) => {
  console.log(`[ADMIN ACTION] Blocking user ${userId}`);
  return true;
};

export const grantFreeAccess = async (userId: string, productId: string) => {
  console.log(`[ADMIN ACTION] Granting access to ${productId} for user ${userId}`);
  return true;
};