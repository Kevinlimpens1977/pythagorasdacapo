import { useEffect } from 'react';
import { Binasboek, BoekProvider } from './Binasboek';
import { useBoek } from './boekContext';

// Het boekje met dichtheden buiten het spel: in de lesstof opent een link
// <a href="#binas"> hetzelfde boekje als rechtsboven in het dichtheidsspel.
function Luisteraar() {
  const boek = useBoek();
  useEffect(() => {
    const klik = (event) => {
      const link = event.target?.closest?.('a[href="#binas"]');
      if (!link) return;
      event.preventDefault();
      boek.open();
    };
    document.addEventListener('click', klik);
    return () => document.removeEventListener('click', klik);
  }, [boek]);
  return null;
}

export default function BinasLink() {
  return (
    <BoekProvider>
      <Luisteraar />
      <Binasboek />
    </BoekProvider>
  );
}
