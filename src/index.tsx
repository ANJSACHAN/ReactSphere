/** @jsx ReactSphere.createElement */
import { ReactSphere } from "./reactSphere/index";
import { App } from "./components/App";



console.log('ReactSphere initializing...'); // Debug log

const container = document.getElementById("root");
console.log('Found container:', container); // Debug log

if (container) {
  console.log('Rendering App component...'); // Debug log
  ReactSphere.render(<App />, container);
} else {
  console.error("Container element #root not found!");
}
