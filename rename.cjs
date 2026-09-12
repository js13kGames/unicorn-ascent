// Token-aware identifier rewriting: never edits strings, comments or property names.
const { tokenizer } = require('acorn');
module.exports = function renameIdentifiers(source, names) {
  const tokens = [...tokenizer(source, { ecmaVersion: 'latest' })];
  let result = '', end = 0;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const previous = tokens[i - 1]?.type.label;
    const next = tokens[i + 1]?.type.label;
    if (token.type.label !== 'name' || !names[token.value] || previous === '.' || previous === '?.' || next === ':') continue;
    result += source.slice(end, token.start) + names[token.value];
    end = token.end;
  }
  return result + source.slice(end);
};
