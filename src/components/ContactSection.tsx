import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Github, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Reveal from '@/components/Reveal';
import portfolioData from '@/data/portfolio.json';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const { toast } = useToast();
  const { hero } = portfolioData;
  const year = new Date().getFullYear();

  const CONTACT_EMAIL = 'brunocarvalhs@outlook.com.br';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = `Contato via site — ${formData.name}`;
    const body = `${formData.message}\n\n—\n${formData.name}\n${formData.email}`;
    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;

    toast({
      title: 'Abrindo seu app de email…',
      description: 'Confirme o envio por lá para que a mensagem chegue até mim.',
    });

    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Github':
        return <Github size={18} />;
      case 'Linkedin':
        return <Linkedin size={18} />;
      default:
        return null;
    }
  };

  return (
    <section id="contact" className="flex min-h-screen flex-col bg-black py-20 md:py-24">
      <div className="container mx-auto flex-1 px-6">
        <Reveal className="mb-16 text-center">
          <span className="mb-3 inline-block font-mono text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
            Vamos conversar
          </span>
          <h2 className="text-balance text-4xl font-bold tracking-tight text-white">Entre em Contato</h2>
          <div className="mx-auto mb-8 mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
          <p className="mx-auto max-w-3xl text-balance text-lg text-neutral-300">
            Estou sempre aberto a novas oportunidades e projetos interessantes.
            Vamos conversar sobre como posso ajudar você!
          </p>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Info */}
          <Reveal>
            <h3 className="mb-8 text-2xl font-bold text-white">Informações de Contato</h3>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/10">
                  <Mail className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-white">Email</h4>
                  <a href="mailto:brunocarvalhs@outlook.com.br" className="text-neutral-400 hover:text-white hover:underline">
                    brunocarvalhs@outlook.com.br
                  </a>
                </div>
              </div>

              {/* Telefone */}
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-green-400/30 bg-green-500/10">
                  <Phone className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-white">Telefone</h4>
                  <a href="tel:+5513997934483" className="text-neutral-400 hover:text-white hover:underline">
                    +55 (13) 99793-4483
                  </a>
                </div>
              </div>

              {/* Localização */}
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-purple-400/30 bg-purple-500/10">
                  <MapPin className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-white">Localização</h4>
                  <a
                    href="https://www.google.com/maps?q=São+Paulo,+Brasil"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white hover:underline"
                  >
                    São Paulo, Brasil
                  </a>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8">
              <h4 className="mb-4 font-semibold text-white">Redes Sociais</h4>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/brunocarvalhs"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/15"
                >
                  <Github className="h-6 w-6" />
                </a>
                <a
                  href="https://linkedin.com/in/brunocarvalhs"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/15"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
          </Reveal>

          {/* Contact Form */}
          <Reveal delay={120} className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm">
            <h3 className="mb-6 text-2xl font-bold text-white">Envie uma Mensagem</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-neutral-300">
                  Nome
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border-white/15 bg-black/30 text-white placeholder:text-neutral-500"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-neutral-300">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border-white/15 bg-black/30 text-white placeholder:text-neutral-500"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-neutral-300">
                  Mensagem
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full border-white/15 bg-black/30 text-white placeholder:text-neutral-500"
                  placeholder="Sua mensagem aqui..."
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 text-white transition-all duration-300 hover:bg-blue-500"
                size="lg"
              >
                <Send className="mr-2 h-4 w-4" />
                Enviar Mensagem
              </Button>
            </form>
          </Reveal>
        </div>
      </div>

      {/* Folded-in footer: on the desktop horizontal-panel layout this is the
          last panel, so there's no separate scrollable strip below
          everything for a standalone footer — this content (copyright +
          socials) lives here instead. Also used as-is on the mobile
          vertical stack, so the standalone <Footer> only renders on other
          routes (see src/components/Footer.tsx). */}
      <div className="container mx-auto mt-16 border-t border-white/10 px-6 pt-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm text-neutral-500">
            © {year} {hero.name}. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-3">
            {hero.socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors duration-300 hover:bg-white/10 hover:text-white"
              >
                {getIcon(link.icon)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
