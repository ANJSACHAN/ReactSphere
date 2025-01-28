/** @jsx ReactSphere.createElement */
import { ReactSphere } from "./reactSphere";
import { App } from "./components/App";
import { Element } from "./reactSphere/type"; // Keep this import

// Convert JSX.Element to ReactSphere.Element
const element: Element = {
  type: App,
  props: {
    children: [], // App doesn't have children here
  },
};

const container = document.getElementById("root");

if (container) {
  ReactSphere.render(element, container);
} else {
  console.error("Container not found!");
}
