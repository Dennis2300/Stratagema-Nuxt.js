export default defineNuxtPlugin(async () => {
  const { trefoil } = await import('ldrs')
  trefoil.register()
})