<script setup lang="ts">
import type { Product } from '~/types'

definePageMeta({ layout: 'dashboard' })

useSeoMeta({
  title: 'Products | Patisserie Dashboard',
  description: '商品一覧・在庫・販売数管理',
})

const store = useDashboardStore()

const { data: products, pending } = await useAsyncData<Product[]>('products', () =>
  $fetch('/api/products'),
)

const categoryOptions = ['全て', 'ホール', '単品'] as const
const sortOptions = [
  { label: '販売数', value: 'sold' },
  { label: '価格', value: 'price' },
  { label: '在庫数', value: 'stock' },
  { label: '商品名', value: 'name' },
] as const

const filteredProducts = computed(() => {
  let list = products.value ?? []

  if (store.productCategory !== '全て') {
    list = list.filter((p) => p.category === store.productCategory)
  }

  if (store.productSearch.trim()) {
    const q = store.productSearch.trim().toLowerCase()
    list = list.filter((p) => p.name.toLowerCase().includes(q))
  }

  list = [...list].sort((a, b) => {
    const key = store.productSortBy as keyof Product
    const av = a[key] as string | number
    const bv = b[key] as string | number
    if (av < bv) return store.productSortOrder === 'asc' ? -1 : 1
    if (av > bv) return store.productSortOrder === 'asc' ? 1 : -1
    return 0
  })

  return list
})

const toggleSort = (key: typeof store.productSortBy) => {
  if (store.productSortBy === key) {
    store.productSortOrder = store.productSortOrder === 'asc' ? 'desc' : 'asc'
  } else {
    store.productSortBy = key
    store.productSortOrder = 'desc'
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-3">
      <!-- Search -->
      <div class="relative flex-1 min-w-48 max-w-72">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          v-model="store.productSearch"
          type="text"
          placeholder="商品名で検索..."
          class="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
        />
      </div>

      <!-- Category filter -->
      <div class="flex gap-1">
        <button
          v-for="cat in categoryOptions"
          :key="cat"
          @click="store.productCategory = cat"
          class="px-3 py-2 text-sm rounded-lg font-medium transition-colors"
          :class="store.productCategory === cat
            ? 'bg-primary-500 text-white'
            : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Sort -->
      <div class="flex items-center gap-2 ml-auto text-sm text-gray-500 dark:text-gray-400">
        <span>並び替え:</span>
        <div class="flex gap-1">
          <button
            v-for="opt in sortOptions"
            :key="opt.value"
            @click="toggleSort(opt.value)"
            class="flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-colors"
            :class="store.productSortBy === opt.value
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'"
          >
            {{ opt.label }}
            <svg
              v-if="store.productSortBy === opt.value"
              class="w-3.5 h-3.5 transition-transform"
              :class="store.productSortOrder === 'asc' ? 'rotate-180' : ''"
              fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Product count -->
    <p class="text-sm text-gray-500 dark:text-gray-400">
      {{ filteredProducts.length }} 件
    </p>

    <!-- Product grid -->
    <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-for="i in 8" :key="i" class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-pulse">
        <div class="aspect-square bg-gray-100 dark:bg-gray-800" />
        <div class="p-4 space-y-2">
          <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
          <div class="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/4" />
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow"
      >
        <!-- Product image -->
        <div class="aspect-square bg-gray-50 dark:bg-gray-800 overflow-hidden relative">
          <img
            :src="product.imageUrl"
            :alt="product.name"
            class="w-full h-full object-cover object-center"
          />
          <!-- Status badge -->
          <span
            v-if="product.status === 'inactive'"
            class="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full bg-gray-800/70 text-gray-200"
          >
            販売停止
          </span>
          <!-- Category badge -->
          <span class="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-medium"
            :class="product.category === 'ホール'
              ? 'bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-300'
              : 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300'"
          >
            {{ product.category }}
          </span>
        </div>

        <!-- Product info -->
        <div class="p-4">
          <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug mb-2 line-clamp-2">
            {{ product.name }}
          </h3>
          <p class="text-lg font-bold text-primary-600 dark:text-primary-400 mb-3">
            ¥{{ product.price.toLocaleString() }}
          </p>

          <!-- Rating -->
          <div class="flex items-center gap-1 mb-3">
            <div class="flex">
              <svg
                v-for="i in 5"
                :key="i"
                class="w-3.5 h-3.5"
                :class="i <= Math.round(product.rating) ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'"
                fill="currentColor" viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ product.rating }}</span>
          </div>

          <!-- Stats -->
          <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>在庫: <strong class="text-gray-700 dark:text-gray-300">{{ product.stock }}</strong></span>
            <span>販売数: <strong class="text-gray-700 dark:text-gray-300">{{ product.sold.toLocaleString() }}</strong></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!pending && filteredProducts.length === 0" class="text-center py-16">
      <p class="text-gray-400 dark:text-gray-600">該当する商品が見つかりませんでした</p>
    </div>
  </div>
</template>
