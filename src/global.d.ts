import { ReactSphere } from "./reactSphere";

declare global {
  namespace JSX {
    interface Element extends ReactSphere.Element {}
    interface IntrinsicElements {
      div: ReactSphere.Element;
      span: ReactSphere.Element;
      p: ReactSphere.Element;
      h1: ReactSphere.Element;
      h2: ReactSphere.Element;
      button: ReactSphere.Element;
      [elemName: string]: ReactSphere.Element;
    }
  }
}