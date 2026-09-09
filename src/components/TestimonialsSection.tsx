import React from 'react';
import { Quote, Linkedin } from 'lucide-react';
import portfolioData from '@/data/portfolio.json';
import Reveal from '@/components/Reveal';

const TestimonialsSection = () => {
  const { testimonials } = portfolioData;

  if (!testimonials?.items?.length) return null;

  return (
    <section id="testimonials" className="min-h-screen bg-neutral-950 py-20 md:py-24">
      <div className="container mx-auto px-6">
        <Reveal className="mb-16 text-center">
          <span className="mb-3 inline-block font-mono text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
            Depoimentos
          </span>
          <h2 className="text-balance text-4xl font-bold tracking-tight text-white">
            {testimonials.title}
          </h2>
          <div className="mx-auto mb-8 mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
          <p className="mx-auto max-w-3xl text-balance text-lg text-neutral-300">
            {testimonials.description}
          </p>
        </Reveal>

        <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2">
          {testimonials.items.map((item, index) => (
            <Reveal key={item.name} delay={index * 100} className="h-full">
              <figure className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/30">
                <Quote className="mb-4 h-8 w-8 text-blue-400/40" aria-hidden="true" />
                <blockquote className="flex-grow text-balance leading-relaxed text-neutral-200">
                  "{item.quote}"
                </blockquote>
                <figcaption className="mt-6 border-t border-white/10 pt-4">
                  <a
                    href={item.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link inline-flex items-center gap-1.5 font-semibold text-white transition-colors hover:text-blue-400"
                  >
                    {item.name}
                    <Linkedin className="h-3.5 w-3.5 text-neutral-500 transition-colors group-hover/link:text-blue-400" />
                  </a>
                  <p className="text-sm text-neutral-400">{item.role}</p>
                  <p className="mt-1 font-mono text-xs uppercase tracking-wide text-neutral-600">
                    {item.relationship} · via LinkedIn
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
