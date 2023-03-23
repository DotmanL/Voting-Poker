const primaryColors = [
  "#007bff",
  "#6610f2",
  "#6f42c1",
  "#dc3545",
  "#fd7e14",
  "#ffc107",
  "#28a745"
];
const secondaryColors = [
  "#6c757d",
  "#343a40",
  "#007bff",
  "#6610f2",
  "#6f42c1",
  "#dc3545",
  "#fd7e14"
];

export const getRandomColor = () => {
  const colors = Math.random() < 0.5 ? primaryColors : secondaryColors;
  return colors[Math.floor(Math.random() * colors.length)];
};
