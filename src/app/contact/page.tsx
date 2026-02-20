'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with email service
    setSubmitted(true);
  };
  
  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[#4aba8a] text-xs tracking-[0.3em] uppercase font-body mb-4 block">
            Contact
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-light tracking-wide text-[#e8e4df] mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-[#888] max-w-2xl mx-auto">
            Have a question, partnership idea, or story tip? We'd love to hear from you.
          </p>
        </div>
        
        <div className="grid md:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-[#0f0f12] border border-[#1a1a1e] rounded-2xl p-6">
              <div className="w-12 h-12 rounded-full bg-[#0c2e2e]/30 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#c8c0a0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>              <h3 className="font-display text-sm tracking-[0.2em] uppercase text-[#888] mb-2">Email</h3>              <a href="mailto:hello@kappar.tv" className="text-[#e8e4df] hover:text-[#c8c0a0] transition-colors">hello@kappar.tv</a>
            </div>            
            <div className="bg-[#0f0f12] border border-[#1a1a1e] rounded-2xl p-6">
              <div className="w-12 h-12 rounded-full bg-[#0c2e2e]/30 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#c8c0a0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>              <h3 className="font-display text-sm tracking-[0.2em] uppercase text-[#888] mb-2">Location</h3>              <p className="text-[#e8e4df]">Dubai International Financial Centre<br />Dubai, UAE</p>
            </div>            
            <div className="bg-[#0f0f12] border border-[#1a1a1e] rounded-2xl p-6">
              <div className="w-12 h-12 rounded-full bg-[#0c2e2e]/30 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-[#c8c0a0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>              <h3 className="font-display text-sm tracking-[0.2em] uppercase text-[#888] mb-2">Response Time</h3>              <p className="text-[#e8e4df]">We typically respond within 24-48 hours.</p>
            </div>
          </div>          
          {/* Form */}
          <div className="md:col-span-3">
            {submitted ? (
              <div className="bg-[#4aba8a]/10 border border-[#4aba8a]/30 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#4aba8a]/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#4aba8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>                <h3 className="font-display text-2xl font-light tracking-wide text-[#e8e4df] mb-3">Message Sent</h3>                <p className="text-[#888]">Thank you for reaching out. We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-[#0f0f12] border border-[#1a1a1e] rounded-2xl p-8">
                <div className="space-y-6">                  <div>                    <label htmlFor="name" className="block text-sm text-[#888] mb-2">Name</label>                    <input                      type="text"                      id="name"                      required                      value={formState.name}                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}                      className="w-full px-4 py-3 bg-[#08080a] border border-[#1a1a1e] rounded-xl text-[#e8e4df] placeholder-[#444] focus:outline-none focus:border-[#4aba8a] transition-colors font-body"
                      placeholder="Your name"
                    />
                  </div>                  
                  <div>                    <label htmlFor="email" className="block text-sm text-[#888] mb-2">Email</label>                    <input                      type="email"                      id="email"                      required                      value={formState.email}                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}                      className="w-full px-4 py-3 bg-[#08080a] border border-[#1a1a1e] rounded-xl text-[#e8e4df] placeholder-[#444] focus:outline-none focus:border-[#4aba8a] transition-colors font-body"
                      placeholder="you@company.com"
                    />
                  </div>                  
                  <div>                    <label htmlFor="subject" className="block text-sm text-[#888] mb-2">Subject</label>                    <select                      id="subject"                      required                      value={formState.subject}                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}                      className="w-full px-4 py-3 bg-[#08080a] border border-[#1a1a1e] rounded-xl text-[#e8e4df] focus:outline-none focus:border-[#4aba8a] transition-colors font-body appearance-none cursor-pointer"
                    >                      <option value="">Select a subject</option>                      <option value="general">General Inquiry</option>                      <option value="partnership">Partnership Opportunity</option>                      <option value="contribute">Contribute Content</option>                      <option value="expert">Become an Expert</option>                      <option value="press">Press Inquiry</option>                    </select>
                  </div>                  
                  <div>                    <label htmlFor="message" className="block text-sm text-[#888] mb-2">Message</label>                    <textarea                      id="message"                      required                      rows={6}                      value={formState.message}                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}                      className="w-full px-4 py-3 bg-[#08080a] border border-[#1a1a1e] rounded-xl text-[#e8e4df] placeholder-[#444] focus:outline-none focus:border-[#4aba8a] transition-colors font-body resize-none"
                      placeholder="Tell us what's on your mind..."
                    />
                  </div>                  
                  <button                    type="submit"                    className="w-full px-8 py-4 bg-[#0c2e2e] text-[#c8c0a0] font-body rounded-xl hover:bg-[#1a4a4a] transition-colors border border-[#1a4a4a]"
                  >                    Send Message
                  </button>                </div>              </form>            )}
          </div>
        </div>
      </div>
    </div>
  );
}
