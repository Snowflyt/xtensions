import { extension } from 'xtensions';

const dateExtensions = extension('Date', (d) => ({
  format: (fmt: string) => {
    const o = {
      'M+': d.getMonth() + 1,
      'd+': d.getDate(),
      'h+': d.getHours(),
      'm+': d.getMinutes(),
      's+': d.getSeconds(),
      'q+': Math.floor((d.getMonth() + 3) / 3),
      S: d.getMilliseconds(),
    };

    const match = /(y+)/.exec(fmt);
    if (match)
      fmt = fmt.replace(
        match[1]!,
        d
          .getFullYear()
          .toString()
          .slice(4 - match[1]!.length),
      );

    for (const k in o) {
      const match = new RegExp(`(${k})`).exec(fmt);
      if (match)
        fmt = fmt.replace(
          match[1]!,
          match[1]!.length === 1
            ? o[k as keyof typeof o].toString()
            : `00${o[k as keyof typeof o]}`.slice(
                o[k as keyof typeof o].toString().length,
              ),
        );
    }

    return fmt;
  },
}));

export default dateExtensions;
