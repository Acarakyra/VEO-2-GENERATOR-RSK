
import type { AspectRatio } from './types';

export const ASPECT_RATIOS: { value: AspectRatio; label: string }[] = [
  { value: '16:9', label: 'Widescreen' },
  { value: '9:16', label: 'Vertical' },
  { value: '1:1', label: 'Square' },
  { value: '4:3', label: 'Standard' },
];

export const LOADING_MESSAGES: string[] = [
  'Warming up the digital director...',
  'Assembling the virtual film crew...',
  'Setting up the virtual cameras...',
  'Storyboarding your scene...',
  'Rendering the first few frames...',
  'Applying special effects...',
  'Adding cinematic magic...',
  'Polishing the final cut...',
  'This can take a few minutes, hang tight!',
];
