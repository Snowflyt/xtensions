import { extension } from 'xtensions';

const stringExtensions = extension('string', (s) => ({
  emphasize: (level: number = 1) => s + '!'.repeat(level),

  trimIndent: () => {
    const lines = s.split('\n');
    let minIndent = Infinity;
    for (const line of lines) {
      if (line.trim() === '') continue;
      const indent = line.search(/\S/);
      if (indent !== -1) minIndent = Math.min(minIndent, indent);
    }
    return lines
      .map((line) => line.slice(minIndent))
      .join('\n')
      .trim();
  },
}));

export default stringExtensions;
