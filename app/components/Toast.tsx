'use client'
import React, { useEffect } from 'react'

type ToastProps = {
    show: boolean
    message: string
    onClose: () => void
    duration?: number
}

const Toast = ({ show, message, onClose, duration = 3000 }: ToastProps) => {

    useEffect(() => {
        if (show) {
            const timeout = setTimeout(() => {
                onClose()
            }, duration)
            return () => clearTimeout(timeout)
        }
    }, [show, duration, onClose])

    return (
        <div className="absolute top-0 right-5 z-50 bg-brand text-white px-4 py-2 rounded shadow-lg animate-fade-in">
            {message}
        </div>
    )
}

export default Toast
