/** @jsx ReactSphere.createElement */
import { ReactSphere } from "./reactSphere";
import { App } from "./components/App";

const element = <App />; // This should now correctly use ReactSphere.createElement
const container = document.getElementById("root");


console.log(element)
// if (container) {
//   ReactSphere.render(element, container);  // Pass the JSX element to your custom render function
// } else {
//   console.error("Container not found!");
// }
