<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'

interface Props {
  labels: string[]
  data: number[]
  colors: string[]
}

const props = defineProps<Props>()

const chartData = computed<ChartData<'doughnut'>>(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.data,
      backgroundColor: props.colors,
      borderColor: 'transparent',
      borderWidth: 0,
      hoverOffset: 6,
    },
  ],
}))

const chartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 16,
        font: { size: 12 },
        usePointStyle: true,
        pointStyleWidth: 8,
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ¥${ctx.parsed.toLocaleString()}`,
      },
    },
  },
}
</script>

<template>
  <Doughnut :data="chartData" :options="chartOptions" />
</template>
