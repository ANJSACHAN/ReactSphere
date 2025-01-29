import { Fiber } from "./type";

export function createDom(fiber: Fiber): HTMLElement | Text {
  console.log('Creating DOM for fiber:', fiber); // Debug log
  
  const dom = fiber.type === "TEXT"  // Changed from "textNode" to match createElement
    ? document.createTextNode(fiber.props.nodeValue || "")
    : document.createElement(fiber.type as string);

  const isProperty = (key: string) => key !== "children" && key !== "nodeValue";

  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      if (name in dom) {
        (dom as any)[name] = fiber.props[name];
      } else {
        (dom as HTMLElement).setAttribute(name, fiber.props[name]);
      }
    });

  console.log('Created DOM element:', dom); // Debug log
  return dom;
}