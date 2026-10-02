import { loadFont as laadBangers } from '@remotion/google-fonts/Bangers';
import { loadFont as laadAtkinson } from '@remotion/google-fonts/AtkinsonHyperlegibleNext';

// Twee families, precies zoals het designsysteem (p.7). Arial vangt ρ op als
// Atkinson geen Grieks heeft.
export const KOPFONT = laadBangers('normal', { weights: ['400'], subsets: ['latin'] }).fontFamily;
export const TEKSTFONT = `${laadAtkinson('normal', { weights: ['400', '700'], subsets: ['latin'] }).fontFamily}, Arial, sans-serif`;
