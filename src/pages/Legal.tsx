import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Scale, FileText, FolderOpen } from 'lucide-react';
import { getAllDocuments, getProjects, LegalDocument } from '@/utils/markdownLoader';
import LegalDocCard from '@/components/LegalDocCard';
import LegalDocViewer from '@/components/LegalDocViewer';
import Reveal from '@/components/Reveal';
import { categoryLabels, categoryIcons } from '@/lib/legalCategories';
import { useToast } from '@/hooks/use-toast';

// Lê parâmetros tanto de query string quanto de hash
export function getQueryParam(param: string) {
  // 1. Primeiro tenta pela query "normal" (https://site/legal?doc=abc123)
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has(param)) {
    return searchParams.get(param);
  }

  // 2. Se não existir, tenta no hash (https://site/#/legal?doc=abc123)
  const currentHash = window.location.hash; 
  const queryString = currentHash.split('?')[1];
  const hashParams = new URLSearchParams(queryString || '');
  return hashParams.get(param);
}

// Atualiza parâmetros em ambos (prioriza query string)
export function updateQueryParam(param: string, value: string | null) {
  const url = new URL(window.location.href);

  if (value) {
    url.searchParams.set(param, value);
  } else {
    url.searchParams.delete(param);
  }

  // Atualiza a query string no navegador
  window.history.pushState({}, '', url.toString());

  // Se existir hash, mantém ele intacto (apenas substitui os params se precisar)
  if (window.location.hash.includes('?')) {
    const [path, queryString] = window.location.hash.replace(/^#/, '').split('?');
    const hashParams = new URLSearchParams(queryString || '');

    if (value) {
      hashParams.set(param, value);
    } else {
      hashParams.delete(param);
    }

    const newHash = hashParams.toString()
      ? `#${path}?${hashParams.toString()}`
      : `#${path}`;

    window.history.replaceState({}, '', `${url.pathname}${url.search}${newHash}`);
  }
}

const Legal: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
            // Link direto (provavelmente de dentro de um app) apontando pra
            // um documento que não existe mais — avisa em vez de cair
            // silenciosamente na lista geral sem explicação.
            updateQueryParam('doc', null);
            toast({
              title: 'Documento não encontrado',
              description: 'O link que você acessou aponta para um documento que não existe mais. Aqui está a lista completa.',
              variant: 'destructive',
            });
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

  const stats = {
    total: documents.length,
    projects: projects.length,
    categories: [...new Set(documents.map(doc => doc.category))].length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white px-4 py-8 pt-24 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600 dark:border-blue-400"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-300">Carregando documentos...</span>
          </div>
        </div>
      </div>
    );
  }

  if (selectedDocument) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8 pt-24 dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="rounded-xl bg-white p-4 shadow dark:bg-gray-800">
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
    <div className="min-h-screen bg-white px-4 py-8 pt-24 dark:bg-gray-900">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <Reveal className="mb-16 text-center">
          <span className="mb-3 inline-block font-mono text-xs font-semibold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
            Documentação
          </span>
          <div className="mb-2 flex items-center justify-center gap-3">
            <Scale className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Documentação Legal
            </h1>
          </div>
          <div className="mx-auto mb-8 mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
          <p className="mx-auto max-w-3xl text-balance text-lg text-gray-600 dark:text-gray-300">
            Documentos legais organizados por projeto, incluindo políticas de privacidade,
            termos de uso e informações sobre acessibilidade — usados na publicação dos meus apps.
          </p>
        </Reveal>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Reveal>
            <Card className="h-full border-l-4 border-l-blue-500 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-l-blue-400">
              <CardContent className="pt-6">
                <FileText className="mx-auto mb-2 h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</div>
                <div className="text-base text-gray-600 dark:text-gray-300">Documentos</div>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal delay={80}>
            <Card className="h-full border-l-4 border-l-green-500 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-l-green-400">
              <CardContent className="pt-6">
                <FolderOpen className="mx-auto mb-2 h-8 w-8 text-green-600 dark:text-green-400" />
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.projects}</div>
                <div className="text-base text-gray-600 dark:text-gray-300">Projetos</div>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal delay={160}>
            <Card className="h-full border-l-4 border-l-purple-500 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-l-purple-400">
              <CardContent className="pt-6">
                <Scale className="mx-auto mb-2 h-8 w-8 text-purple-600 dark:text-purple-400" />
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.categories}</div>
                <div className="text-base text-gray-600 dark:text-gray-300">Categorias</div>
              </CardContent>
            </Card>
          </Reveal>
        </div>

        {/* Project Filter */}
        <div className="mb-6">
          <h3 className="mb-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
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
            const Icon = categoryIcons[category];
            const categoryLabel = categoryLabels[category];

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
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredDocs.map((doc, index) => (
              <Reveal key={`${doc.project || 'general'}-${doc.id}`} delay={index * 60} className="h-full">
                <LegalDocCard
                  document={doc}
                  onView={() => openDocument(doc)}
                />
              </Reveal>
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
