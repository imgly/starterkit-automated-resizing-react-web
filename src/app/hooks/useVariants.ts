import { useCallback, useRef, useState } from 'react';
import type CreativeEditorSDK from '@cesdk/cesdk-js';

import { resize } from '../../imgly';
import type { Template, VariantImage, SizePreset } from '../../imgly';
import { DEFAULT_SIZES } from '../constants';
import { resolveSceneUrl, downloadFromUrl } from '../utils';

/**
 * Fetch scene string from URL or return existing scene string.
 */
async function resolveScene(template: Template): Promise<string> {
  if (template.sceneString) {
    return template.sceneString;
  }
  const url = resolveSceneUrl(template.sceneUrl);
  const response = await fetch(url);
  return response.text();
}

function createInitialVariants(sizes: SizePreset[]): VariantImage[] {
  return sizes.map((size) => ({
    size,
    src: null,
    sceneString: null,
    isLoading: false
  }));
}

export function useVariants(
  cesdk: CreativeEditorSDK | null,
  isEngineReady: boolean
) {
  const [variants, setVariants] = useState<VariantImage[]>(() =>
    createInitialVariants(DEFAULT_SIZES)
  );
  const urlsRef = useRef<string[]>([]);

  const revokeUrls = useCallback(() => {
    urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    urlsRef.current = [];
  }, []);

  const generate = useCallback(
    async (template: Template) => {
      if (!cesdk || !isEngineReady) return;

      revokeUrls();

      // Set loading state
      setVariants(
        DEFAULT_SIZES.map((size) => ({
          size,
          src: null,
          sceneString: null,
          isLoading: true
        }))
      );

      try {
        // Resolve scene string (from template or fetch from URL)
        const scene = await resolveScene(template);

        await resize({
          engine: cesdk.engine,
          sizes: DEFAULT_SIZES,
          scene,
          onProgress: (completed, _total, variant) => {
            const url = URL.createObjectURL(variant.blob);
            urlsRef.current.push(url);

            setVariants((prev) =>
              prev.map((v, i) =>
                i === completed - 1
                  ? {
                      size: variant.size,
                      src: url,
                      sceneString: variant.sceneString,
                      isLoading: false
                    }
                  : v
              )
            );
          }
        });
      } catch (error) {
        console.error('Failed to generate variants:', error);
        setVariants(createInitialVariants(DEFAULT_SIZES));
      }
    },
    [cesdk, isEngineReady, revokeUrls]
  );

  const download = useCallback((variant: VariantImage) => {
    if (!variant.src) return;
    downloadFromUrl(variant.src, `${variant.size.label}.png`);
  }, []);

  return { variants, generate, download };
}
