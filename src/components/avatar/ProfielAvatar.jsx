import HelixAvatar from './HelixAvatar';

// Wat er in een avatar-rondje staat: de getekende avatar als die aan staat,
// anders het plaatje van de actieve avatar-skin, anders `leeg` (meestal een icoon).
export default function ProfielAvatar({ loadout, plaatje, leeg = null, passend = null, imgClassName = 'h-full w-full object-cover' }) {
  const avatar = passend || (loadout?.avatarGetekend ? loadout.avatar : null);
  if (avatar) return <HelixAvatar avatar={avatar} className="h-full w-full" />;
  if (plaatje?.imageUrl) return <img src={plaatje.imageUrl} alt={plaatje.title || 'Avatar'} className={imgClassName} />;
  return leeg;
}
