import { Element } from './type';

function createHTMLElement(
  type: string | Function,
  props: Record<string, any> | null,
  ...children: any[]
): Element {
  console.log('Creating element:', { type, props, children }); // Debug log
  
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text: string): Element {
  console.log('Creating text element:', text); // Debug log
  
  return {
    type: "TEXT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

// Export as the JSX factory
export const createElement = createHTMLElement;
export { createTextElement };