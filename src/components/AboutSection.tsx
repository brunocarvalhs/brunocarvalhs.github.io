import React from 'react';
import { Code, Lightbulb, Users, Zap } from 'lucide-react';
import portfolioData from '@/data/portfolio.json';

const AboutSection = () => {
  const { about } = portfolioData;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code':
        return <Code className="w-8 h-8" />;
      case 'Lightbulb':
        return <Lightbulb className="w-8 h-8" />;
      case 'Users':
        return <Users className="w-8 h-8" />;
      case 'Zap':
        return <Zap className="w-8 h-8" />;
      default:
        return null;
    }
  };

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">{about.title}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {about.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {about.features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
            >
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                {getIcon(feature.icon)}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12 border border-gray-200 dark:border-gray-700">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{about.journey.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {about.journey.description1}
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {about.journey.description2}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-6">
                {about.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-3xl font-bold mb-2 ${
                      index === 0 ? 'text-blue-600 dark:text-blue-400' :
                      index === 1 ? 'text-purple-600 dark:text-purple-400' :
                      index === 2 ? 'text-green-600 dark:text-green-400' :
                      'text-orange-600 dark:text-orange-400'
                    }`}>
                      {stat.number}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
