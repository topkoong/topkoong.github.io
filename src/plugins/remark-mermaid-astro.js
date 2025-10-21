/**
 * Remark Mermaid Plugin for Astro
 * 
 * This custom Remark plugin enables Mermaid diagram support in markdown files.
 * It transforms Mermaid code blocks into HTML divs that can be rendered
 * by the Mermaid JavaScript library on the client side.
 * 
 * Usage in markdown:
 * ```mermaid
 * graph TD
 *   A[Start] --> B[Process]
 *   B --> C[End]
 * ```
 * 
 * @returns {Function} Remark plugin function
 */

import { visit } from 'unist-util-visit';

export default function remarkMermaidAstro() {
  /**
   * Transform function that processes the markdown AST
   * @param {Object} tree - The markdown AST tree
   */
  return function (tree) {
    // Visit all code nodes in the AST
    visit(tree, 'code', (node) => {
      // Check if this code block is a Mermaid diagram
      if (node.lang === 'mermaid') {
        // Convert the code block to an HTML div
        // This prevents further markdown processing of the Mermaid syntax
        node.type = 'html';
        
        // Wrap the Mermaid content in a div with 'mermaid' class
        // The Mermaid library will automatically detect and render these divs
        node.value = `<div class="mermaid">\n${node.value}\n</div>`;
        
        // Clean up the node properties that are no longer needed
        delete node.lang;  // Remove language specification
        delete node.meta; // Remove any metadata
      }
    });
  };
}
