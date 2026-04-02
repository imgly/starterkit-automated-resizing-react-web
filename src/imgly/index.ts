/**
 * CE.SDK Automated Resizing Module
 *
 * This module provides a self-contained API for content-aware resizing
 * and editor initialization. Copy this folder to integrate automated
 * resizing into your own application.
 *
 * @example
 * ```typescript
 * // In index.ts - create cesdk and pass to app
 * import CreativeEditorSDK from '@cesdk/cesdk-js';
 * import { App } from './app';
 *
 * CreativeEditorSDK.create('#cesdk_container', config)
 *   .then(async (cesdk) => {
 *     const app = new App(cesdk);
 *     app.init();
 *   });
 *
 * // In app.ts - use cesdk for resize and editing
 * import { initDesignEditor, initAdvancedEditor, resize, DEFAULT_SIZES } from './imgly';
 *
 * // Generate variants using cesdk.engine
 * const variants = await resize({
 *   engine: cesdk.engine,
 *   sizes: DEFAULT_SIZES,
 *   sceneString: templateScene
 * });
 *
 * // Initialize design editor for variant editing (light theme)
 * await initDesignEditor(cesdk, { scene: variant.sceneString });
 *
 * // Or initialize advanced editor for template editing (dark theme)
 * await initAdvancedEditor(cesdk, { scene: templateScene });
 * ```
 *
 * @see https://img.ly/docs/cesdk/js/block-layout/content-aware-resize-2eb7ee/
 */

import CreativeEditorSDK from '@cesdk/cesdk-js';
import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

import { AdvancedEditorConfig } from './advanced-editor-config/plugin';
import { DesignEditorConfig } from './design-editor-config/plugin';
import type { InitOptions } from './types';

// ============================================================================
// Re-exports
// ============================================================================

// Types
// Utilities (consolidated in app layer)
export {
  getPlatformIconFilename,
  getSizeById,
  getSizesByPlatform
} from '../app/utils';
// Configuration plugins (for advanced use cases)
export { AdvancedEditorConfig } from './advanced-editor-config/plugin';
export { DesignEditorConfig } from './design-editor-config/plugin';
// Resizing functions
export { resize } from './resizing';
export type {
  AppConfig,
  InitOptions,
  ResizeOptions,
  SizePreset,
  Template,
  VariantBlob,
  VariantImage
} from './types';

// ============================================================================
// Public API
// ============================================================================

/**
 * Initialize the CE.SDK Design Editor.
 *
 * Configures the editor with a light theme optimized for variant editing.
 * Use this when users are editing generated variants.
 *
 * @param cesdk - The CreativeEditorSDK instance
 * @param options - Scene to load and optional onClose callback
 *
 * @example
 * ```typescript
 * await initDesignEditor(cesdk, {
 *   scene: variant.sceneString,
 *   onClose: () => closeModal()
 * });
 * ```
 */
export async function initDesignEditor(
  cesdk: CreativeEditorSDK,
  options: InitOptions
): Promise<void> {
  const { scene, onClose } = options;

  // Add design editor configuration plugin (handles resetEditor internally)
  await cesdk.addPlugin(new DesignEditorConfig());

  // Set light theme for design editor (after plugin to avoid being reset)
  cesdk.ui.setTheme('light');

  // Add asset source plugins
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new TextComponentAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());
  await cesdk.addPlugin(new StickerAssetSource());
  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());
  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new PagePresetsAssetSource());
  await cesdk.addPlugin(new CropPresetsAssetSource());
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload']
    })
  );

  // Configure back button to call onClose
  if (onClose) {
    const existingOrder = cesdk.ui.getComponentOrder({
      in: 'ly.img.navigation.bar'
    });
    const newOrder = existingOrder.map((item) =>
      item.id === 'ly.img.back.navigationBar'
        ? { ...item, onClick: onClose }
        : item
    );
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, newOrder);
  }

  // Load scene
  await cesdk.engine.scene.loadFromString(scene);

  // Zoom to fit page in view
  await cesdk.actions.run('zoom.toPage', { autoFit: true });
}

/**
 * Initialize the CE.SDK Advanced Editor.
 *
 * Configures the editor with a dark theme optimized for template editing.
 * Use this when users are editing the source template.
 *
 * @param cesdk - The CreativeEditorSDK instance
 * @param options - Scene to load and optional onClose callback
 *
 * @example
 * ```typescript
 * await initAdvancedEditor(cesdk, {
 *   scene: templateScene,
 *   onClose: () => closeModal()
 * });
 * ```
 */
export async function initAdvancedEditor(
  cesdk: CreativeEditorSDK,
  options: InitOptions
): Promise<void> {
  const { scene, onClose } = options;

  // Add advanced editor configuration plugin (handles resetEditor internally)
  await cesdk.addPlugin(new AdvancedEditorConfig());

  // Set dark theme for advanced editor (after plugin to avoid being reset)
  cesdk.ui.setTheme('dark');

  // Add asset source plugins
  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new TextComponentAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());
  await cesdk.addPlugin(new StickerAssetSource());
  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());
  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new PagePresetsAssetSource());
  await cesdk.addPlugin(new CropPresetsAssetSource());
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload']
    })
  );

  // Configure back button to call onClose
  if (onClose) {
    const existingOrder = cesdk.ui.getComponentOrder({
      in: 'ly.img.navigation.bar'
    });
    const newOrder = existingOrder.map((item) =>
      item.id === 'ly.img.back.navigationBar'
        ? { ...item, onClick: onClose }
        : item
    );
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, newOrder);
  }

  // Load scene
  await cesdk.engine.scene.loadFromString(scene);

  // Zoom to fit page in view
  await cesdk.actions.run('zoom.toPage', { autoFit: true });
}
