import { createPortal } from 'react-dom'
import { Dialog } from '../index'

export function InitialOpen(props: Dialog.RootProps) {
  return (
    <Dialog.Root {...props} defaultOpen>
