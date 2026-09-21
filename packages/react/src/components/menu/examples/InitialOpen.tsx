import { useState } from 'react'
import { Menu } from '../index'

const items = ['react', 'solid', 'vue', 'svelte']

export function InitialOpen() {
  const [checked, setChecked] = useState(false)

  return (
    <Menu.Root defaultOpen>
