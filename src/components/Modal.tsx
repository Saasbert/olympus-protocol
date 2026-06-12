import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-mecha-steel border border-white/10 rounded-xl p-6 min-w-[300px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-mecha text-lg text-mecha-cyan">{title}</h2>
          <button onClick={onClose} className="min-w-touch min-h-touch flex items-center justify-center text-white/50 hover:text-white">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
