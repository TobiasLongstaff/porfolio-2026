import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { FiArrowRight } from "react-icons/fi";

interface FormData {
  firstName: string;
  lastName: string;
  postalCode: string;
  email: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    postalCode: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: '¡Mensaje enviado exitosamente! Te contactaré pronto.',
        });
        setFormData({
          firstName: '',
          lastName: '',
          postalCode: '',
          email: '',
          message: '',
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.',
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
          className="w-full bg-transparent border-0 border-b-2 border-gray-300 pb-3 px-0 focus:outline-none focus:border-primary transition-colors text-text placeholder:text-gray-400 text-base"
          style={{
            borderBottomColor: 'rgba(0, 0, 0, 0.2)',
          }}
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          required
          className="w-full bg-transparent border-0 border-b-2 border-gray-300 pb-3 px-0 focus:outline-none focus:border-primary transition-colors text-text placeholder:text-gray-400 text-base"
          style={{
            borderBottomColor: 'rgba(0, 0, 0, 0.2)',
          }}
        />
      </div>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email Address"
        required
        className="w-full bg-transparent border-0 border-b-2 border-gray-300 pb-3 px-0 focus:outline-none focus:border-primary transition-colors text-text placeholder:text-gray-400 text-base"
        style={{
          borderBottomColor: 'rgba(0, 0, 0, 0.2)',
        }}
      />

      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Message"
        required
        rows={4}
        className="w-full bg-transparent border-0 border-b-2 border-gray-300 pb-3 px-0 focus:outline-none focus:border-primary transition-colors text-text placeholder:text-gray-400 resize-none text-base"
        style={{
          borderBottomColor: 'rgba(0, 0, 0, 0.2)',
        }}
      />

      {submitStatus.type && (
        <div
          className={`p-4 rounded-lg text-sm ${submitStatus.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
            }`}
        >
          {submitStatus.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="border border-[#211b7a] cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-b from-[#9894F1] via-[#615EE7] to-[#5046E5] shadow-sm shadow-[#3B3596]/40"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
        <FiArrowRight className="w-5 h-5" />
      </button>
    </form>
  );
}
