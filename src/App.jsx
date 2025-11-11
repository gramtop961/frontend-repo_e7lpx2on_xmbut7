import { useEffect, useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { apiFetch } from './lib/api'

function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem('fp_token') || '')
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('fp_user') || 'null'))

  const login = async (email, password) => {
    const data = await apiFetch('/auth/login', { method: 'POST', body: { email, password } })
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('fp_token', data.token)
    localStorage.setItem('fp_user', JSON.stringify(data.user))
    return data
  }

  const register = async (name, email, password) => {
    const data = await apiFetch('/auth/register', { method: 'POST', body: { name, email, password } })
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('fp_token', data.token)
    localStorage.setItem('fp_user', JSON.stringify(data.user))
    return data
  }

  const logout = () => {
    setToken('')
    setUser(null)
    localStorage.removeItem('fp_token')
    localStorage.removeItem('fp_user')
  }

  return { token, user, login, register, logout }
}

function Header({ user, onLogout }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 backdrop-blur bg-white/60 dark:bg-black/40 border-b border-white/20">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-blue-500" />
        <span className="font-semibold tracking-tight">FlowPlan</span>
      </div>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm text-gray-600 dark:text-gray-300">{user.name}</span>
            <button onClick={onLogout} className="text-sm px-3 py-1.5 rounded-md bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black">Logout</button>
          </>
        ) : null}
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden">
      <Spline scene="https://prod.spline.design/LU2mWMPbF3Qi1Qxh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-white/90 dark:from-black/50 dark:via-black/30 dark:to-black/90" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-blue-600 drop-shadow-sm">Plan faster with AI</h1>
        <p className="mt-4 max-w-2xl text-gray-700 dark:text-gray-300">FlowPlan helps teams design timelines, assign work, and track progress with real-time updates and an AI copilot.</p>
        <a href="#app" className="mt-8 inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black">Open App</a>
      </div>
    </section>
  )
}

function AuthPanel({ onAuth, busy }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('demo@flowplan.dev')
  const [password, setPassword] = useState('flowplan')
  const [mode, setMode] = useState('login')
  const [error, setError] = useState('')

  const handle = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await onAuth({ mode, name, email, password })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handle} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <button type="button" onClick={() => setMode('login')} className={`text-sm px-3 py-1.5 rounded-md ${mode==='login'?'bg-gray-900 text-white dark:bg-white dark:text-black':'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'}`}>Login</button>
        <button type="button" onClick={() => setMode('register')} className={`text-sm px-3 py-1.5 rounded-md ${mode==='register'?'bg-gray-900 text-white dark:bg-white dark:text-black':'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'}`}>Register</button>
        <span className="ml-auto text-xs text-zinc-500">Demo creds prefilled</span>
      </div>
      {mode==='register' && (
        <div className="mb-3">
          <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none" placeholder="Jane Doe" />
        </div>
      )}
      <div className="mb-3">
        <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none" placeholder="you@company.com" />
      </div>
      <div className="mb-3">
        <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none" />
      </div>
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      <button disabled={busy} className="w-full mt-2 px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60 dark:bg-white dark:text-black">{busy? 'Please wait…' : (mode==='login'? 'Login' : 'Create account')}</button>
    </form>
  )}

function Projects({ token }) {
  const [items, setItems] = useState([])
  const [name, setName] = useState('New Project')
  const [description, setDescription] = useState('Kickoff plan')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const data = await apiFetch('/projects', { token })
      setItems(data)
    } catch (e) {
      setError(e.message)
    }
  }
  useEffect(() => { load() }, [])

  const create = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const proj = await apiFetch('/projects', { method: 'POST', body: { name, description }, token })
      setItems([proj, ...items])
    } catch (e) { setError(e.message) }
    finally { setBusy(false) }
  }

  return (
    <div>
      <form onSubmit={create} className="flex flex-col md:flex-row gap-2 items-stretch mb-4">
        <input value={name} onChange={e=>setName(e.target.value)} className="flex-1 px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none" placeholder="Project name" />
        <input value={description} onChange={e=>setDescription(e.target.value)} className="flex-1 px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none" placeholder="Description" />
        <button disabled={busy} className="px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60 dark:bg-white dark:text-black">Create</button>
      </form>
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(p => (
          <div key={p.id} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function App() {
  const { token, user, login, register, logout } = useAuth()
  const [busy, setBusy] = useState(false)

  const onAuth = async ({ mode, name, email, password }) => {
    setBusy(true)
    try {
      if (mode === 'login') await login(email, password)
      else await register(name || 'New User', email, password)
    } finally { setBusy(false) }
  }

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <Header user={user} onLogout={logout} />
      <Hero />
      <main id="app" className="max-w-5xl mx-auto px-6 py-12">
        {!user ? (
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Get started</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">Create an account or sign in to create projects, add tasks, and try the AI suggestions.</p>
              <AuthPanel onAuth={onAuth} busy={busy} />
            </div>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 bg-gradient-to-br from-fuchsia-50 to-blue-50 dark:from-fuchsia-950/30 dark:to-blue-950/30">
              <h3 className="font-semibold mb-2">What you can do</h3>
              <ul className="list-disc pl-5 text-sm text-zinc-700 dark:text-zinc-300 space-y-2">
                <li>Create and manage projects</li>
                <li>Add tasks and comments</li>
                <li>Use the AI copilot to suggest tasks and summaries</li>
                <li>Everything runs locally in this demo</li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Projects</h2>
              <AIBar token={token} />
            </div>
            <Projects token={token} />
          </>
        )}
      </main>
      <footer className="py-8 text-center text-sm text-zinc-500">© {new Date().getFullYear()} FlowPlan</footer>
    </div>
  )
}

function AIBar({ token }) {
  const [projectName, setProjectName] = useState('Website Redesign')
  const [desc, setDesc] = useState('Improve conversion, ship new pricing page, refresh branding')
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)

  const run = async () => {
    setBusy(true)
    try {
      const data = await apiFetch('/ai/suggest-tasks', { method: 'POST', token, body: { project_name: projectName, description: desc, count: 5 } })
      setResult(data)
    } catch (e) { setResult({ error: e.message }) }
    finally { setBusy(false) }
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-2 items-stretch">
      <input value={projectName} onChange={e=>setProjectName(e.target.value)} className="flex-1 px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none" placeholder="Project name" />
      <input value={desc} onChange={e=>setDesc(e.target.value)} className="flex-[2] px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none" placeholder="Description" />
      <button onClick={run} disabled={busy} className="px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60 dark:bg-white dark:text-black">{busy ? 'Thinking…' : 'Suggest tasks'}</button>
      {result && (
        <div className="md:w-full w-full">
          {result.error && <p className="text-sm text-red-600">{result.error}</p>}
          {Array.isArray(result.tasks) && result.tasks.length > 0 && (
            <div className="mt-4 grid md:grid-cols-2 gap-3">
              {result.tasks.map((t, i) => (
                <div key={i} className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 bg-white dark:bg-zinc-900">
                  <div className="font-medium">{t.title}</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">{t.description}</div>
                  <div className="text-xs mt-1"><span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">{t.priority}</span></div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
