'use client'

import React, { useState } from 'react'
import Toast from '../Toast';
import { useRouter } from 'next/navigation';

const Contact = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', message: '' });
    const [show, setShow] = useState(false)
    const [status, setStatus] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })

    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.firstName === 'dashboard' || formData.lastName === 'dashboard' || formData.email === 'dashboard@dashboard.com' || formData.message === 'dashboard') {
            console.log('dashboard')
            router.push('/signIn')

        } else {
            setStatus('Sending...')

            const res = await fetch('/api/contact', {
                method: 'POST',
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                setStatus('Sent ✅')
                setFormData({ firstName: '', lastName: '', email: '', message: '' })
            } else {
                setStatus('Failed ❌')
            }
        }

    }

    return (
        <div>
            <div className='flex flex-col justify-center items-center gap-16' >
                

                {/* form */}
                <form
                    onSubmit={handleSubmit}
                    className='md:w-[60%] flex flex-col gap-4 max-w-2xl w-[90%] relative pt-20'>
                    {/* names */}
                    <div className='grid grid-cols-2 gap-6 max-sm:flex max-sm:flex-col'>
                        {/* first name */}
                        <div className='flex flex-col'>
                            <label htmlFor="firstName" className='pl-2 mb-2 w-fit '>First name*</label>
                            <input
                                type="text"
                                name="firstName"
                                id="firstName"
                                className='bg-[#5c5c60]  h-14 px-2 rounded-lg text-brand-light'
                                placeholder='John'
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* last name */}
                        <div className='flex flex-col'>
                            <label htmlFor="lastName" className='pl-2 mb-2 w-fit '>Last name*</label>
                            <input
                                type="text"
                                name="lastName"
                                id="lastName"
                                className='bg-[#5c5c60]  h-14 px-2 rounded-lg text-brand-light'
                                placeholder='Doe'
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className='flex flex-col gap-4'>
                        {/* email */}
                        <div className='flex flex-col'>
                            <label htmlFor="email" className='pl-2 mb-2 w-fit'>Email*</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className='bg-[#5c5c60]  h-20 px-2 rounded-lg text-brand-light'
                                placeholder='johndoe@gmail.com'
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* message */}
                        <div className='flex flex-col'>
                            <label htmlFor="message" className='pl-2 mb-2 w-fit'>Message</label>
                            <textarea
                                name="message"
                                id="message"
                                className='bg-[#5c5c60]  h-40 px-2 pt-2 rounded-lg text-brand-light'
                                placeholder='Your Message'
                                value={formData.message}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                    </div>

                    <button
                        type='submit'
                        className=' m-auto h-15 w-32 p-4 font-semibold flex items-center justify-center gap-4 border-0 bg-[#d85425] transition-all ease-in hover:scale-90 text-brand-light hover:bg-[#f5f5f5] hover:text-[#d85425] hover:border-2 hover:border-brand rounded-lg'
                        onClick={() => setShow(true)}
                    >
                        SUBMIT
                    </button>

                    <Toast
                        show={show}
                        message={status}
                        onClose={() => setShow(false)}
                    />
                </form>

            </div>

        </div>
    )
}

export default Contact
