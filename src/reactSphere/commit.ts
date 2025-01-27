import { Fiber } from "./type";

export function commitWork(fiber: Fiber | null): void {
    if (!fiber) return;
  
    
    const parentDom = findParentDom(fiber);
  
    
    if (fiber.status === "INSERT" && fiber.dom) {
      parentDom?.appendChild(fiber.dom);
    } else if (fiber.status === "DELETE") {
      commitDeletion(fiber, parentDom);
    } else if (fiber.status === "UPDATE" && fiber.dom) {
      updateDom(fiber.dom, fiber.alternate?.props || {}, fiber.props);
    }
  
  
    commitWork(fiber.child);
    commitWork(fiber.sibling);
  }
  
  function commitDeletion(fiber: Fiber, parentDom: HTMLElement | null): void {
    if (!parentDom) return;
  
    if (fiber.dom) {
    
      parentDom.removeChild(fiber.dom);
    } else {
     
      if (fiber.child) {
        commitDeletion(fiber.child, parentDom);
      }
    }
  }
  
  function findParentDom(fiber: Fiber): HTMLElement | null {
    let parent = fiber.parent;
    while (parent && !parent.dom) {
      parent = parent.parent;
    }
    return parent?.dom as HTMLElement | null;
  }
  

function updateDom(
  dom: HTMLElement | Text,
  prevProps: any,
  nextProps: any
): void {
  const isProperty = (key: string) => key !== "children" && key !== "nodeValue";

  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .forEach((name) => {
      if (!(name in nextProps)) {
        if (name in dom) {
          (dom as any)[name] = "";
        } else {
          (dom as HTMLElement).removeAttribute(name);
        }
      }
    });

  // Add new properties
  Object.keys(nextProps)
    .filter(isProperty)
    .forEach((name) => {
      if (prevProps[name] !== nextProps[name]) {
        if (name in dom) {
          (dom as any)[name] = nextProps[name];
        } else {
          (dom as HTMLElement).setAttribute(name, nextProps[name]);
        }
      }
    });
}
