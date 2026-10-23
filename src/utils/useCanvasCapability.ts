import { useEffect, useState } from 'react';

export function useCanvasCapability() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const webglAvailable = Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const device = navigator as Navigator & { deviceMemory?: number };
    const veryLowPowerDevice = (navigator.hardwareConcurrency || 8) <= 2 || (device.deviceMemory || 8) <= 1;

    const evaluate = () => {
      setEnabled(webglAvailable && !motionPreference.matches && !veryLowPowerDevice);
    };

    evaluate();
    window.addEventListener('resize', evaluate, { passive: true });
    motionPreference.addEventListener('change', evaluate);

    return () => {
      window.removeEventListener('resize', evaluate);
      motionPreference.removeEventListener('change', evaluate);
    };
  }, []);

  return enabled;
}
