import { useCallback, useState } from 'react';

interface EditorModalState {
  isOpen: boolean;
  scene: string;
  mode: 'design' | 'advanced';
}

export function useEditorModal() {
  const [state, setState] = useState<EditorModalState>({
    isOpen: false,
    scene: '',
    mode: 'advanced'
  });

  const open = useCallback((scene: string, mode: 'design' | 'advanced') => {
    setState({ isOpen: true, scene, mode });
  }, []);

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return { ...state, open, close };
}
