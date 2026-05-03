/**
 * validate — Lightweight request-parameter validator middleware.
 *
 * Usage:
 *   router.get('/:pincode', validate.params('pincode'), controller.fn);
 *   router.get('/', validate.query('q', { minLength: 2 }), controller.fn);
 */
const validate = {
  /** Ensure named route params are present and non-empty. */
  params: (...names) => (req, res, next) => {
    for (const name of names) {
      if (!req.params[name] || !req.params[name].trim()) {
        return res.status(400).json({ error: `Missing required parameter: ${name}` });
      }
    }
    next();
  },

  /** Ensure named query-string params meet minimum-length rules. */
  query: (name, opts = {}) => (req, res, next) => {
    const val = req.query[name];
    if (opts.required && (!val || !val.trim())) {
      return res.status(400).json({ error: `Missing required query parameter: ${name}` });
    }
    if (val && opts.minLength && val.trim().length < opts.minLength) {
      return res.status(400).json({ error: `Parameter "${name}" must be at least ${opts.minLength} characters` });
    }
    next();
  },
};

module.exports = validate;
