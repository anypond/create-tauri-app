import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ThemeToggle } from './components/theme-toggle'
import { Github, ExternalLink, Heart, Settings } from 'lucide-react'

function App() {
  const [greetMsg, setGreetMsg] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function greet() {
    setIsLoading(true)
    try {
      const result = await invoke('greet', { name })
      setGreetMsg(result as string)
    } catch (error) {
      setGreetMsg('调用失败，请检查后端服务')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br p-4">
      <div className="container mx-auto px-4">
        {/* Header */}
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-full">
              <span className="text-primary-content font-bold">T</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Tauri + React</h1>
              <p className="text-sm text-base-content/70">现代化的桌面应用开发模板</p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        {/* Main Content */}
        <main className="space-y-8">
          {/* Hero Section */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <h2 className="card-title text-3xl font-bold justify-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                欢迎使用 Tauri + React
              </h2>
              <p className="text-lg">基于 daisyUI + Tailwind CSS 的现代化桌面应用模板</p>
              <div className="card-actions justify-center mt-6">
                <a
                  href="https://tauri.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Tauri 文档
                </a>
                <a
                  href="https://react.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  <Github className="w-4 h-4" />
                  React 文档
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title flex items-center gap-2">
                <Settings className="w-5 h-5" />
                交互演示
              </h2>
              <p className="text-base-content/70">体验 Tauri 前后端交互功能</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">请输入您的名字</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="输入名字..."
                    onKeyPress={e => e.key === 'Enter' && greet()}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={greet}
                    disabled={isLoading || !name.trim()}
                    className="btn btn-primary w-full"
                  >
                    {isLoading ? '调用中...' : '打招呼'}
                  </button>
                </div>
              </div>
              {greetMsg && (
                <div className="alert alert-info mt-4">
                  <p className="text-center font-medium">{greetMsg}</p>
                </div>
              )}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-xl font-semibold">🎨 现代化设计</h3>
                <p className="text-base-content/70">
                  基于 daisyUI + Tailwind CSS，提供完美的可访问性和响应式设计
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-xl font-semibold">⚡ 高性能</h3>
                <p className="text-base-content/70">
                  Tauri 提供轻量级的后端，Rust 确保安全和高性能
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-xl font-semibold">🔧 易于扩展</h3>
                <p className="text-base-content/70">组件化架构，支持主题定制，适合各种业务场景</p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 text-center text-base-content/70">
          <div className="flex items-center justify-center gap-2 text-sm">
            <span>使用</span>
            <Heart className="w-4 h-4 text-error" />
            <span>构建</span>
          </div>
          <p className="text-sm mt-2">Tauri 2 + React + TypeScript + daisyUI + Tailwind CSS</p>
        </footer>
      </div>
    </div>
  )
}

export default App
