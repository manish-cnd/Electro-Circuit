import { useEffect, useRef } from 'react';
import useStore from '../store/useStore';

/**
 * useSimulation — Custom hook that drives the simulation engine.
 * When isRunning is true, it runs a setInterval loop that:
 *   1. Ticks clock nodes
 *   2. Calls runSimulationStep (propagates signals)
 *
 * Automatically cleans up the interval when paused, speed changes, or unmounted.
 * Dependency on clockSpeed ensures the interval is restarted when speed changes.
 */
export function useSimulation() {
  const isRunning = useStore(s => s.isRunning);
  const clockSpeed = useStore(s => s.clockSpeed);
  const runSimulationStep = useStore(s => s.runSimulationStep);
  const updateNodeData = useStore(s => s.updateNodeData);
  const intervalRef = useRef(null);
  const tickRef = useRef(0);

  useEffect(() => {
    // Always clear any existing interval first —
    // this handles both stop events AND speed changes
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!isRunning) return;

    // Start a fresh interval at the new speed
    intervalRef.current = setInterval(() => {
      tickRef.current += 1;

      // Tick clock nodes — get fresh state each tick to avoid stale closures
      const currentNodes = useStore.getState().nodes;
      currentNodes.forEach(node => {
        if (node.data?.gateType === 'CLOCK') {
          const period = node.data.period ?? 4;
          const halfPeriod = Math.max(1, Math.floor(period / 2));
          const newOutput = Math.floor(tickRef.current / halfPeriod) % 2;
          updateNodeData(node.id, { output: newOutput, tick: tickRef.current });
        }
      });

      runSimulationStep();
    }, clockSpeed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, clockSpeed, runSimulationStep, updateNodeData]);

  return { isRunning, clockSpeed };
}
