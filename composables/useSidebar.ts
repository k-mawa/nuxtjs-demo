export const useSidebar = () => {
  const isOpen = useState('sidebar', () => false)
  const toggle = () => { isOpen.value = !isOpen.value }
  const close = () => { isOpen.value = false }
  return { isOpen, toggle, close }
}
