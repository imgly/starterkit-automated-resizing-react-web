/**
 * Navigation Bar Configuration - Advanced Editor (Source Template Editing)
 *
 * Configure the navigation bar for template editing mode with full features.
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/navigation-bar-4e5d39/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Configure the navigation bar layout for template editing.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupNavigationBar(cesdk: CreativeEditorSDK): void {
  cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
    // ============================
    // Left Section - Back & History
    // ============================
    'ly.img.back.navigationBar',
    'ly.img.undoRedo.navigationBar',
    'ly.img.pageResize.navigationBar',

    // ============================
    // Center Section - Title
    // ============================
    'ly.img.spacer',
    'ly.img.title.navigationBar',
    'ly.img.spacer',

    // ============================
    // Right Section - Zoom & Actions
    // ============================
    'ly.img.zoom.navigationBar',
    {
      id: 'ly.img.actions.navigationBar',
      children: [
        'ly.img.saveScene.navigationBar',
        'ly.img.exportScene.navigationBar',
        'ly.img.importScene.navigationBar',
        'ly.img.importArchive.navigationBar'
      ]
    }
  ]);
}
