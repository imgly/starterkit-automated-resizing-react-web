import { useState } from 'react';

import type { Template } from '../../imgly';
import { DEFAULT_TEMPLATES } from '../constants';

export function useTemplates() {
  const [templates] = useState<Template[]>(() => [...DEFAULT_TEMPLATES]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  return {
    templates,
    selectedIndex,
    selectedTemplate: templates[selectedIndex],
    select: setSelectedIndex
  };
}
