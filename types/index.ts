export interface KpiCard {
  id: string
  label: string
  value: string
  rawValue: number
  change: number
  changeLabel: string
  icon: string
  color: string
}

export interface MonthlySalesPoint {
  month: string
  revenue: number
  orders: number
}

export interface OverviewData {
  kpis: KpiCard[]
  monthlySales: MonthlySalesPoint[]
}

export interface CategorySalesItem {
  label: string
  revenue: number
  orders: number
  color: string
}

export interface SalesData {
  monthlySales: MonthlySalesPoint[]
  categorySales: CategorySalesItem[]
  totalRevenue: number
  totalOrders: number
}

export interface Product {
  id: number
  name: string
  category: 'ホール' | '単品'
  price: number
  stock: number
  sold: number
  imageUrl: string
  status: 'active' | 'inactive'
  rating: number
}

export type UserRole = 'admin' | 'staff' | 'customer'
export type UserStatus = 'active' | 'inactive'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
  joinedAt: string
  totalOrders: number
  totalSpent: number
  avatarUrl: string
}
