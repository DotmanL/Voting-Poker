export function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
  if (
    event &&
    event.type === "keydown" &&
    ((event as React.KeyboardEvent).key === "Enter" ||
      ((event as React.KeyboardEvent).key === "Shift" &&
        (event as React.KeyboardEvent).key === "Enter"))
  ) {
    event.preventDefault();
    const inputEl = event.target as HTMLInputElement;
    const start = inputEl.selectionStart as number;
    const end = inputEl.selectionEnd as number;
    const value = inputEl.value as string;

    inputEl.value = value.slice(0, start) + "\n" + value.slice(end);
    inputEl.setSelectionRange(start + 1, start + 1);
  } else if (event.key === "Backspace") {
    const inputEl = event.target as HTMLInputElement;
    const start = inputEl.selectionStart as number;
    const end = inputEl.selectionEnd as number;
    const value = inputEl.value as string;

    if (start === end && start !== 0 && value[start - 1] === "\n") {
      event.preventDefault();
      inputEl.setSelectionRange(start - 1, start - 1);
    }
  }
}
