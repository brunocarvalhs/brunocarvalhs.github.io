import { marked } from 'marked';

export const markdownToHtml = async (markdown: string): Promise<string> => {
  return marked.parse(markdown);
};