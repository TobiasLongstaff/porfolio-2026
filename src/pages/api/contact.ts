import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { firstName, lastName, postalCode, email, message } = data;

    // Validar campos requeridos
    if (!firstName || !lastName || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Por favor completa todos los campos requeridos.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Por favor ingresa un email válido.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // TODO: Configurar servicio de email
    // Opción 1: Usar Resend (recomendado)
    // 1. Instalar: npm install resend
    // 2. Obtener API key de https://resend.com
    // 3. Agregar RESEND_API_KEY a .env
    // 4. Descomentar el código siguiente:
    
    /*
    import { Resend } from 'resend';
    const resend = new Resend(import.meta.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: 'onboarding@resend.dev', // Cambiar por tu dominio verificado
      to: 'tu-email@ejemplo.com', // Tu email donde recibirás los mensajes
      subject: `Nuevo contacto de ${firstName} ${lastName}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Código Postal:</strong> ${postalCode || 'No proporcionado'}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });
    */

    // Por ahora, solo logueamos los datos (en producción, envía el email)
    console.log('📧 Nuevo contacto recibido:');
    console.log({
      nombre: `${firstName} ${lastName}`,
      email,
      codigoPostal: postalCode || 'No proporcionado',
      mensaje: message,
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Mensaje enviado exitosamente' 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error al procesar el formulario:', error);
    return new Response(
      JSON.stringify({ error: 'Error al procesar el formulario. Por favor intenta de nuevo.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
