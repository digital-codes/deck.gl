# PointLight

Create a point light source which emits from a point in all directions. At most 5 directional lights can be supported.

<div align="center">
  <div>
    <img src="https://raw.github.com/visgl/deck.gl-data/master/images/whats-new/point-light.gif" />
    <p><i>Two spheres with point light</i></p>
  </div>
</div>

## Usage

Create a point light source with color, intensity and position.
```js
const pointLight= new PointLight({
  color: [128, 128, 0],
  intensity: 2.0,
  position: [0, 0, 200]
});
```

## Methods

### constructor

The constructor for the `PointLight` class. Use this to create a new `PointLight`.

```js
const pointLight = new PointLight({color, intensity, position});
```

* `color` - (number[3],)  RGB color of point light source, default value is `[255, 255, 255]`.
* `intensity` - (number) Strength of point light source, default value is `1.0`.
* `position` - (number[3])  Location of point light source, default value is `[0, 0, 1]`.The coordinate system of the position depends on the current [view](./deck.md#views): `[longitude, latitude, altitude]` in geospatial views and world position in non-geospatial views.
* `attenuation` = (number[3]) Light attenuation coefficients: `[C_constant, C_linear, C_quadratic]`. Reduces the intensity based on the distance `D` from the light:
   ```
   Intensity = Intensity / (C_constant + C_linear * D + C_quadratic * D * D)
   ```
     * For (approximately) physically correct attenuation, use `attenuation: [1, 0, n]`.
     * Default: `[1, 0, 0]` (no attenuation due to distance).

## Source

[/modules/core/src/effects/lighting/point-light.ts](https://github.com/visgl/deck.gl/tree/master/modules/core/src/effects/lighting/point-light.ts)
