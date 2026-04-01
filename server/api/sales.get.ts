export default defineEventHandler(() => {
  return {
    monthlySales: [
      { month: '2025/01', revenue: 320000, orders: 87 },
      { month: '2025/02', revenue: 520000, orders: 142 },
      { month: '2025/03', revenue: 380000, orders: 104 },
      { month: '2025/04', revenue: 350000, orders: 96 },
      { month: '2025/05', revenue: 420000, orders: 115 },
      { month: '2025/06', revenue: 310000, orders: 85 },
      { month: '2025/07', revenue: 290000, orders: 79 },
      { month: '2025/08', revenue: 340000, orders: 93 },
      { month: '2025/09', revenue: 380000, orders: 104 },
      { month: '2025/10', revenue: 450000, orders: 123 },
      { month: '2025/11', revenue: 480000, orders: 131 },
      { month: '2025/12', revenue: 680000, orders: 186 },
    ],
    categorySales: [
      { label: 'ホールケーキ', revenue: 2802000, orders: 628, color: '#f43f5e' },
      { label: '単品スイーツ', revenue: 1898000, orders: 1720, color: '#fb923c' },
    ],
    totalRevenue: 4700000,
    totalOrders: 2348,
  }
})
