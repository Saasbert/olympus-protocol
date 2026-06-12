import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  loading?: boolean
  children: ReactNode
}

export function Button({ variant = 'primary', loading, children, className = '', disabled, ...props }: ButtonProps) {
  const base = 'min-h-touch px-6 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    primary: 'bg-mecha-cyan text-black hover:bg-mecha-cyan/80',
    secondary: 'bg-mecha-steel text-white border border-white/20 hover:bg-white/10',
    danger: 'bg-mecha-crimson text-white hover:bg-mecha-crimson/80',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={disabled || loading} {...props}>
      {loading ? '...' : children}
    </button>
  )
}
