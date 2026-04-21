// utils/diff.js
export const computeChanges = (oldData, newData) => {
  const changes = {};
  const allKeys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);
  
  for (let key of allKeys) {
    const oldVal = oldData[key] || '';
    const newVal = newData[key] || '';
    if (oldVal !== newVal) {
      changes[key] = { old: oldVal, new: newVal };
    }
  }
  return Object.keys(changes).length > 0 ? changes : null;
};