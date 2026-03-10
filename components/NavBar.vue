<template>
  <div class="drawer lg:drawer-open h-screen overflow-hidden">
    <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content overflow-y-auto py-16">
      <!-- Navbar -->
      <nav class="navbar w-full bg-app-secondary fixed top-0 z-50">
        <label
          for="my-drawer-4"
          aria-label="open sidebar"
          class="btn btn-square btn-ghost"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2"
            fill="none"
            stroke="currentColor"
            class="my-1.5 inline-block size-4"
          >
            <path
              d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"
            ></path>
            <path d="M9 4v16"></path>
            <path d="M14 10l2 2l-2 2"></path>
          </svg>
        </label>
        <div class="flex items-center gap-2">
          <img class="w-8" src="/public/favicon.webp" alt="" />
          <h5 class="uppercase font-freeman tracking-wide">Stratagema</h5>
        </div>
      </nav>
      <!-- Page content -->
      <slot />
    </div>
    <div class="drawer-side is-drawer-close:overflow-visible z-50">
      <label
        for="my-drawer-4"
        aria-label="close sidebar"
        class="drawer-overlay"
      ></label>
      <div
        class="flex min-h-full flex-col items-start bg-app-secondary is-drawer-close:w-18 is-drawer-open:w-42"
      >
        <ul class="menu w-full grow">
          <ul class="menu w-full grow">
            <li v-for="link in navLinks" :key="link?.name">
              <NuxtLink
                :to="link.path"
                class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                :data-tip="link?.name"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke-width="2"
                  fill="none"
                  stroke="currentColor"
                  class="my-1.5 inline-block size-4"
                >
                  <path :d="link.icon" />
                </svg>
                <span class="is-drawer-close:hidden capitalize">{{
                  link?.name
                }}</span>
              </NuxtLink>
            </li>
          </ul>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const navLinks = [
  {
    name: "Home",
    path: "/",
    icon: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  },
  {
    name: "Characters",
    path: "/characters",
    icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  },
  {
    name: "Weapons",
    path: "/weapons",
    icon: "M14.5 17.5L3 6V3h3l11.5 11.5M16 16l4 4M10 13l-3 3M18 2l4 4-6.5 6.5-4-4z",
  },
  {
    name: "Artifacts",
    path: "/artifacts",
    icon: "M6 3h12l4 6-10 13L2 9zM6 3l6 16M18 3l-6 16M2 9h20",
  },
];
</script>
