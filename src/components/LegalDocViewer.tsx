import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Calendar, FileText, Link as LinkIcon, Check } from 'lucide-react';
import { LegalDocument, markdownToHtml } from '@/utils/markdownLoader';

interface LegalDocViewerProps {
    document: LegalDocument;
    onBack: () => void;
}

const categoryLabels = {
    privacy: 'Privacidade',
    terms: 'Termos',
    accessibility: 'Acessibilidade',
    cookies: 'Cookies',
    data: 'Dados'
};

const categoryColors = {
    privacy: 'bg-blue-100 text-blue-800',
    terms: 'bg-green-100 text-green-800',
    accessibility: 'bg-purple-100 text-purple-800',
    cookies: 'bg-orange-100 text-orange-800',
    data: 'bg-red-100 text-red-800'
};

const LegalDocViewer: React.FC<LegalDocViewerProps> = ({ document, onBack }) => {
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const loadContent = async () => {
            setLoading(true);
            try {
                const contentWithoutFrontmatter = document.content.replace(/^---[\r\n]+[\s\S]*?[\r\n]+---[\r\n]+/, '');
                const htmlContent = await markdownToHtml(contentWithoutFrontmatter);
                setContent(htmlContent);
            } catch (error) {
                console.error('Erro ao processar conteúdo:', error);
                setContent('<p>Erro ao processar o documento.</p>');
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, [document.content]);

    const handleDownload = () => {
        const element = window.document.createElement('a');
        const file = new Blob([document.content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${document.id}.md`;
        window.document.body.appendChild(element);
        element.click();
        window.document.body.removeChild(element);
    };

    const handleCopyUrl = () => {
        const baseUrl = window.location.origin;
        const docHash = `/legal?doc=${document.id}`;
        const urlToCopy = `${baseUrl}${docHash}`;

        navigator.clipboard.writeText(urlToCopy)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(() => {
                alert('Erro ao copiar URL.');
            });
    };

    const formattedDate = new Date(document.lastUpdated).toLocaleDateString('pt-BR', {
        timeZone: 'UTC'
    });

    return (
        <div className="max-w-4xl mx-auto transition-colors duration-300">
            {/* Header */}
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="mb-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar aos Documentos
                </Button>

                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <Badge
                                variant="secondary"
                                className={categoryColors[document.category] + ' dark:bg-opacity-20 dark:text-white dark:border-white'}
                            >
                                {categoryLabels[document.category]}
                            </Badge>
                            {document.project && (
                                <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-700">
                                    {document.project.replace(/_/g, ' ')}
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-4">
                        <Button
                            variant="outline"
                            onClick={handleDownload}
                            className="flex items-center gap-2 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
                        >
                            <Download className="h-4 w-4" />
                            Baixar
                        </Button>

                        <Button
                            variant={copied ? 'default' : 'outline'}
                            onClick={handleCopyUrl}
                            className="flex items-center gap-2 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
                        >
                            {copied ? (
                                <>
                                    <Check className="h-4 w-4 text-green-500" />
                                    Copiado!
                                </>
                            ) : (
                                <>
                                    <LinkIcon className="h-4 w-4" />
                                    Copiar URL
                                </>
                            )}
                        </Button>

                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="h-4 w-4" />
                            <span>Atualizado em {formattedDate}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <Card className="transition-colors duration-300">
                <CardContent className="p-8">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
                            <span className="ml-3 text-gray-600 dark:text-gray-300">Carregando documento...</span>
                        </div>
                    ) : (
                        <div
                            className="
                                prose prose-lg max-w-none 
                                bg-white text-gray-900 
                                dark:bg-gray-900 dark:text-gray-100 
                                dark:prose-headings:text-white 
                                dark:prose-strong:text-white 
                                dark:prose-code:text-gray-200
                                prose-a:text-blue-600 dark:prose-a:text-blue-400
                                prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300
                                rounded-xl p-4 transition-colors
                            "
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 transition-colors">
                <p>
                    Este documento faz parte da documentação legal dos projetos de propriedade do brunocarvalhs.
                    Para questões específicas, utilize o formulário de contato.
                </p>
            </div>
        </div>
    );
};

export default LegalDocViewer;
