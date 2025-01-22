import { Element, Fiber } from "../type";

let nextUnitOfWork: Fiber | null = null;

export const render = (element: Element, container: HTMLElement): void => {
  nextUnitOfWork = {
    dom: container,
    type: "ROOT",
    parent: null,
    child: null,
    sibling: null,
    props: {
      children: [element],
    },
  };
  requestIdleCallback(workLoop); 
};

function workLoop(deadline: IdleDeadline): void {
  let shouldRun = false;
  while (nextUnitOfWork && !shouldRun) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldRun = deadline.timeRemaining() < 1;
  }
  if (nextUnitOfWork) {
    requestIdleCallback(workLoop); // Schedule the next work loop
  }
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

  if (fiber.parent) {
    fiber.parent.dom?.appendChild(fiber.dom);
  }

  const elements: Element[] = fiber.props.children;
  let index = 0;
  let prevSibling: Fiber | null = null;

  while (index < elements.length) {
    const element = elements[index];

    const newFiber: Fiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      child: null,
      sibling: null,
      dom: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else if (prevSibling) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }

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
