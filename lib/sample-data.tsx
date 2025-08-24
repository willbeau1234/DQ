export const locations = [
  { id: 'DQ001', name: 'Downtown Store', address: '123 Main St' },
  { id: 'DQ002', name: 'Mall Location', address: '456 Shopping Center' },
  { id: 'DQ003', name: 'Drive-Thru Express', address: '789 Highway Ave' },
  { id: 'DQ004', name: 'Suburban Plaza', address: '321 Oak Street' },
  { id: 'DQ005', name: 'University Campus', address: '654 College Blvd' },
  { id: 'DQ006', name: 'Airport Terminal', address: '987 Terminal Dr' },
];

export const stores = [
  { id: 'DQ001', name: 'Downtown Store', revenue: 18500, transactions: 245 },
  { id: 'DQ002', name: 'Mall Location', revenue: 16200, transactions: 198 },
  { id: 'DQ003', name: 'Drive-Thru Express', revenue: 22100, transactions: 312 },
  { id: 'DQ004', name: 'Suburban Plaza', revenue: 14800, transactions: 176 },
  { id: 'DQ005', name: 'University Campus', revenue: 19300, transactions: 267 },
  { id: 'DQ006', name: 'Airport Terminal', revenue: 13400, transactions: 155 },
];

export const revenueData = [
  { date: '01/18', revenue: 18500 },
  { date: '01/19', revenue: 19200 },
  { date: '01/20', revenue: 17800 },
  { date: '01/21', revenue: 21100 },
  { date: '01/22', revenue: 20300 },
  { date: '01/23', revenue: 22500 },
  { date: '01/24', revenue: 24100 },
];

export const locationComparison = [
  { location: 'DQ001', revenue: 18500 },
  { location: 'DQ002', revenue: 16200 },
  { location: 'DQ003', revenue: 22100 },
  { location: 'DQ004', revenue: 14800 },
  { location: 'DQ005', revenue: 19300 },
  { location: 'DQ006', revenue: 13400 },
];

export const financialHealth = [
  { name: 'Revenue', value: 104300 },
  { name: 'Costs', value: 68200 },
];

export const dailyMetrics = {
  totalRevenue: 104300,
  totalTransactions: 1353,
  averageTicket: 77.12,
  laborCostPercentage: 18.2,
};

export const kpiData = {
  dailyRevenue: { value: '$4,850', trend: '+12%', status: 'positive' },
  laborCost: { value: '28.5%', trend: '-2.1%', status: 'positive' },
  customerSat: { value: '4.2/5', trend: '+0.3', status: 'positive' },
  driveThruTime: { value: '2:45', trend: '-15s', status: 'positive' },
};

export const sampleData = {
  stores,
  dailyMetrics,
  revenueData,
  locationComparison,
  financialHealth,
};