declare namespace JSX {
    interface Element {
      type: string | Function;
      props: {
        [key: string]: any;
        children: Element[];
        nodeValue?: string;
      }
    }
    
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }