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

export const to_8bit = ([r, g, b]) => [
  Math.min(255, Math.floor(r * 256)),
  Math.min(255, Math.floor(g * 256)),
  Math.min(255, Math.floor(b * 256)),
];

const xyz_to_linear_rgb = ([x, y, z]) => [
  3.2406 * x + -1.5372 * y + -0.4986 * z,
  -0.9689 * x + 1.8758 * y + 0.0415 * z,
  0.0557 * x -0.2040 * y + 1.0570 * z,
];

const linear_rgb_to_xyz = ([r, g, b]) => [
  0.4124 * r + 0.3576 * g + 0.1805 * b,
  0.2126 * r + 0.7152 * g + 0.0722 * b,
  0.0193 * r + 0.1192 * g + 0.9502 * b,
];

export const from_xyz = ([x, y, z], strict) => {
  let linear_rgb = xyz_to_linear_rgb([x, y, z]);
  const min = Math.min(... linear_rgb);
  const max = Math.max(... linear_rgb);
  if (max > 1) {
    throw new Error('Color value overflow');
  }
  if (min < 0) {
    if (strict) {
      throw new Error('Color outside the sRGB gamut');
    }
    const bias = 0 - min;
    const biased_linear_rgb = linear_rgb.map((a) => a + bias);
    const biased_xyz = linear_rgb_to_xyz(biased_linear_rgb);
    const ratio = y / biased_xyz[1];
    linear_rgb = biased_linear_rgb.map((a) => a * ratio);
  }
  const rgb = linear_rgb.map((a) => a > 0.0031308 ? 1.055 * a ** (1/2.4) - 0.055 : 12.92 * a);
  return rgb;
};

export const to_xyz = ([r, g, b], strict) => {
  const linear_rgb = [r, g, b].map((a) => a > 0.04045 ? ((a + 0.055) / 1.055) ** 2.4 : a / 12.92);
  const xyz = linear_rgb_to_xyz(linear_rgb);
  return xyz;
};
