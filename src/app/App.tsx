import { useCallback } from 'react';
import CreativeEditor from '@cesdk/cesdk-js/react';
import type { Configuration } from '@cesdk/cesdk-js';

import type { Template, VariantImage } from '../imgly';

import {
  useEngine,
  useTemplates,
  useEditorModal,
  useVariants,
  resolveSceneUrl
} from './hooks';
import { TemplateSection } from './TemplateSection/TemplateSection';
import { VariantsSection } from './VariantsSection/VariantsSection';
import { EditorModal } from './EditorModal/EditorModal';

import styles from './App.module.css';

interface AppProps {
  config: Partial<Configuration>;
}

export default function App({ config }: AppProps) {
  // State hooks
  const engine = useEngine();
  const templates = useTemplates();
  const modal = useEditorModal();
  const variants = useVariants(engine.cesdk, engine.isReady);

  // Template edit handler - bridges engine and modal
  const handleTemplateEdit = useCallback(
    async (template: Template) => {
      if (!engine.cesdk) return;

      try {
        let scene = template.sceneString;
        if (!scene) {
          await engine.cesdk.loadFromURL(resolveSceneUrl(template.sceneUrl));
          scene = await engine.cesdk.engine.scene.saveToString();
        }
        if (scene) {
          modal.open(scene, 'advanced');
        }
      } catch (error) {
        console.error('Failed to open template editor:', error);
      }
    },
    [engine.cesdk, modal]
  );

  // Variant edit handler - bridges variant and modal
  const handleVariantEdit = useCallback(
    (variant: VariantImage) => {
      if (variant.sceneString) {
        modal.open(variant.sceneString, 'design');
      }
    },
    [modal]
  );

  // Generate handler - bridges templates and variants
  const handleGenerate = useCallback(() => {
    variants.generate(templates.selectedTemplate);
  }, [variants, templates.selectedTemplate]);

  return (
    <div className={styles.app}>
      {/* Hidden CE.SDK for resize operations */}
      <div className={styles.hiddenEngine}>
        <CreativeEditor config={config} init={engine.handleInit} />
      </div>

      {/* Main content */}
      <div className={styles.content}>
        <TemplateSection
          templates={templates.templates}
          selectedIndex={templates.selectedIndex}
          onSelect={templates.select}
          onEdit={handleTemplateEdit}
          onGenerate={handleGenerate}
        />

        <VariantsSection
          variants={variants.variants}
          onEdit={handleVariantEdit}
          onDownload={variants.download}
        />
      </div>

      {/* Editor Modal */}
      <EditorModal
        config={config}
        isOpen={modal.isOpen}
        scene={modal.scene}
        mode={modal.mode}
        onClose={modal.close}
      />
    </div>
  );
}
