import { FiArrowRight } from "react-icons/fi";

interface ContactFormProps {
  email: string;
}

export default function ContactForm({ email }: ContactFormProps) {
  return (
    <div className="space-y-6">
      <p className="text-text-secondary">
        El formulario con backend estaba devolviendo éxito sin enviar nada. Mejor contacto directo hasta conectar un servicio real.
      </p>
      <a
        href={`mailto:${email}?subject=${encodeURIComponent('Contacto desde portfolio')}`}
        className="border border-[#211b7a] cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-b from-[#9894F1] via-[#615EE7] to-[#5046E5] shadow-sm shadow-[#3B3596]/40"
      >
        Escribime por mail
        <FiArrowRight className="w-5 h-5" />
      </a>
    </div>
  );
}
