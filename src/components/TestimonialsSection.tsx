import React from 'react';
import { Quote, Linkedin, ExternalLink } from 'lucide-react';
import portfolioData from '@/data/portfolio.json';
import Reveal from '@/components/Reveal';

// LinkedIn doesn't give recommendations their own permalink — this is the
// closest thing to a "source" URL: the recommendations tab of the profile
// they were posted on, where a visitor can verify the quote is real.
const RECOMMENDATIONS_SOURCE_URL = 'https://www.linkedin.com/in/brunocarvalhs/details/recommendations/';

const TestimonialsSection = () => {
  const { testimonials } = portfolioData;

  if (!testimonials?.items?.length) return null;

  return (
    <section id="testimonials" className="min-h-screen bg-gray-50 py-20 dark:bg-neutral-950 md:py-24">
      <div className="container mx-auto px-6">
        <Reveal className="mb-16 text-center">
          <span className="mb-3 inline-block font-mono text-xs font-semibold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
            Depoimentos
          </span>
          <h2 className="text-balance text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            {testimonials.title}
          </h2>
          <div className="mx-auto mb-8 mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
          <p className="mx-auto max-w-3xl text-balance text-lg text-gray-600 dark:text-neutral-300">
            {testimonials.description}
          </p>
        </Reveal>

        <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2">
          {testimonials.items.map((item, index) => (
            <Reveal key={item.name} delay={index * 100} className="h-full">
              <figure className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 dark:border-white/10 dark:bg-white/[0.03] dark:backdrop-blur-sm dark:hover:border-blue-400/30">
                <Quote className="mb-4 h-8 w-8 text-blue-400/60 dark:text-blue-400/40" aria-hidden="true" />
                <blockquote className="flex-grow text-balance leading-relaxed text-gray-700 dark:text-neutral-200">
                  "{item.quote}"
                </blockquote>
                <figcaption className="mt-6 border-t border-gray-200 pt-4 dark:border-white/10">
                  <a
                    href={item.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link inline-flex items-center gap-1.5 font-semibold text-gray-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                  >
                    {item.name}
                    <Linkedin className="h-3.5 w-3.5 text-gray-400 transition-colors group-hover/link:text-blue-600 dark:text-neutral-500 dark:group-hover/link:text-blue-400" />
                  </a>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">{item.role}</p>
                  <p className="mt-1 font-mono text-xs uppercase tracking-wide text-gray-400 dark:text-neutral-600">
                    {item.relationship}
                  </p>

                  <a
                    href={RECOMMENDATIONS_SOURCE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 font-mono text-xs text-gray-600 transition-colors hover:border-blue-300 hover:text-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-400 dark:hover:border-blue-400/30 dark:hover:text-blue-400"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Ver recomendação original
                  </a>
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
