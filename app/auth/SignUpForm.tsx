'use client'

import React, { useState } from 'react'

/**
 * Simple SignUpForm component for Next.js (client component)
 * - Fields: name, email, password
 * - Props: onSubmit (optional) receives { name, email, password }
 * - Uses Tailwind CSS classes
 */

export default function SignUpForm({
    onSubmit,
}: {
    onSubmit?: (data: { name: string; email: string; password: string }) => Promise<void> | void
}) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    function validate() {
        if (!name.trim()) return 'Name is required.'
        if (!email) return 'Email is required.'
        const re = /^(?:[a-zA-Z0-9_'^&\/+-])+(?:\.(?:[a-zA-Z0-9_'^&\/+-])+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/i
        if (!re.test(email)) return 'Enter a valid email.'
        if (!password) return 'Password is required.'
        if (password.length < 6) return 'Password must be at least 6 characters.'
        return null
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        const v = validate()
        if (v) return setError(v)

        const payload = { name: name.trim(), email: email.trim(), password }

        try {
            setLoading(true)
            if (onSubmit) {
                await onSubmit(payload)
            } else {
                // Default: call /api/signup
                const res = await fetch('/api/auth/signUp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                })
                if (!res.ok) {
                    const errJson = await res.json()
                    throw new Error(errJson.error || 'Failed to sign up')
                }
                setSuccess('Account created successfully!')
                setName('')
                setEmail('')
                setPassword('')
            }
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md w-full mx-auto p-6 bg-white/80 backdrop-blur rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-center">Sign up</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block">
                    <span className="text-sm font-medium">Name</span>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-offset-1"
                        placeholder="Your full name"
                        required
                    />
                </label>

                <label className="block">
                    <span className="text-sm font-medium">Email</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-offset-1"
                        placeholder="you@example.com"
                        required
                    />
                </label>

                <label className="block">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Password</span>
                        <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            className="text-xs underline"
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>

                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-offset-1"
                        placeholder="Create a password"
                        required
                    />
                </label>

                {error && <p className="text-sm text-red-600">{error}</p>}
                {success && <p className="text-sm text-green-600">{success}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg px-4 py-2 font-medium shadow-sm disabled:opacity-60 disabled:cursor-not-allowed bg-brand text-brand-light hover:bg-brand-secondary transition-colors"
                >
                    {loading ? 'Creating account...' : 'Sign up'}
                </button>
            </form>

            <p className="mt-4 text-sm text-center">
                Already have an account? <a className="underline" href="/signin">Sign in</a>
            </p>
        </div>
    )
}

/*
  Notes:
  - Client component for Next.js App Router. Keep 'use client'.
  - Uses Tailwind CSS. Adjust classes or onSubmit handler to fit your API.
*/