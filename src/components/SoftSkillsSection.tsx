import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import portfolioData from '@/data/portfolio.json';

const SoftSkillsSection = () => {
  const { softSkills } = portfolioData;

  return (
    <section id="soft-skills" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">{softSkills.title}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {softSkills.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {softSkills.skills.map((skill, index) => (
            <Card
              key={index}
              className="bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
            >
              <CardHeader className="text-center">
                <div className="text-4xl mb-4">{skill.icon}</div>
                <CardTitle className="text-xl text-gray-800 dark:text-white mb-2">
                  {skill.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {skill.description}
                </p>
                
                {/* Barra de progresso */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  {skill.level}%
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SoftSkillsSection;
