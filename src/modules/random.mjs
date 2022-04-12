// vim: ts=2 sw=2 et ai
/*
  Chromaticity
  Copyright (C) 2022 Menhera.org

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

export const random = () => {
  const buffer = new ArrayBuffer(8);
  const bytes = new Uint8Array(buffer);
  crypto.getRandomValues(bytes);
  bytes[0] = 0b00111111;
  bytes[1] = 0b11110000 | 0b00001111 & bytes[1];
  return (new DataView(buffer)).getFloat64(0, false) - 1;
};

export const range = (a, b) => {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return random() * (max - min) + min;
};

export const normal = () => {
  const a = 1 - random();
  const b = random();
	return Math.sqrt(-2 * Math.log(a)) * Math.sin(2 * Math.PI * b);
};
