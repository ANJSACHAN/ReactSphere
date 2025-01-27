import { createHTMLElement } from "./createElement";
import { render } from "./render";

export const ReactSphere = { 
  createElement : createHTMLElement,
  render,
  Fragment: (props: { children: any[] }) => props.children
};


