import { createHTMLElement, createTextElement } from "./createElement";
import { render } from "./render";

const ReactSphere = {
  createHTMLElement,
  createTextElement,
  render,
};

const a = ReactSphere.createHTMLElement(
  "h1", 
  { id: "h1" }, 
  ReactSphere.createTextElement("H1 Tag") 
);

const container = document.createElement("div");
ReactSphere.render(a, container);

document.body.appendChild(container);
