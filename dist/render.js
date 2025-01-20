var _render = function render(element, container) {
  var dom = element.type === "textNode" ? document.createTextNode(element.props.nodeValue || "") : document.createElement(element.type);
  var isProperty = function isProperty(key) {
    return key !== "children";
  };
  Object.keys(element.props).filter(isProperty).forEach(function (name) {
    dom[name] = element.props[name];
  });
  element.props.children.forEach(function (child) {
    return _render(child, dom);
  });
  container.appendChild(dom);
};
export { _render as render };