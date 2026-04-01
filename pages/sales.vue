<script setup lang="ts">
import type { SalesData } from '~/types'

definePageMeta({ layout: 'dashboard' })

useSeoMeta({
  title: 'Sales | Patisserie Dashboard',
  description: '月次売上・カテゴリ別売上分析',
})

const store = useDashboardStore()

const { data, pending } = await useAsyncData<SalesData>('sales', () =>
  $fetch('/api/sales'),
)

const filteredMonthly = computed(() => {
  const all = data.value?.monthlySales ?? []
  return all.slice(-store.salesPeriod)
})

const chartLabels = computed(() =>
  filteredMonthly.value.map((d) => d.month.slice(5) + '月'),
)
const chartRevenue = computed(() =>
  filteredMonthly.value.map((d) => d.revenue),
)

const periodOptions: { label: string; value: 3 | 6 | 12 }[] = [
  { label: '3ヶ月', value: 3 },
  { label: '6ヶ月', value: 6 },
  { label: '12ヶ月', value: 12 },
]

const totalRevenueFiltered = computed(() =>
  filteredMonthly.value.reduce((sum, d) => sum + d.revenue, 0),
)
const totalOrdersFiltered = computed(() =>
  filteredMonthly.value.reduce((sum, d) => sum + d.orders, 0),
)
const avgOrderFiltered = computed(() =>
  totalOrdersFiltered.value > 0
    ? Math.round(totalRevenueFiltered.value / totalOrdersFiltered.value)
    : 0,
)
</script>

<template>
  <div class="space-y-6">
    <!-- Period filter -->
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-500 dark:text-gray-400">期間:</span>
      <div class="flex gap-1">
        <button
          v-for="opt in periodOptions"
          :key="opt.value"
          @click="store.salesPeriod = opt.value"
          class="px-3 py-1.5 text-sm rounded-lg font-medium transition-colors"
          :class="store.salesPeriod === opt.value
            ? 'bg-primary-500 text-white'
            : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- Summary stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">期間売上合計</p>
        <p class="text-xl font-bold text-gray-900 dark:text-gray-100">¥{{ totalRevenueFiltered.toLocaleString() }}</p>
      </div>
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">期間注文数</p>
        <p class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ totalOrdersFiltered.toLocaleString() }}</p>
      </div>
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">平均注文金額</p>
        <p class="text-xl font-bold text-gray-900 dark:text-gray-100">¥{{ avgOrderFiltered.toLocaleString() }}</p>
      </div>
    </div>

    <!-- Charts row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Bar chart -->
      <div class="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">月別売上</h2>
        <div class="h-64">
          <ClientOnly>
            <ChartsBarChart
              v-if="!pending"
              :labels="chartLabels"
              :data="chartRevenue"
              label="売上"
            />
            <template #fallback>
              <div class="h-full flex items-center justify-center">
                <div class="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>

      <!-- Doughnut chart -->
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">カテゴリ別売上比率</h2>
        <div class="h-64">
          <ClientOnly>
            <ChartsDoughnutChart
              v-if="!pending && data?.categorySales"
              :labels="data.categorySales.map((c) => c.label)"
              :data="data.categorySales.map((c) => c.revenue)"
              :colors="data.categorySales.map((c) => c.color)"
            />
            <template #fallback>
              <div class="h-full flex items-center justify-center">
                <div class="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>
    </div>

    <!-- Category breakdown table -->
    <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">カテゴリ別内訳</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
              <th class="text-left px-5 py-3 font-medium">カテゴリ</th>
              <th class="text-right px-5 py-3 font-medium">売上</th>
              <th class="text-right px-5 py-3 font-medium">注文数</th>
              <th class="text-right px-5 py-3 font-medium">売上比率</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr
              v-for="cat in data?.categorySales"
              :key="cat.label"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
            >
              <td class="px-5 py-3">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: cat.color }" />
                  <span class="text-gray-700 dark:text-gray-300">{{ cat.label }}</span>
                </div>
              </td>
              <td class="px-5 py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                ¥{{ cat.revenue.toLocaleString() }}
              </td>
              <td class="px-5 py-3 text-right text-gray-600 dark:text-gray-400">
                {{ cat.orders.toLocaleString() }}
              </td>
              <td class="px-5 py-3 text-right text-gray-600 dark:text-gray-400">
                {{ data?.totalRevenue
                  ? ((cat.revenue / data.totalRevenue) * 100).toFixed(1)
                  : '0' }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
