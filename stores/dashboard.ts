import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', () => {
  const salesPeriod = ref<3 | 6 | 12>(12)
  const productCategory = ref<'全て' | 'ホール' | '単品'>('全て')
  const productSortBy = ref<'name' | 'price' | 'sold' | 'stock'>('sold')
  const productSortOrder = ref<'asc' | 'desc'>('desc')
  const productSearch = ref('')
  const userStatusFilter = ref<'全て' | 'active' | 'inactive'>('全て')
  const userRoleFilter = ref<'全て' | 'admin' | 'staff' | 'customer'>('全て')

  return {
    salesPeriod,
    productCategory,
    productSortBy,
    productSortOrder,
    productSearch,
    userStatusFilter,
    userRoleFilter,
  }
})
