export function createButton(id, text, href) {
  const button = document.createElement("a");
  button.classList.add(id);
  button.id = "btn-main";
  button.href = href;
  button.textContent = text;
  return button;
}

