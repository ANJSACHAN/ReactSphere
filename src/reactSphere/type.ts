export interface Element {
  type: string | Function;
  props: {
    [key: string]: any;
    children: Element[]; 
    nodeValue?: string; 
  };
}

export interface Fiber {
  dom: HTMLElement | Text | null;
  type: string | Function;
  parent: Fiber | null;
  child: Fiber | null;
  sibling: Fiber | null;
  props: {
    children: Element[];
    [key: string]: any;
  };
  status: "INSERT" | "UPDATE" | "DELETE" | null;
  alternate: Fiber | null;
}

export const deletions: Fiber[] = [];


