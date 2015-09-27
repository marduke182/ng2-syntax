let count = 0;
export default ({prefix = ''} = {}) => {
  const id = ++count;
  return `${prefix}${id}`;
};

export function reset() {
  count = 0;
}
