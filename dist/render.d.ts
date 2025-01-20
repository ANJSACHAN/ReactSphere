interface Element {
    type: string;
    props: {
        [key: string]: any;
        children: Element[];
        nodeValue?: string;
    };
}
export declare const render: (element: Element, container: HTMLElement) => void;
export {};
