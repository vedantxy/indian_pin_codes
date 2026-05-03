/**
 * asyncHandler — Eliminates try/catch boilerplate in Express route handlers.
 * Wraps an async function and forwards any rejected promise to next().
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
