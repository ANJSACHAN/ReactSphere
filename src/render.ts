import { Element } from "../type";

 export const render = (element: Element, container: HTMLElement): void => {
   const dom: HTMLElement | Text =
     element.type === "textNode"
       ? document.createTextNode(element.props.nodeValue || "")
       : document.createElement(element.type);

   const isProperty = (key: string) => key !== "children";

   Object.keys(element.props)
     .filter(isProperty)
     .forEach((name) => {
       (dom as any)[name] = element.props[name];
     });

   element.props.children.forEach((child) => render(child, dom as HTMLElement));

   container.appendChild(dom);
 };

