import chalk from 'chalk';
import {readFileSync} from 'fs';

const version = readFileSync('version.txt', 'utf8');

export const banner = {
  asciiVersion: `hebvaccinemonitor
${version}`,
  render(ascii: boolean, hexColor: string) {
    return chalk
      .hex(hexColor)
      .bold(ascii ? this.asciiVersion : this.stringVersion);
  },
  stringVersion: `H E B V A C C I N E M O N I T O R
${version}`,
};
