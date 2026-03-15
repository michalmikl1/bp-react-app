export const colors = [
  ['#6a11cb', '#2575fc'], ['#ff416c', '#ff4b2b'], ['#ff5f6d', '#ffc371'], ['#00c6ff', '#0072ff'], ['#11998e', '#38ef7d'],
  ['#fc4a1a', '#f7b733'], ['#f7971e', '#ffd200'], ['#2193b0', '#6dd5ed'], ['#ee0979', '#ff6a00'], ['#4568dc', '#b06ab3'],
  ['#fc5c7d', '#6a82fb'], ['#00c3ff', '#ffff1c'], ['#1a2a6c', '#b21f1f'], ['#0f2027', '#2c5364'], ['#1f4037', '#99f2c8'],
];

export const getRandomGradient = () => {
  const index = Math.floor(Math.random() * colors.length);
  return `linear-gradient(135deg, ${colors[index][0]}, ${colors[index][1]})`;
};
