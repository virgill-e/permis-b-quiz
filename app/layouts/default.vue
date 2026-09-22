<script setup lang="ts">
const mobileNavOpen = ref(false)
</script>

<template>
  <div class="flex min-h-screen bg-slate-50">
    <!-- Desktop sidebar -->
    <aside class="hidden w-72 shrink-0 border-r border-slate-200 bg-white lg:block">
      <div class="flex h-16 items-center gap-2 border-b border-slate-200 px-4">
        <span class="text-xl" aria-hidden="true">🚗</span>
        <span class="text-sm font-bold text-slate-800">Permis B — Entraînement</span>
      </div>
      <div class="h-[calc(100vh-4rem)]">
        <AppSidebar />
      </div>
    </aside>

    <div class="flex min-w-0 flex-1 flex-col">
      <!-- Mobile header -->
      <header class="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="text-xl" aria-hidden="true">🚗</span>
          <span class="text-sm font-bold text-slate-800">Permis B</span>
        </NuxtLink>
        <button
          type="button"
          class="rounded-lg border border-slate-200 p-2 text-slate-600"
          aria-label="Ouvrir le menu"
          @click="mobileNavOpen = true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      <!-- Mobile slide-over nav -->
      <Teleport to="body">
        <div v-if="mobileNavOpen" class="fixed inset-0 z-50 lg:hidden">
          <div class="absolute inset-0 bg-slate-900/50" @click="mobileNavOpen = false" />
          <div class="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-xl">
            <div class="flex h-16 items-center justify-between border-b border-slate-200 px-4">
              <span class="text-sm font-bold text-slate-800">Menu</span>
              <button
                type="button"
                class="rounded-lg border border-slate-200 p-2 text-slate-600"
                aria-label="Fermer le menu"
                @click="mobileNavOpen = false"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="h-[calc(100vh-4rem)]" @click="mobileNavOpen = false">
              <AppSidebar />
            </div>
          </div>
        </div>
      </Teleport>

      <main class="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div class="mx-auto w-full max-w-6xl">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
