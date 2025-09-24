import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Scale, Shield, Database, Accessibility, FolderOpen } from 'lucide-react';
import { getAllDocuments, getProjects, LegalDocument } from '@/utils/markdownLoader';
import LegalDocCard from '@/components/LegalDocCard';
import LegalDocViewer from '@/components/LegalDocViewer';

function getQueryParam(param: string) {
  const currentHash = window.location.hash; // e.g. "#/legal?doc=abc123"
  const queryString = currentHash.split('?')[1];
  const params = new URLSearchParams(queryString || '');
  return params.get(param);
}

function updateQueryParam(param: string, value: string | null) {
  const { pathname, search } = window.location;
  const params = new URLSearchParams(search);

  if (value) {
    params.set(param, value);
  } else {
    params.delete(param);
  }

  const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;

  window.history.pushState({}, '', newUrl);
}

const Legal: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega documentos e projetos
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [allDocs, projectsList] = await Promise.all([
          getAllDocuments(),
          getProjects()
        ]);
        setDocuments(allDocs);
        setProjects(projectsList);

        // Após carregar, tenta abrir o documento da query string (se houver)
        const docId = getQueryParam('doc');
        if (docId) {
          const foundDoc = allDocs.find(d => d.id === docId);
          if (foundDoc) {
            setSelectedDocument(foundDoc);
          } else {
            // Remove query se inválido
            updateQueryParam('doc', null);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    // Escuta mudanças manuais na URL (back/forward do navegador)
    const onPopState = () => {
      const docId = getQueryParam('doc');
      if (!docId) {
        setSelectedDocument(null);
      } else if (documents.length) {
        const foundDoc = documents.find(d => d.id === docId);
        setSelectedDocument(foundDoc || null);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Função para abrir documento e atualizar URL
  const openDocument = (doc: LegalDocument) => {
    setSelectedDocument(doc);
    updateQueryParam('doc', doc.id);
  };

  // Função para fechar documento e limpar URL
  const closeDocument = () => {
    setSelectedDocument(null);
    updateQueryParam('doc', null);
  };

  const currentDocuments = selectedProject === 'general'
    ? documents.filter(doc => !doc.project || doc.project.trim() === '')
    : selectedProject
      ? documents.filter(doc => doc.project?.trim().toLowerCase() === selectedProject.toLowerCase())
      : documents;

  const filteredDocs = filter === 'all'
    ? currentDocuments
    : currentDocuments.filter(doc => doc.category === filter);

  const categoryIcons = {
    privacy: Shield,
    terms: Scale,
    accessibility: Accessibility,
    cookies: Database,
    data: FileText
  };

  const stats = {
    total: documents.length,
    projects: projects.length,
    categories: [...new Set(documents.map(doc => doc.category))].length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 pt-24">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Carregando documentos...</span>
          </div>
        </div>
      </div>
    );
  }

  if (selectedDocument) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 pt-24">
        <div className="container mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
            <LegalDocViewer
              document={selectedDocument}
              onBack={closeDocument}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 pt-24">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Scale className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
              Documentação Legal
            </h1>
          </div>
          <p className="text-xl font-medium text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Documentos legais organizados por projeto, incluindo políticas de privacidade,
            termos de uso e informações sobre acessibilidade.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center border-l-4 border-l-blue-500 dark:border-l-blue-400">
            <CardContent className="pt-6">
              <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</div>
              <div className="text-base text-gray-600 dark:text-gray-300">Documentos</div>
            </CardContent>
          </Card>

          <Card className="text-center border-l-4 border-l-green-500 dark:border-l-green-400">
            <CardContent className="pt-6">
              <FolderOpen className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.projects}</div>
              <div className="text-base text-gray-600 dark:text-gray-300">Projetos</div>
            </CardContent>
          </Card>

          <Card className="text-center border-l-4 border-l-purple-500 dark:border-l-purple-400">
            <CardContent className="pt-6">
              <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.categories}</div>
              <div className="text-base text-gray-600 dark:text-gray-300">Categorias</div>
            </CardContent>
          </Card>
        </div>

        {/* Project Filter */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white tracking-tight">
            Filtrar por Projeto:
          </h3>
          <div className="flex flex-wrap gap-2">
            {/* Botão "Todos os Projetos" */}
            <Button
              variant="outline"
              onClick={() => { setSelectedProject(null); setFilter('all'); }}
              className={`
                flex items-center gap-2 transition-colors
                ${selectedProject === null
                  ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }
              `}
            >
              <FolderOpen className="h-4 w-4" />
              Todos os Projetos
            </Button>

            {/* Botões individuais de projeto */}
            {projects.map(project => (
              <Button
                key={project}
                variant="outline"
                onClick={() => { setSelectedProject(project); setFilter('all'); }}
                className={`
                  flex items-center gap-2 transition-colors
                  ${selectedProject === project
                    ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
              >
                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                {project
                  .split('_')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </Button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {/* Badge "Todas as Categorias" */}
          <Badge
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={`
              cursor-pointer px-4 py-2 flex items-center gap-2 transition-colors
              ${filter === 'all'
                ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-950'
              }
            `}
          >
            Todas as Categorias
          </Badge>

          {/* Badges individuais de categoria */}
          {[...new Set(currentDocuments.map(doc => doc.category))].map(category => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons];
            const categoryLabel = {
              privacy: 'Privacidade',
              terms: 'Termos',
              accessibility: 'Acessibilidade',
              cookies: 'Cookies',
              data: 'Dados'
            }[category as keyof typeof categoryLabel];

            return (
              <Badge
                key={category}
                variant={filter === category ? 'default' : 'outline'}
                onClick={() => setFilter(category)}
                className={`
                  cursor-pointer px-4 py-2 flex items-center gap-2 transition-colors
                  ${filter === category
                    ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-950'
                  }
                `}
              >
                <Icon className={`h-3 w-3 ${filter === category ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                {categoryLabel}
              </Badge>
            );
          })}
        </div>

        {/* Documents Grid */}
        {filteredDocs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {filteredDocs.map(doc => (
              <LegalDocCard
                key={`${doc.project || 'general'}-${doc.id}`}
                document={doc}
                onView={() => openDocument(doc)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-300">Nenhum documento encontrado para os filtros selecionados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Legal;
