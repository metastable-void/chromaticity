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

const k = 1.380649e-23;
const h = 6.62607015e-34;
const c = 299792458;

export const blackbody = (t) => ((wavelength) => {
  return 2 * h * (c ** 2) / (wavelength ** 5) / (Math.exp(h * c / wavelength / t / k) - 1);
});
