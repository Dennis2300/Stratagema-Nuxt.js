<template>
  <div class="drawer lg:drawer-open h-screen overflow-hidden">
    <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content overflow-y-auto pt-16">
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
            />
            <path d="M9 4v16" />
            <path d="M14 10l2 2l-2 2" />
          </svg>
        </label>
        <NuxtLink to="/">
          <div class="flex items-center gap-2">
            <img
              class="w-8"
              src="/public/favicon.webp"
              alt="Stratagema"
              loading="lazy"
            />
            <h5 class="uppercase font-freeman tracking-wide">Stratagema</h5>
          </div>
        </NuxtLink>
      </nav>
      <slot />
    </div>

    <div class="drawer-side is-drawer-close:overflow-visible z-50">
      <label
        for="my-drawer-4"
        aria-label="close sidebar"
        class="drawer-overlay"
      ></label>
      <div
        class="flex min-h-full flex-col items-start bg-app-secondary is-drawer-close:w-16 is-drawer-open:w-42"
      >
        <ul class="menu w-full grow gap-2">
          <li>
            <NuxtLink
              to="/"
              class="is-drawer-close:tooltip is-drawer-close:tooltip-right tooltip-primary"
              data-tip="Home"
              @click="closeDrawer"
            >
              <svg
                width="24"
                height="24"
                fill="#fff"
                viewBox="0 0 1.08 1.08"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>home-solid</title>
                <path
                  class="clr-i-solid clr-i-solid-path-1"
                  d="M.99.57A.03.03 0 0 1 .969.561L.54.132.111.561A.03.03 0 0 1 .069.519l.45-.45a.03.03 0 0 1 .042 0l.45.45A.03.03 0 0 1 .99.57"
                />
                <path
                  class="clr-i-solid clr-i-solid-path-2"
                  d="M.54.234.18.595V.96a.06.06 0 0 0 .06.06h.21v-.3h.18v.3h.21A.06.06 0 0 0 .9.96V.593Z"
                />
                <path fill="none" d="M0 0h1.08v1.08H0z" />
              </svg>

              <span class="is-drawer-close:hidden capitalize">Home</span>
            </NuxtLink>
          </li>

          <li>
            <NuxtLink
              to="/characters"
              class="is-drawer-close:tooltip is-drawer-close:tooltip-right tooltip-primary"
              data-tip="Characters"
              @click="closeDrawer"
            >
              <svg
                fill="#fff"
                width="24"
                height="24"
                viewBox="0 0 2.56 2.56"
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title />
                <path d="M.48.68h.08v.2h.08v-.2h.08V.6H.48z" />
                <path
                  d="M1.12.08H.08v1.04h1.04Zm-.24.96H.32V.76A.28.28 0 0 1 .513.494a.16.16 0 1 1 .174 0A.28.28 0 0 1 .88.76ZM1.96.88l.12-.2h-.24z"
                />
                <path
                  d="M1.44 1.12h1.04V.08H1.44Zm.24-.36a.28.28 0 0 1 .193-.266.16.16 0 1 1 .174 0A.28.28 0 0 1 2.24.76v.28h-.56Zm.4 1.4a.12.12 0 0 1-.12.12.12.12 0 0 1-.12-.12.12.12 0 0 1 .24 0"
                />
                <path
                  d="M1.44 2.48h1.04V1.44H1.44Zm.24-.28a.28.28 0 0 1 .193-.266.16.16 0 1 1 .174 0 .28.28 0 0 1 .193.266v.2h-.56ZM.52 2.08h.16v.16H.52z"
                />
                <path
                  d="M1.12 1.44H.08v1.04h1.04Zm-.24.96H.32v-.2a.28.28 0 0 1 .193-.266.16.16 0 1 1 .174 0A.28.28 0 0 1 .88 2.2Z"
                />
              </svg>
              <span class="is-drawer-close:hidden capitalize">Characters</span>
            </NuxtLink>
          </li>

          <li>
            <NuxtLink
              to="/weapons"
              class="is-drawer-close:tooltip is-drawer-close:tooltip-right tooltip-primary"
              data-tip="Weapons"
              @click="closeDrawer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                xml:space="preserve"
                width="24"
                height="24"
                fill="#fff"
              >
                <path
                  d="m29.714 27.824-3.825-3.825c1.266-1.504 2.183-3.169 2.319-4.557a1.337 1.337 0 0 0-2.662-.26 2.6 2.6 0 0 1-.127.564l-3.744-3.744 8.038-8.04a1.34 1.34 0 0 0 .323-.522l1.893-5.674C32.278.72 31.283-.275 30.237.074l-5.675 1.89a1.3 1.3 0 0 0-.523.323L16 10.327 7.961 2.288a1.3 1.3 0 0 0-.523-.323L1.763.072C.717-.276-.278.719.071 1.764L1.964 7.44a1.3 1.3 0 0 0 .323.523l8.038 8.038-3.761 3.761a2.3 2.3 0 0 1-.106-.531 1.338 1.338 0 0 0-2.67.162c.061 1 .559 2.157 1.32 3.298l.023.038.088.127.001.001a14 14 0 0 0 .336.465q.261.345.548.683l-3.818 3.819a1.337 1.337 0 1 0-1.891 1.892l.936.936.009.01.01.009.936.936a1.339 1.339 0 0 0 1.892-1.891l3.825-3.825c1.504 1.266 3.169 2.183 4.557 2.319a1.337 1.337 0 0 0 .26-2.662 2.6 2.6 0 0 1-.564-.127l3.743-3.744 3.761 3.761a2.3 2.3 0 0 1-.531.106 1.338 1.338 0 0 0 .162 2.67c1.002-.061 2.163-.562 3.307-1.326l.027-.017.099-.069.1-.07.106-.075q.123-.087.244-.179l.039-.03a15 15 0 0 0 .688-.552l3.819 3.819a1.339 1.339 0 0 0 1.892 1.892l.938-.938.008-.008.008-.008.938-.938a1.339 1.339 0 0 0-1.891-1.892M25.707 4.402l2.837-.946-.946 2.836-7.815 7.816-1.892-1.891zM3.455 3.457l2.837.946 8.75 8.75.011.012 3.784 3.783.001.001 5.149 5.149a13 13 0 0 1-.932 1.035 13 13 0 0 1-.952.865l-5.155-5.155-.004-.004-3.783-3.783-.001-.001-8.759-8.761zm6.449 20.532a13 13 0 0 1-.779-.682l-.004-.004-.212-.206-.064-.063a13 13 0 0 1-.841-.928l4.212-4.212 1.891 1.891z"
                />
              </svg>
              <span class="is-drawer-close:hidden capitalize">Weapons</span>
            </NuxtLink>
          </li>

          <li>
            <NuxtLink
              to="/artifacts"
              class="is-drawer-close:tooltip is-drawer-close:tooltip-right tooltip-primary"
              data-tip="Artifacts"
              @click="closeDrawer"
            >
              <svg
                width="24"
                height="24"
                fill="#fff"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m7.346 1.211-3.173.635c-.005 2.746-.082 5.593-2.038 7.838 2.76 1.871 6.726 2.537 9.445 1.978V7.021L5.077 4.136l.347-.771L12 6.29l6.577-2.926.347.771-6.502 2.887v4.641c2.719.558 6.684-.108 9.445-1.978-1.959-2.246-2.034-5.093-2.039-7.838l-3.173-.635c-.605.651-.966 1.319-1.542 1.9-.634.628-1.543 1.061-3.113 1.061s-2.479-.432-3.113-1.061c-.577-.581-.938-1.249-1.542-1.9m-4.819 9.705c1.034 2.255 1.977 4.862 2.288 7.495l3.047 1.069c.197-2.47 1.321-4.875 2.986-6.848-2.583.295-5.752-.271-8.321-1.716m18.948 0c-2.569 1.444-5.738 2.011-8.32 1.716 1.664 1.973 2.789 4.378 2.986 6.848l3.056-1.073c.309-2.662 1.247-5.24 2.278-7.491M12 12.61c-1.898 2.021-3.173 4.589-3.314 7.158l2.892 1.013V15.75h.844v5.03l2.892-1.013c-.146-2.569-1.415-5.137-3.314-7.158m7.111 6.722-5.188 1.814v.881l5.166-2.067c.005-.211.014-.417.023-.628m-14.217.005c.014.211.019.417.023.628l5.161 2.063v-.877zm8.184 2.104L12 21.82l-1.079-.375v.919l1.079.431 1.079-.431z"
                />
              </svg>
              <span class="is-drawer-close:hidden capitalize">Artifacts</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const closeDrawer = () => {
  document.getElementById("my-drawer-4").checked = false;
};
</script>
