import { createContext, useContext } from 'react';

// Het boekje met dichtheden is één keer in het spel; elke stap kan het openen.
export const BoekContext = createContext({ open: () => {}, sluit: () => {}, isOpen: false, onKies: null });
export const useBoek = () => useContext(BoekContext);
