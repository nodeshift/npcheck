module.exports = {
  error: (reason) => ({
    type: 'error',
    reason
  }),
  warning: (reason) => ({
    type: 'warning',
    reason
  }),
  merge: (source, target) => {
    // if we get null return the source array
    if (!target) return source;
    // if we get an array merge it with the source array
    if (Array.isArray(target)) {
      return [...source, ...target];
    }
    // if we get object append target to source
    return [...source, target];
  }
};
