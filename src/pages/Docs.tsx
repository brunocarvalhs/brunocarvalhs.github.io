import React, { useState, useEffect } from 'react';
import { getAllDocuments } from '@/utils/documentsApi';
import { FileText, Folder, ChevronRight, ChevronDown } from 'lucide-react';
import MarkdownViewer from '@/components/MarkdownViewer';
import { DocDocument } from '@/types/documentTypes';
import { marked } from 'marked'; // npm i marked
import { markdownToHtml } from '@/utils/documentsApi';

type Tree = Record<string, Record<string, DocDocument[]>>;

const Docs: React.FC = () => {
  const [documentsTree, setDocumentsTree] = useState<Tree>({});
  const [selectedDoc, setSelectedDoc] = useState<DocDocument | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [htmlContent, setHtmlContent] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const allDocs = await getAllDocuments();

        const tree: Tree = {};
        allDocs.forEach(doc => {
          const project = doc.project?.trim() || 'geral';
          const subject = doc.subject?.trim() || 'documentos';

          if (!tree[project]) tree[project] = {};
          if (!tree[project][subject]) tree[project][subject] = [];

          tree[project][subject].push(doc);
        });

        setDocumentsTree(tree);
      } catch (error) {
        console.error('Erro ao carregar documentos:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Quando muda o documento selecionado, converte markdown para html
  useEffect(() => {
    if (!selectedDoc) {
      setHtmlContent('');
      return;
    }

    const convertMarkdown = async () => {
      try {
        // Remove frontmatter (se existir)
        const contentWithoutFrontmatter = selectedDoc.content.replace(/^---[\r\n]+[\s\S]*?[\r\n]+---[\r\n]+/, '');

        const html = await markdownToHtml(contentWithoutFrontmatter);
        setHtmlContent(html);
      } catch (error) {
        console.error('Erro ao converter markdown:', error);
        setHtmlContent('<p>Erro ao processar o documento.</p>');
      }
    };

    convertMarkdown();
  }, [selectedDoc]);


  const toggleProject = (project: string) => {
    setExpandedProjects(prev => ({ ...prev, [project]: !prev[project] }));
  };

  const toggleSubject = (key: string) => {
    setExpandedSubjects(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50 pt-16">
      {/* Sidebar */}
      <aside className="w-72 border-r bg-white shadow-sm p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Projetos</h2>
        {loading ? (
          <p className="text-sm text-gray-500">Carregando...</p>
        ) : (
          Object.entries(documentsTree).map(([project, subjects]) => (
            <div key={project} className="mb-4">
              <button
                onClick={() => toggleProject(project)}
                className="flex items-center gap-2 font-medium text-left w-full text-gray-800 hover:text-blue-600"
                aria-expanded={!!expandedProjects[project]}
                aria-controls={`${project}-subjects`}
              >
                {expandedProjects[project] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <Folder size={16} />
                {project
                  .split('_')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </button>

              {expandedProjects[project] && (
                <div id={`${project}-subjects`} className="ml-5 mt-2" role="region" aria-label={`Assuntos do projeto ${project}`}>
                  {Object.entries(subjects).map(([subject, docs]) => {
                    const subjectKey = `${project}-${subject}`;
                    return (
                      <div key={subjectKey} className="mb-2">
                        <button
                          onClick={() => toggleSubject(subjectKey)}
                          className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-500"
                          aria-expanded={!!expandedSubjects[subjectKey]}
                          aria-controls={`${subjectKey}-docs`}
                        >
                          {expandedSubjects[subjectKey] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          <span>
                            {subject
                              .split('_')
                              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ')}
                          </span>
                        </button>

                        {expandedSubjects[subjectKey] && (
                          <ul
                            id={`${subjectKey}-docs`}
                            className="ml-5 mt-1 space-y-1"
                            role="list"
                          >
                            {docs.map(doc => (
                              <li key={doc.id}>
                                <button
                                  onClick={() => setSelectedDoc(doc)}
                                  className={`flex items-center gap-2 text-sm ${selectedDoc?.id === doc.id
                                      ? 'text-blue-600 font-semibold'
                                      : 'text-gray-600 hover:text-blue-500'
                                    }`}
                                >
                                  <FileText size={14} />
                                  {doc.title}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))
        )}
      </aside>

      {/* Viewer */}
      <main className="flex-1 p-6 overflow-y-auto">
        {selectedDoc ? (
          <MarkdownViewer htmlContent={htmlContent} />
        ) : (
          <div className="text-center text-gray-500 mt-24">
            <FileText className="mx-auto mb-4" size={48} />
            <p>Selecione um documento à esquerda para visualizá-lo.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Docs;
