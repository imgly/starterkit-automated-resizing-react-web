import { useCallback, useEffect } from 'react';
import CreativeEditor from '@cesdk/cesdk-js/react';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { Configuration } from '@cesdk/cesdk-js';

import {
  initAutomatedResizingDesignEditor,
  initAutomatedResizingAdvancedEditor
} from '../../imgly';

import styles from './EditorModal.module.css';

type EditorMode = 'design' | 'advanced';

interface EditorModalProps {
  config: Partial<Configuration>;
  isOpen: boolean;
  scene: string;
  mode: EditorMode;
  onClose: () => void;
}

export function EditorModal({
  config,
  isOpen,
  scene,
  mode,
  onClose
}: EditorModalProps) {
  const handleInit = useCallback(
    async (cesdk: CreativeEditorSDK) => {
      // Select the appropriate editor based on mode
      if (mode === 'design') {
        await initAutomatedResizingDesignEditor(cesdk);
      } else {
        await initAutomatedResizingAdvancedEditor(cesdk);
      }

      // Add back button to close the editor
      cesdk.ui.insertOrderComponent(
        { in: 'ly.img.navigation.bar', position: 'start' },
        { id: 'ly.img.back.navigationBar', onClick: onClose }
      );

      // Load scene
      await cesdk.loadFromString(scene);
    },
    [scene, mode, onClose]
  );

  const handleBackdropClick = useCallback(() => {
    onClose();
  }, [onClose]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modal}>
      <div className={styles.backdrop} onClick={handleBackdropClick} />
      <div className={styles.content}>
        <CreativeEditor
          className={styles.editor}
          config={config}
          init={handleInit}
        />
      </div>
    </div>
  );
}
