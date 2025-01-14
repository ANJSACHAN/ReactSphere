export function createHTMLElement(
  type: string,
  props: Record<string, any> | null,
  ...children: any[]
) {
  return {
    type: type,
    props: {
      ...props,
      children: children,
    },
  };
}

export function createTextElement(text: string) {
  return {
    type: "Text Element",
    props: {
      nodeValue: text,
      children: [] as any[],
    },
  };
}
