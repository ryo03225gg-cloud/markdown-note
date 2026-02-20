import { marked } from 'marked';

marked.setOptions({
  breaks: true,
  gfm: true,
});

export function renderMarkdown(content) {
  if (!content) return '';
  return marked.parse(content);
}
