export const _ = '_';

export const match = (function() {
  const toRegex = (str) => new RegExp(...str.split(/(?<!\\)\//g).slice(1));

  function matchesPattern(obj, pattern) {
    return Object.entries(pattern).every(
      ([key, value]) =>
        typeof value === 'object'
          ? matchesPattern(obj[key], value)
          : obj[key] === value || value === _
    );
  }

  function handleResult(cases, values, opts) {
    const matched = cases.find(({ args }) =>
      args.every(
        (arg, index) =>
          arg === _ || (opts && opts.regex
            ? arg.test(values[index])
            : opts && opts.pattern
              ? matchesPattern(values[index], arg)
              : arg === values[index])
      )
    );
    const result = (matched && matched.value) || cases.default;
    return typeof result === 'function' ? result() : result;
  };

  const getObj = (cases, values, opts) => ({
    case: (...args) => (value) =>
      getObj(cases.concat({ args, value }), values, opts),
    default: (value) =>
      getObj(Object.assign(cases, { default: value }), values, opts),
    value: () => handleResult(cases, values, opts),
    execute: () => handleResult(cases, values, opts),
  });

  const matchFunc = (opts) => (...values) => {
    const cases = [];
    return opts && opts.pattern
      ? getObj(cases, values, opts)
      : Object.assign(obj => {
          const correctCase = Object.keys(obj).find(
            key =>
              key === values.toString() ||
              key
                .split(',')
                .every(
                  (part, index) =>
                    (opts && opts.regex
                      ? toRegex(part).test(values[index])
                      : values[index].toString() === part) || part === _
                )
          );
          const result = obj[correctCase] || obj.default || obj._;
          return typeof result === 'function' ? result() : result;
        }, getObj(cases, values, opts));
  };

  return Object.assign(matchFunc(), {
    regex: matchFunc({ regex: true }),
    pattern: matchFunc({ pattern: true })
  });
})();

export default match;
