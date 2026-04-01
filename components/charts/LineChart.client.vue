<script setup lang="ts">
import { Line } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'

interface Props {
  labels: string[]
  data: number[]
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '売上',
})

const colorMode = useColorMode()

const gridColor = computed(() =>
  colorMode.value === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
)
const tickColor = computed(() =>
  colorMode.value === 'dark' ? '#9ca3af' : '#6b7280',
)

const chartData = computed<ChartData<'line'>>(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.label,
      data: props.data,
      borderColor: '#f43f5e',
      backgroundColor: 'rgba(244, 63, 94, 0.08)',
      borderWidth: 2,
      pointBackgroundColor: '#f43f5e',
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.4,
    },
  ],
}))

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ¥${ctx.parsed.y.toLocaleString()}`,
      },
    },
  },
  scales: {
    x: {
      grid: { color: gridColor.value },
      ticks: { color: tickColor.value, font: { size: 11 } },
    },
    y: {
      grid: { color: gridColor.value },
      ticks: {
        color: tickColor.value,
        font: { size: 11 },
        callback: (v) => `¥${Number(v).toLocaleString()}`,
      },
    },
  },
}))
</script>

<template>
  <Line :data="chartData" :options="chartOptions" />
</template>
