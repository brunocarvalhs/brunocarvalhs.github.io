import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Scale, Shield, Database, Accessibility, FolderOpen } from 'lucide-react';
import { getAllDocuments, getProjects, LegalDocument } from '@/utils/markdownLoader';
import LegalDocCard from '@/components/LegalDocCard';
import LegalDocViewer from '@/components/LegalDocViewer';

function getQueryParam(param: string) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

function updateQueryParam(param: string, value: string | null) {
  const url = new URL(window.location.href);
  if (value) {
    url.searchParams.set(param, value);
  } else {
    url.searchParams.delete(param);
  }
  window.history.pushState({}, '', url.toString());
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
      <div className="min-h-screen bg-gray-50 py-8 px-4 pt-24">
        <div className="container mx-auto">
          <LegalDocViewer
            document={selectedDocument}
            onBack={closeDocument}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pt-24">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Scale className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Documentação Legal
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Documentos legais organizados por projeto, incluindo políticas de privacidade,
            termos de uso e informações sobre acessibilidade.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-gray-600">Documentos</div>
            </CardContent>
          </Card>

          <Card className="text-center border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <FolderOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.projects}</div>
              <div className="text-gray-600">Projetos</div>
            </CardContent>
          </Card>

          <Card className="text-center border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.categories}</div>
              <div className="text-gray-600">Categorias</div>
            </CardContent>
          </Card>
        </div>

        {/* Project Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">Filtrar por Projeto:</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedProject === null ? 'default' : 'outline'}
              onClick={() => { setSelectedProject(null); setFilter('all'); }}
              className="flex items-center gap-2"
            >
              <FolderOpen className="h-4 w-4" />
              Todos os Projetos
            </Button>
            {projects.map(project => (
              <Button
                key={project}
                variant={selectedProject === project ? 'default' : 'outline'}
                onClick={() => { setSelectedProject(project); setFilter('all'); }}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
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
          <Badge
            variant={filter === 'all' ? 'default' : 'outline'}
            className="cursor-pointer px-4 py-2 hover:bg-blue-100"
            onClick={() => setFilter('all')}
          >
            Todas as Categorias
          </Badge>
          {[...new Set(currentDocuments.map(doc => doc.category))].map(category => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons];
            return (
              <Badge
                key={category}
                variant={filter === category ? 'default' : 'outline'}
                className="cursor-pointer px-4 py-2 hover:bg-blue-100 flex items-center gap-2"
                onClick={() => setFilter(category)}
              >
                <Icon className="h-3 w-3" />
                {category === 'privacy' && 'Privacidade'}
                {category === 'terms' && 'Termos'}
                {category === 'accessibility' && 'Acessibilidade'}
                {category === 'cookies' && 'Cookies'}
                {category === 'data' && 'Dados'}
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
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum documento encontrado para os filtros selecionados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Legal;
