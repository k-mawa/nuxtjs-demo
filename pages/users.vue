<script setup lang="ts">
import type { User } from '~/types'

definePageMeta({ layout: 'dashboard' })

useSeoMeta({
  title: 'Users | Patisserie Dashboard',
  description: 'ユーザー一覧・ロール・ステータス管理',
})

const store = useDashboardStore()

const { data: users, pending } = await useAsyncData<User[]>('users', () =>
  $fetch('/api/users'),
)

const statusOptions = ['全て', 'active', 'inactive'] as const
const roleOptions = ['全て', 'admin', 'staff', 'customer'] as const

const statusLabel: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
}

const roleLabel: Record<string, string> = {
  admin: '管理者',
  staff: 'スタッフ',
  customer: '顧客',
}

const filteredUsers = computed(() => {
  let list = users.value ?? []

  if (store.userStatusFilter !== '全て') {
    list = list.filter((u) => u.status === store.userStatusFilter)
  }

  if (store.userRoleFilter !== '全て') {
    list = list.filter((u) => u.role === store.userRoleFilter)
  }

  return list
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="space-y-4">
    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-3">
      <!-- Status filter -->
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-500 dark:text-gray-400">ステータス:</span>
        <div class="flex gap-1">
          <button
            v-for="opt in statusOptions"
            :key="opt"
            @click="store.userStatusFilter = opt"
            class="px-3 py-1.5 text-sm rounded-lg font-medium transition-colors"
            :class="store.userStatusFilter === opt
              ? 'bg-primary-500 text-white'
              : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary-300'"
          >
            {{ opt === 'active' ? 'Active' : opt === 'inactive' ? 'Inactive' : opt }}
          </button>
        </div>
      </div>

      <!-- Role filter -->
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-500 dark:text-gray-400">ロール:</span>
        <div class="flex gap-1">
          <button
            v-for="opt in roleOptions"
            :key="opt"
            @click="store.userRoleFilter = opt"
            class="px-3 py-1.5 text-sm rounded-lg font-medium transition-colors"
            :class="store.userRoleFilter === opt
              ? 'bg-primary-500 text-white'
              : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary-300'"
          >
            {{ opt === '全て' ? opt : roleLabel[opt] }}
          </button>
        </div>
      </div>

      <span class="ml-auto text-sm text-gray-500 dark:text-gray-400">{{ filteredUsers.length }} 件</span>
    </div>

    <!-- Skeleton -->
    <div v-if="pending" class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div v-for="i in 6" :key="i" class="flex items-center gap-4 px-5 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0 animate-pulse">
        <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 shrink-0" />
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-100 dark:bg-gray-800 rounded w-32" />
          <div class="h-3 bg-gray-100 dark:bg-gray-800 rounded w-48" />
        </div>
      </div>
    </div>

    <!-- User list -->
    <div v-else class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
              <th class="text-left px-5 py-3 font-medium">ユーザー</th>
              <th class="text-left px-5 py-3 font-medium">ロール</th>
              <th class="text-left px-5 py-3 font-medium">ステータス</th>
              <th class="text-right px-5 py-3 font-medium">注文数</th>
              <th class="text-right px-5 py-3 font-medium">累計購入額</th>
              <th class="text-right px-5 py-3 font-medium">登録日</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
            >
              <!-- Avatar + name -->
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800">
                    <img
                      :src="user.avatarUrl"
                      :alt="user.name"
                      class="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div class="min-w-0">
                    <p class="font-medium text-gray-900 dark:text-gray-100 truncate">{{ user.name }}</p>
                    <p class="text-xs text-gray-400 dark:text-gray-600 truncate">{{ user.email }}</p>
                  </div>
                </div>
              </td>

              <!-- Role -->
              <td class="px-5 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400': user.role === 'admin',
                    'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400': user.role === 'staff',
                    'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400': user.role === 'customer',
                  }"
                >
                  {{ roleLabel[user.role] }}
                </span>
              </td>

              <!-- Status -->
              <td class="px-5 py-4">
                <span class="inline-flex items-center gap-1.5 text-xs font-medium">
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="user.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'"
                  />
                  <span :class="user.status === 'active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'">
                    {{ statusLabel[user.status] }}
                  </span>
                </span>
              </td>

              <!-- Orders -->
              <td class="px-5 py-4 text-right text-gray-600 dark:text-gray-400">
                {{ user.totalOrders > 0 ? user.totalOrders.toLocaleString() : '—' }}
              </td>

              <!-- Total spent -->
              <td class="px-5 py-4 text-right font-medium text-gray-900 dark:text-gray-100">
                {{ user.totalSpent > 0 ? `¥${user.totalSpent.toLocaleString()}` : '—' }}
              </td>

              <!-- Joined -->
              <td class="px-5 py-4 text-right text-gray-500 dark:text-gray-400 text-xs">
                {{ formatDate(user.joinedAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty state -->
      <div v-if="filteredUsers.length === 0" class="text-center py-16">
        <p class="text-gray-400 dark:text-gray-600">該当するユーザーが見つかりませんでした</p>
      </div>
    </div>
  </div>
</template>
