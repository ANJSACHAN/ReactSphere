import { createElement } from "./createElement";
import { render } from "./render";
export { render } from './render';
export { createDom } from "./createDom";
export * from "./type";

export const ReactSphere = { 
  createElement ,
  render,
  Fragment: (props: { children: any[] }) => props.children
};


