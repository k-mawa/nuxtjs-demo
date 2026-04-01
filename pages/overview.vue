<script setup lang="ts">
import type { OverviewData } from '~/types'

definePageMeta({ layout: 'dashboard' })

useSeoMeta({
  title: 'Overview | Patisserie Dashboard',
  description: '売上概要・KPI・月次売上グラフ',
})

const { data, pending } = await useAsyncData<OverviewData>('overview', () =>
  $fetch('/api/overview'),
)

const chartLabels = computed(() =>
  data.value?.monthlySales.map((d) => d.month.slice(5) + '月') ?? [],
)
const chartRevenue = computed(() =>
  data.value?.monthlySales.map((d) => d.revenue) ?? [],
)
</script>

<template>
  <div class="space-y-6">
    <!-- KPI cards -->
    <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div
        v-for="i in 4"
        :key="i"
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 h-28 animate-pulse"
      />
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <KpiCard
        v-for="kpi in data?.kpis"
        :key="kpi.id"
        :label="kpi.label"
        :value="kpi.value"
        :change="kpi.change"
        :change-label="kpi.changeLabel"
        :icon="kpi.icon"
        :color="kpi.color"
      />
    </div>

    <!-- Monthly revenue chart -->
    <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">月次売上推移</h2>
          <p class="text-xs text-gray-400 dark:text-gray-600 mt-0.5">2025年 年間</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-block w-3 h-3 rounded-full bg-primary-500" />
          <span class="text-xs text-gray-500 dark:text-gray-400">売上</span>
        </div>
      </div>
      <div class="h-64">
        <ClientOnly>
          <ChartsLineChart
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

    <!-- Monthly summary table -->
    <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100">月別サマリー</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
              <th class="text-left px-5 py-3 font-medium">月</th>
              <th class="text-right px-5 py-3 font-medium">売上</th>
              <th class="text-right px-5 py-3 font-medium">注文数</th>
              <th class="text-right px-5 py-3 font-medium">平均単価</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr
              v-for="row in data?.monthlySales"
              :key="row.month"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
            >
              <td class="px-5 py-3 text-gray-700 dark:text-gray-300">{{ row.month }}</td>
              <td class="px-5 py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                ¥{{ row.revenue.toLocaleString() }}
              </td>
              <td class="px-5 py-3 text-right text-gray-600 dark:text-gray-400">
                {{ row.orders.toLocaleString() }}
              </td>
              <td class="px-5 py-3 text-right text-gray-600 dark:text-gray-400">
                ¥{{ Math.round(row.revenue / row.orders).toLocaleString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
