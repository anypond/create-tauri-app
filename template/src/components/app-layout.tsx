import { ReactNode } from 'react'
import { Link } from 'react-router'
import { ThemeToggle } from './theme-toggle'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-base-200">
      <nav className="navbar bg-base-100 shadow">
        <div className="container mx-auto">
          <div className="flex-1">
            <Link to="/" className="btn btn-ghost text-xl">
              Tauri App
            </Link>
          </div>
          <div className="flex-none gap-2">
            <Link to="/" className="btn btn-ghost">
              首页
            </Link>
            <Link to="/dashboard" className="btn btn-ghost">
              仪表板
            </Link>
            <Link to="/users" className="btn btn-ghost">
              用户
            </Link>
            <Link to="/settings" className="btn btn-ghost">
              设置
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4">{children}</main>
    </div>
  )
}
