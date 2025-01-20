declare function createHTMLElement(type: string, props: Record<string, any> | null, ...children: any[]): {
    type: string;
    props: {
        children: any[];
    };
};
declare function createTextElement(text: string): {
    type: string;
    props: {
        nodeValue: string;
        children: never[];
    };
};
export { createHTMLElement, createTextElement };
