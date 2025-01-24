import { Element, Fiber } from "../type";

let nextUnitOfWork: Fiber | null = null;
let progress_Root: Fiber | null = null;
let currentRoot: Fiber | null = null;
const deletions: Fiber[] = [];

export const render = (element: Element, container: HTMLElement): void => {
  progress_Root = {
    dom: container,
    type: "ROOT",
    parent: null,
    child: null,
    sibling: null,
    props: {
      children: [element],
    },
    alternate: currentRoot,
    status: null,
  };

  deletions.length = 0; 
  nextUnitOfWork = progress_Root;
  requestIdleCallback(workLoop);
};

function workLoop(deadline: IdleDeadline): void {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (nextUnitOfWork) {
    requestIdleCallback(workLoop);
  } else if (!nextUnitOfWork && progress_Root) {
    commitRoot();
  }
}

function commitRoot(): void {
  deletions.forEach(commitWork); // Commit deletions first
  if (progress_Root?.child) {
    commitWork(progress_Root.child); // Commit the rest of the tree
  }
  currentRoot = progress_Root;
  progress_Root = null;
}

function commitWork(fiber: Fiber | null): void {
  if (!fiber) return;

  const parentDom = findParentDom(fiber);

  if (fiber.status === "INSERT" && fiber.dom) {
    parentDom?.appendChild(fiber.dom);
  } else if (fiber.status === "DELETE" && fiber.dom) {
    parentDom?.removeChild(fiber.dom);
  } else if (fiber.status === "UPDATE" && fiber.dom) {
    updateDom(fiber.dom, fiber.alternate?.props || {}, fiber.props);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function findParentDom(fiber: Fiber): HTMLElement | null {
  let parent = fiber.parent;
  while (parent && !parent.dom) {
    parent = parent.parent;
  }
  return parent?.dom as HTMLElement | null;
}

function updateDom(dom: HTMLElement | Text, prevProps: any, nextProps: any): void {
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

function createDom(fiber: Fiber): HTMLElement | Text {
  const dom =
    fiber.type === "textNode"
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

  return dom;
}

function performUnitOfWork(fiber: Fiber): Fiber | null {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  const elements = fiber.props.children || [];
  reconcileChildren(fiber, elements);

  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber: Fiber | null = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }

  return null;
}

function reconcileChildren(fiber: Fiber, elements: Element[]): void {
  let oldFiber = fiber.alternate?.child || null;
  let prevSibling: Fiber | null = null;

  for (let i = 0; i < elements.length || oldFiber !== null; i++) {
    const element = elements[i];
    let newFiber: Fiber | null = null;

    const areSame = oldFiber && element && oldFiber.type === element.type;

    if (areSame && oldFiber) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: fiber,
        child: null,
        sibling: null,
        alternate: oldFiber,
        status: "UPDATE",
      };
    } else {
      if (element) {
        newFiber = {
          type: element.type,
          props: element.props,
          dom: null,
          parent: fiber,
          child: null,
          sibling: null,
          alternate: null,
          status: "INSERT",
        };
      }
      if (oldFiber) {
        oldFiber.status = "DELETE";
        deletions.push(oldFiber);
      }
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (i === 0) {
      fiber.child = newFiber;
    } else if (prevSibling) {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
  }
}
