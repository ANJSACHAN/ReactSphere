export interface Element {
    type: string;
    props: {
      [key: string]: any;
      children: Element[];
      nodeValue?: string;
    };
  }
  

  export interface fiber{
    dom : HTMLElement | Text,
    props : {
      children : [Element]
    }
  }
