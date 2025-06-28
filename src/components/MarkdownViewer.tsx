import React from 'react';

interface MarkdownViewerProps {
  htmlContent: string; // Conteúdo já convertido de markdown para HTML
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ htmlContent }) => (
  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />
);

export default MarkdownViewer;
