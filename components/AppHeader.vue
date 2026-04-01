<script setup lang="ts">
const route = useRoute()
const colorMode = useColorMode()
const { toggle } = useSidebar()

const pageTitles: Record<string, string> = {
  '/overview': 'Overview',
  '/sales': 'Sales',
  '/products': 'Products',
  '/users': 'Users',
}

const pageTitle = computed(() => pageTitles[route.path] ?? 'Dashboard')

const today = new Date().toLocaleDateString('ja-JP', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'short',
})

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <header class="h-16 shrink-0 flex items-center justify-between px-4 md:px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
    <div class="flex items-center gap-3">
      <!-- Hamburger (mobile only) -->
      <button
        class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden"
        aria-label="メニューを開く"
        @click="toggle"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      <h1 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {{ pageTitle }}
      </h1>
    </div>

    <div class="flex items-center gap-3">
      <span class="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">{{ today }}</span>

      <!-- Dark mode toggle -->
      <button
        @click="toggleColorMode"
        class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        :aria-label="colorMode.value === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'"
      >
        <svg v-if="colorMode.value === 'dark'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
        <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
      </button>
    </div>
  </header>
</template>
