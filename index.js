let state = {
  hash: window.location.hash,
  inputValue: localStorage.getItem("inputValue"),
  todos: JSON.parse(localStorage.getItem("todos")) ?? [
    { title: "Eat" },
    { title: "Sleep" },
    { title: "Code" },
  ],
};

function setState(newState) {
  const prevState = { ...state };
  const nextState = { ...state, ...newState };
  state = nextState;
  render();
  onStateChange(prevState, nextState);
}

function onStateChange(prevState, nextState) {
  if (prevState.path !== nextState.path) {
    history.pushState(null, "", nextState.path);
  } else if (prevState.inputValue !== nextState.inputValue) {
    localStorage.setItem("inputValue", nextState.inputValue);
  } else if (prevState.todos !== nextState.todos) {
    localStorage.setItem("todos", JSON.stringify(nextState.todos));
  }
}

function Link(props) {
  const a = document.createElement("a");
  a.href = props.href;
  a.textContent = props.label;
  a.onclick = function (event) {
    event.preventDefault();
    const url = new URL(event.target.href);
    setState({ hash: url.hash });
    history.pushState(null, "", url.hash);
  };
  return a;
}

function Navbar() {
  const linkHome = Link({ href: "#home", label: "Home" });
  const linkAbout = Link({ href: "#about", label: "About" });

  const div = document.createElement("div");
  div.append(linkHome);
  div.append(linkAbout);

  return div;
}

function TodoItem(props) {
  const titleText = document.createElement("span");
  titleText.textContent = props.title;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.onclick = function () {
    const newTodos = state.todos.filter((_, index) => index !== props.index);
    setState({ todos: newTodos });
  };

  const div = document.createElement("div");
  div.append(titleText);
  div.append(deleteButton);

  return div;
}

function TodoList() {
  const items = state.todos.map((todo, index) =>
    TodoItem({ title: todo.title, index })
  );
  const div = document.createElement("div");
  div.append(...items);
  return div;
}

function TodoInput() {
  const input = document.createElement("input");
  input.id = "input";
  input.value = state.inputValue;
  input.placeholder = "enter your name";
  input.oninput = function (event) {
    setState({ inputValue: event.target.value });
  };

  const buttonClear = document.createElement("button");
  buttonClear.textContent = "Clear";
  buttonClear.onclick = function () {
    setState({ inputValue: "" });
  };

  const buttonSubmit = document.createElement("button");
  buttonSubmit.textContent = "Submit";
  buttonSubmit.onclick = function () {
    const newTodos = state.todos.concat({ title: state.inputValue });
    setState({ inputValue: "", todos: newTodos });
  };

  const div = document.createElement("div");
  div.append(input);
  div.append(buttonClear);
  div.append(buttonSubmit);
  return div;
}

function HomePage() {
  const navbar = Navbar();

  const p = document.createElement("p");
  p.textContent = "Welcome to Home Page";

  const textPreview = document.createElement("p");
  textPreview.textContent = state.inputValue;

  const div = document.createElement("div");
  div.append(navbar);
  div.append(p);
  div.append(TodoInput());
  div.append(textPreview);
  div.append(TodoList());

  return div;
}

function AboutPage() {
  const linkHome = Link({ href: "#home", label: "Back to Home" });

  const p = document.createElement("p");
  p.textContent = "Welcome to About Page";

  const div = document.createElement("div");
  div.appendChild(linkHome);
  div.appendChild(p);
  return div;
}

function App() {
  const homePage = HomePage();
  const aboutPage = AboutPage();

  if (state.hash == "#home") {
    return homePage;
  } else if (state.hash == "#about") {
    return aboutPage;
  } else {
    return homePage;
  }
}

function render() {
  const focusedElementId = document.activeElement.id;
  const focusedElementSelectionStart = document.activeElement.selectionStart;
  const focusedElementSelectionEnd = document.activeElement.selectionEnd;

  const root = document.getElementById("root");
  const app = App();
  root.innerHTML = "";
  root.appendChild(app);

  if (focusedElementId) {
    const focusedElement = document.getElementById(focusedElementId);
    focusedElement.focus();
    focusedElement.selectionStart = focusedElementSelectionStart;
    focusedElement.selectionEnd = focusedElementSelectionEnd;
  }
}

render();
