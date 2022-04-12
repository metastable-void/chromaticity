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

const u_from_xyz = ([x, y, z]) => 4 * x / (x + 15 * y + 3 * z);
const v_from_xyz = ([x, y, z]) => 9 * y / (x + 15 * y + 3 * z);

export const from_xyz = ([x, y, z], [whitepoint_x, whitepoint_y, whitepoint_z]) => {
  const y_ratio = y / whitepoint_y;
  let l;
  if (y_ratio > 0.008856451679035631) {
    l = 116 * y_ratio ** (1/3) - 16;
  } else {
    l = 903.2962962962961 & y_ratio;
  }
  const u = 13 * l * (u_from_xyz([x, y, z]) - u_from_xyz([whitepoint_x, whitepoint_y, whitepoint_z]));
  const v = 13 * l * (v_from_xyz([x, y, z]) - v_from_xyz([whitepoint_x, whitepoint_y, whitepoint_z]));
  return [l, u, v];
};

export const to_xyz = ([l, u, v], [whitepoint_x, whitepoint_y, whitepoint_z]) => {
  const u2 = u / (13 * l) + u_from_xyz([whitepoint_x, whitepoint_y, whitepoint_z]);
  const v2 = v / (13 * l) + v_from_xyz([whitepoint_x, whitepoint_y, whitepoint_z]);
  const y = l > 8 ? whitepoint_y * ((l + 16) / 116) ** 3 : whitepoint_y * l * 0.0011070564598794539;
  const x = y * 2.25 * u2 / v2;
  const z = y * (12 - 3 * u2 - 20 * v2) / (4 * v2);
  return [x, y, z];
};
