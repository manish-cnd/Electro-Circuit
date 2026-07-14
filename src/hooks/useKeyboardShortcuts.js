import { useEffect, useCallback } from 'react';
import useStore from '../store/useStore';

/**
 * useKeyboardShortcuts — Global keyboard handler for the workspace.
 */
export function useKeyboardShortcuts() {
  const undo = useStore(s => s.undo);
  const redo = useStore(s => s.redo);
  const deleteSelected = useStore(s => s.deleteSelected);
  const saveProject = useStore(s => s.saveProject);
  const toggleSimulation = useStore(s => s.toggleSimulation);
  const showNotification = useStore(s => s.showNotification);

  const handleKeyDown = useCallback((e) => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (e.key === 'Delete' || e.key === 'Backspace') {
      deleteSelected();
    }
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
      undo();
    }
    if (e.ctrlKey && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
      e.preventDefault();
      redo();
    }
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      saveProject();
      showNotification('Project saved!', 'success');
    }
    if (e.key === 'r' || e.key === 'R') {
      if (!e.ctrlKey) toggleSimulation();
    }
  }, [undo, redo, deleteSelected, saveProject, toggleSimulation, showNotification]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
