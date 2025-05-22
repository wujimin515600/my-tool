export const getEnvironment = ()=> {
  if (typeof window !== 'undefined' && window.document) {
    return 'browser';
  }
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    return 'node';
  }
  return 'unknown';
}