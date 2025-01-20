import { createHTMLElement, createTextElement } from "./createElement";
import { render } from "./render";
var ReactSphere = {
  createHTMLElement: createHTMLElement,
  createTextElement: createTextElement,
  render: render
};
var a = ReactSphere.createHTMLElement("h1", {
  id: "h1"
}, ReactSphere.createTextElement("H1 Tag"));
var container = document.createElement("div");
ReactSphere.render(a, container);
document.body.appendChild(container);
// "start": "tsx src/index.ts"