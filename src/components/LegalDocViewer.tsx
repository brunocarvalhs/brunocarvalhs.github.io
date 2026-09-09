import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Calendar, Link as LinkIcon, Share2, Check } from 'lucide-react';
import { LegalDocument, markdownToHtml } from '@/utils/markdownLoader';
import { categoryColors, categoryIcons } from '@/lib/legalCategories';
import { useStrings } from '@/i18n/strings';

interface LegalDocViewerProps {
    document: LegalDocument;
    onBack: () => void;
}

const LegalDocViewer: React.FC<LegalDocViewerProps> = ({ document: doc, onBack }) => {
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const t = useStrings();

    // Opening a specific legal document from a link inside one of the apps
    // shouldn't show the generic site title/description in the browser tab
    // (and in whatever preview the OS/browser builds from it) — swap them for
    // the document's own, and restore the site defaults on the way out.
    // This can't fix social-card previews (WhatsApp/Discord bots don't run
    // JS), but it fixes what the visitor's own browser actually shows.
    useEffect(() => {
        const previousTitle = window.document.title;
        const metaDescription = window.document.querySelector('meta[name="description"]');
        const previousDescription = metaDescription?.getAttribute('content') ?? t.seo.description;

        window.document.title = `${doc.title.replace(/_/g, ' ')} — ${t.legal.title} | Bruno Carvalho`;
        metaDescription?.setAttribute('content', doc.description.replace(/_/g, ' '));

        return () => {
            window.document.title = previousTitle || t.seo.title;
            metaDescription?.setAttribute('content', previousDescription);
        };
    }, [doc.id, doc.title, doc.description, t]);

    useEffect(() => {
        const loadContent = async () => {
            setLoading(true);
            try {
                const contentWithoutFrontmatter = doc.content.replace(/^---[\r\n]+[\s\S]*?[\r\n]+---[\r\n]+/, '');
                const htmlContent = await markdownToHtml(contentWithoutFrontmatter);
                setContent(htmlContent);
            } catch (error) {
                console.error('Erro ao processar conteúdo:', error);
                setContent(`<p>${t.legalViewer.errorContent}</p>`);
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, [doc.content, t]);

    const handleDownload = () => {
        const element = window.document.createElement('a');
        const file = new Blob([doc.content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${doc.id}.md`;
        window.document.body.appendChild(element);
        element.click();
        window.document.body.removeChild(element);
    };

    const handleShare = async () => {
        const baseUrl = window.location.origin;
        const url = `${baseUrl}/legal?doc=${doc.id}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: doc.title.replace(/_/g, ' '),
                    text: doc.description.replace(/_/g, ' '),
                    url,
                });
            } catch {
                // User cancelled the share sheet — not an error, nothing to do.
            }
            return;
        }

        navigator.clipboard.writeText(url)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(() => {
                alert(t.legalViewer.shareErrorAlert);
            });
    };

    const formattedDate = new Date(doc.lastUpdated).toLocaleDateString(t.terminal.dateLocale, {
        timeZone: 'UTC'
    });
    const CategoryIcon = categoryIcons[doc.category];
    const canShare = typeof navigator !== 'undefined' && 'share' in navigator;

    return (
        <div className="mx-auto max-w-4xl transition-colors duration-300 reveal is-visible">
            {/* Header */}
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="mb-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t.legalViewer.backButton}
                </Button>

                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <CategoryIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <Badge variant="secondary" className={categoryColors[doc.category]}>
                                {t.legal.categories[doc.category]}
                            </Badge>
                            {doc.project && (
                                <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-700">
                                    {doc.project.replace(/_/g, ' ')}
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
                            {t.legalViewer.downloadButton}
                        </Button>

                        <Button
                            variant={copied ? 'default' : 'outline'}
                            onClick={handleShare}
                            className="flex items-center gap-2 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
                        >
                            {copied ? (
                                <>
                                    <Check className="h-4 w-4 text-green-500" />
                                    {t.legalViewer.copiedButton}
                                </>
                            ) : canShare ? (
                                <>
                                    <Share2 className="h-4 w-4" />
                                    {t.legalViewer.shareButton}
                                </>
                            ) : (
                                <>
                                    <LinkIcon className="h-4 w-4" />
                                    {t.legalViewer.copyButton}
                                </>
                            )}
                        </Button>

                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="h-4 w-4" />
                            <span>{t.legalViewer.updatedOn(formattedDate)}</span>
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
                            <span className="ml-3 text-gray-600 dark:text-gray-300">{t.legalViewer.loading}</span>
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
                <p>{t.legalViewer.footerNote}</p>
            </div>
        </div>
    );
};

export default LegalDocViewer;
