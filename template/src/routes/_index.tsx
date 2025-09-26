import { invoke } from '@tauri-apps/api/core'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppLayout } from '../components/app-layout'

export default function Home() {
  const [greetMsg, setGreetMsg] = useState('')
  const [name, setName] = useState('')
  const { t: tCommon } = useTranslation('common')
  const { t: tHome } = useTranslation('home')

  async function greet() {
    if (!name.trim()) return
    setGreetMsg(await invoke('greet', { name }))
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold">{tHome('title')}</h1>
          <p className="mt-2 text-lg text-base-content/70">{tHome('subtitle')}</p>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">{tHome('demo.title')}</h2>
            <p className="text-base-content/70">{tHome('demo.description')}</p>

            <div className="form-control">
              <input
                type="text"
                className="input input-bordered"
                placeholder={tHome('demo.placeholder')}
                value={name}
                onChange={e => setName(e.currentTarget.value)}
              />
            </div>

            <div className="card-actions">
              <button className="btn btn-primary" onClick={greet}>
                {tCommon('actions.greet')}
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
              <h3 className="card-title">{tHome('features.performance.title')}</h3>
              <p>{tHome('features.performance.description')}</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">{tHome('features.security.title')}</h3>
              <p>{tHome('features.security.description')}</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">{tHome('features.modern.title')}</h3>
              <p>{tHome('features.modern.description')}</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
