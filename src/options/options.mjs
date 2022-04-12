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

import {config} from '../modules/config.mjs';

const select_color_preference = document.querySelector('#select-color_preference');

config.observe('color_preference', (value) => {
  if (undefined === value) {
    return;
  }
  select_color_preference.value = value;
});

select_color_preference.addEventListener('change', (ev) => {
  config.set('color_preference', ev.target.value).catch((e) => {
    console.error(e);
  });
});
