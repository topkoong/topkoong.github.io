import { visit } from 'unist-util-visit';

export default function remarkMermaidAstro() {
  return function (tree) {
    visit(tree, 'code', (node) => {
      if (node.lang === 'mermaid') {
        // Convert to HTML div with the content as-is
        // The mermaid class will prevent markdown processing
        node.type = 'html';
        node.value = `<div class="mermaid">\n${node.value}\n</div>`;
        delete node.lang;
        delete node.meta;
      }
    });
  };
}
