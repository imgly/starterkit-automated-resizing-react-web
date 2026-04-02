import { useCallback, useRef, useState } from 'react';
import type CreativeEditorSDK from '@cesdk/cesdk-js';

import { DEFAULT_TEMPLATES } from '../constants';
import { resolveSceneUrl } from '../utils';

export function useEngine() {
  const cesdkRef = useRef<CreativeEditorSDK | null>(null);
  const [isReady, setIsReady] = useState(false);

  const handleInit = useCallback(async (cesdk: CreativeEditorSDK) => {
    cesdkRef.current = cesdk;
    cesdk.engine.editor.setSetting('page/title/show', false);

    // Pre-load initial template
    const template = DEFAULT_TEMPLATES[0];
    await cesdk.engine.scene.loadFromURL(resolveSceneUrl(template.sceneUrl));

    setIsReady(true);
  }, []);

  return {
    cesdk: cesdkRef.current,
    isReady,
    handleInit
  };
}
