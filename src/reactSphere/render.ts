import { Element, Fiber } from "./type";
import { commitWork } from "./commit";
import { createDom } from "./createDom";

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





function performUnitOfWork(fiber: Fiber): Fiber | null {
  const isFunctionComponent = fiber.type instanceof Function;

  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  // Return the child fiber if it exists
  if (fiber.child) {
    return fiber.child;
  }

  // Declare nextFiber outside the loop for proper scoping
  let nextFiber: Fiber | null = fiber;

  while (nextFiber) {
    // Return the sibling fiber if it exists
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    // Traverse up to the parent
    nextFiber = nextFiber.parent;
  }

  // Return null if no next fiber is found
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
function updateFunctionComponent(fiber: Fiber): void {
  // Ensure the fiber.type is a function and invoke it with props
  if (typeof fiber.type === "function") {
    const children = [fiber.type(fiber.props)];
    reconcileChildren(fiber, children);
  } else {
    throw new Error("Fiber type must be a function for a function component.");
  }
}

function updateHostComponent(fiber: Fiber): void {
  // Create a DOM node if it doesn't exist
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // Ensure fiber.props.children is an array and pass to reconcileChildren
  const children = Array.isArray(fiber.props.children)
    ? fiber.props.children
    : [fiber.props.children];
  reconcileChildren(fiber, children);
}