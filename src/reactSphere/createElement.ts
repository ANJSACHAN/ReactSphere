// TypeScript version of createNewElement and createTextElement

function createHTMLElement(
  type: string,
  props: Record<string, any> | null,
  ...children: any[]
) {
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

function createTextElement(text: string) {
  return {
    type: "TEXT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

export { createHTMLElement, createTextElement };
