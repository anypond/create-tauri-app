import { invoke } from '@tauri-apps/api/core'
import { useState } from 'react'
import { AppLayout } from '../components/app-layout'

export default function Home() {
  const [greetMsg, setGreetMsg] = useState('')
  const [name, setName] = useState('')

  async function greet() {
    if (!name.trim()) return
    setGreetMsg(await invoke('greet', { name }))
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold">欢迎来到 Tauri + React</h1>
          <p className="mt-2 text-lg text-base-content/70">这是一个现代化的桌面应用模板</p>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Tauri 命令示例</h2>
            <p className="text-base-content/70">输入您的名字，然后点击按钮来调用 Rust 命令</p>

            <div className="form-control">
              <input
                type="text"
                className="input input-bordered"
                placeholder="输入名字..."
                value={name}
                onChange={e => setName(e.currentTarget.value)}
              />
            </div>

            <div className="card-actions">
              <button className="btn btn-primary" onClick={greet}>
                打招呼
              </button>
            </div>

            {greetMsg && (
              <div className="alert alert-success mt-4">
                <span>{greetMsg}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">🚀 高性能</h3>
              <p>Tauri 提供极小的包体积和极快的性能</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">🛡️ 安全</h3>
              <p>Rust 提供内存安全和类型安全</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">🎨 现代化</h3>
              <p>React 19 + TypeScript + Tailwind CSS</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
