// deck.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {LayerManager, DeckRenderer} from '@deck.gl/core';
import {device} from '@deck.gl/test-utils';

// Helper class to execute lifecycle methods
// TODO - move to test-utils?
export class LifecycleTester {
  constructor() {
    const layerManager = new LayerManager(device, {});
    this.layerManager = layerManager;
    this.deckRenderer = new DeckRenderer(device);
    this.viewport = this.layerManager.context.viewport;
    this.effects = [];
    this.effectContext = {
      device,
      deck: {
        _addDefaultShaderModule: layerManager.addDefaultShaderModule.bind(layerManager),
        _removeDefaultShaderModule: layerManager.removeDefaultShaderModule.bind(layerManager)
      }
    };
    this.layerManager.setProps({
      onError: error => {
        throw error;
      }
    });
  }

  get layers() {
    return this.layerManager.getLayers();
  }

  async update({viewport, layers, effects}) {
    const {layerManager} = this;
    if (viewport) {
      this.viewport = viewport;
    }
    if (effects) {
      this.effects = effects;
      for (const effect of effects) {
        effect.setup(this.effectContext);
      }
    }
    if (layers) {
      layerManager.setLayers(layers);
    }
    this.render();

    while (!this.layers.every(l => l.isLoaded) || layerManager.needsUpdate()) {
      await this._update();
    }
  }

  render(opts) {
    this.deckRenderer.renderLayers({
      pass: 'screen',
      layers: this.layers,
      viewports: [this.viewport],
      effects: this.effects,
      onViewportActive: this.layerManager.activateViewport,
      ...opts
    });
  }

  finalize() {
    this.layerManager.finalize();
    this.deckRenderer.finalize();
    for (const effect of this.effects) {
      effect.cleanup(this.effectContext);
    }
  }

  async _update() {
    return new Promise(resolve => {
      const onAnimationFrame = () => {
        if (this.layerManager.needsUpdate()) {
          this.layerManager.updateLayers();

          this.render();
          resolve();
          return;
        }
        setTimeout(onAnimationFrame, 50);
      };
      onAnimationFrame();
    });
  }
}
