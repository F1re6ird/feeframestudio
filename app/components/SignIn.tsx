'use client'

import React, { useState } from 'react'


export default function SignInForm({
    onSubmit,
}: {
    onSubmit?: (data: { email: string; password: string }) => Promise<void> | void
}) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    function validate() {
        if (!email) return 'Email is required.'
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i
        if (!re.test(email)) return 'Enter a valid email.'
        if (!password) return 'Password is required.'
        if (password.length < 6) return 'Password must be at least 6 characters.'
        return null
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        const v = validate()
        if (v) return setError(v)

        const payload = { name: name.trim(), email: email.trim(), password }

        try {
            setLoading(true)
            if (onSubmit) {
                await onSubmit(payload)
            } else {
                await fetch('/api/auth/signin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                })
            }
        } catch (err) { 
            console.error(err)
            setError('Something went wrong.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md w-full mx-auto p-6 bg-white/80 backdrop-blur rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-center">Sign in</h2>

            <form onSubmit={handleSubmit} className="space-y-4">

                <label className="block">
                    <span className="text-sm font-medium">Email</span>
                    <input
                        type="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-offset-1"
                        placeholder="John Doe"
                        required
                        aria-required
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
                        aria-required
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
                        placeholder="Enter your password"
                        required
                        aria-required
                    />
                </label>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg px-4 py-2 font-medium shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading ? 'Signing in...' : 'Sign in'}
                </button>
            </form>


        </div>
    )
}