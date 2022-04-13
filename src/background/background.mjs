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

import * as srgb from '/modules/srgb.mjs';
globalThis.srgb = srgb;

import * as cieluv from '/modules/cieluv.mjs';
globalThis.cieluv = cieluv;

import * as random from '/modules/random.mjs';
globalThis.random = random;

import {config} from '../modules/config.mjs';

let config_color_preference = 'both';
config.observe('color_preference', (value) => {
  if (undefined !== value) {
    config_color_preference = value;
  } else {
    config.set('color_preference', 'both');
  }
});

const whitepoint = srgb.to_xyz([1, 1, 1]);

const L_MAX = 100;
const L_MIN = 0;

const U_MAX = 220;
const U_MIN = -134;

const V_MAX = 122;
const V_MIN = -140;

const PARTICLE_VELOCITY = 1;

const RESISTANCE = .1;

let l = 0;
let u = 0;
let v = 0;

let velocity_l = 0;
let velocity_u = 0;
let velocity_v = 0;

let previous_color_prefence = 'both';

globalThis.set_theme_color_cieluv = ([l, u, v], strict) => {
  if (l > 100 || l < 0 && strict) {
    throw new TypeError('Out of range');
  }
  if (l >= 50 && config_color_preference == 'dark') {
    if (previous_color_prefence == 'both') {
      previous_color_prefence = 'dark';
      return reset();
    }
    throw new TypeError('Out of range');
  } else if (l <= 50 && config_color_preference == 'light') {
    if (previous_color_prefence == 'both') {
      previous_color_prefence = 'light';
      return reset();
    }
    throw new TypeError('Out of range');
  }
  previous_color_prefence = config_color_preference;
  const xyz = cieluv.to_xyz([l, u, v], whitepoint);
  const rgb = srgb.from_xyz(xyz, strict);
  const rgb_8bit = srgb.to_8bit(rgb);
  const text_color = l > 50 ? 'black' : 'white';
  const promise = browser.theme.update({
    colors: {
      frame: rgb_8bit,
      tab_background_text: text_color,
    },
  });
  const velocity = Math.sqrt(velocity_l ** 2 + velocity_u ** 2 + velocity_v ** 2);
  console.log('(L*, u*, v*) = (%f, %f, %f), velocity = (%f, %f, %f), speed = %f', l, u, v, velocity_l, velocity_u, velocity_v, velocity);
  return promise;
};

globalThis.reset = () => {
  while (true) {
    try {
      return set_theme_color_cieluv([
        l = random.range(L_MIN, L_MAX),
        u = random.range(U_MIN, U_MAX),
        v = random.range(V_MIN, V_MAX),
      ], true);
    } catch (e) {}
  }
};

globalThis.tick = () => {
  const velocity = Math.sqrt(velocity_l ** 2 + velocity_u ** 2 + velocity_v ** 2);
  velocity_l *= 1 - RESISTANCE;
  velocity_u *= 1 - RESISTANCE;
  velocity_v *= 1 - RESISTANCE;
  const particle_velocity = Math.abs(PARTICLE_VELOCITY * random.normal());
  const theta = 2 * Math.PI * random.random();
  const phi = Math.acos(1 - 2 * random.random());
  const d_velocity_l = Math.sin(phi) * Math.cos(theta) * particle_velocity;
  const d_velocity_u = Math.sin(phi) * Math.sin(theta) * particle_velocity;
  const d_velocity_v = Math.cos(phi) * particle_velocity;
  velocity_l += d_velocity_l
  velocity_u += d_velocity_u;
  velocity_v += d_velocity_v;

  const init_l = l;
  const init_u = u;
  const init_v = v;
  do {
    l = init_l + velocity_l;
    u = init_u + velocity_u;
    v = init_v + velocity_v;
    try {
      return set_theme_color_cieluv([l, u, v], true);
    } catch (e) {
      console.log('Bounced');
      const velocity = Math.sqrt(velocity_l ** 2 + velocity_u ** 2 + velocity_v ** 2);
      const theta = 2 * Math.PI * random.random();
      const phi = Math.acos(1 - 2 * random.random());
      velocity_l = Math.sin(phi) * Math.cos(theta) * velocity;
      velocity_u = Math.sin(phi) * Math.sin(theta) * velocity;
      velocity_v = Math.cos(phi) * velocity;
      continue;
    }
  } while (true);
}

reset().catch((e) => {
  console.error(e);
});

setInterval(() => tick(), 1000);

browser.browserAction.onClicked.addListener((tab) => {
  browser.runtime.openOptionsPage().catch((e) => {
    console.error(e);
  });
});

