/** @jsx ReactSphere.createElement */
import { ReactSphere } from "../reactSphere";
import { Hello } from "./Hello";

export function App() {
  return (
    <div>
      <h1><Hello/></h1>
      <p>Welcome to my custom React-like implementation</p>
    </div>
  );
}