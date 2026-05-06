import { voorkennisSlides } from './voorkennis';
import { para71Slides } from './para71';

export const CHAPTERS = [
  { id: 'voorkennis', title: 'Voorkennis', totalSlides: voorkennisSlides.length, isLocked: false },
  { id: 'para_71', title: '7.1 Rechthoekige driehoeken', totalSlides: para71Slides.length, prerequisite: 'voorkennis' },
  { id: 'para_72', title: '7.2 Het Pythagoras-schema', totalSlides: 12, prerequisite: 'para_71' },
  { id: 'para_73', title: '7.3 Schuine zijde berekenen', totalSlides: 15, prerequisite: 'para_72' },
  { id: 'para_74', title: '7.4 Rechthoekszijde berekenen', totalSlides: 14, prerequisite: 'para_73' },
  { id: 'para_75', title: '7.5 Door elkaar oefenen', totalSlides: 20, prerequisite: 'para_74' },
  { id: 'para_76', title: '7.6 Pythagoras in het echt', totalSlides: 10, prerequisite: 'para_75' },
];

export const getChapterSlides = (chapterId) => {
  switch (chapterId) {
    case 'voorkennis':
      return voorkennisSlides;
    case 'para_71':
      return para71Slides;
    default:
      return [];
  }
};
