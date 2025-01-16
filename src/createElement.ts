function createHTMLElement(
  type: string,
  props: Record<string, any> | null,
  ...children: any[]
) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}

function createTextElement(text: string) {
  return {
    type: "textNode",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

export { createHTMLElement, createTextElement };
