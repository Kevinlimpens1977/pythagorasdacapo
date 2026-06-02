import { useEffect, useState } from 'react';
import { UserRound } from 'lucide-react';
import { getStudentPhotoUrl } from '../../services/studentPhotoImportService';
import { getStudentInitial, getStudentPhotoDirectUrl } from '../../lib/studentPhotoUtils';

const SIZE_CLASSES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-11 w-11 text-sm',
  xl: 'h-20 w-20 text-3xl'
};

const SHAPE_CLASSES = {
  circle: 'rounded-full',
  rounded: 'rounded-[var(--helix-radius-md)]',
  square: 'rounded-2xl'
};

export default function StudentAvatar({
  student = {},
  size = 'md',
  shape = 'rounded',
  fallback = 'icon',
  showPreview = false,
  className = '',
  fallbackClassName = ''
}) {
  const studentKey = student.uid || student.id || student.email || student.displayName || '';
  const directPhotoUrl = getStudentPhotoDirectUrl(student);
  const [resolvedPhoto, setResolvedPhoto] = useState(() => ({
    key: studentKey,
    url: directPhotoUrl
  }));

  useEffect(() => {
    let cancelled = false;

    const loadPhoto = async () => {
      try {
        const url = await getStudentPhotoUrl(student);
        if (!cancelled) setResolvedPhoto({ key: studentKey, url });
      } catch {
        if (!cancelled) setResolvedPhoto({ key: studentKey, url: '' });
      }
    };

    loadPhoto();
    return () => {
      cancelled = true;
    };
  }, [student, studentKey]);

  const photoUrl = resolvedPhoto.key === studentKey ? resolvedPhoto.url : directPhotoUrl;

  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const shapeClass = SHAPE_CLASSES[shape] || SHAPE_CLASSES.rounded;
  const fallbackClasses =
    fallbackClassName ||
    'bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]';

  return (
    <div className={`group relative shrink-0 ${className}`}>
      <div
        className={`flex ${sizeClass} ${shapeClass} items-center justify-center overflow-hidden font-black ring-1 ring-[var(--helix-border)] ${photoUrl ? 'bg-slate-100' : fallbackClasses}`}
      >
        {photoUrl ? (
          <img src={photoUrl} alt="" className="h-full w-full object-cover" />
        ) : fallback === 'initial' ? (
          getStudentInitial(student)
        ) : (
          <UserRound size={size === 'sm' ? 16 : size === 'xl' ? 34 : 21} />
        )}
      </div>
      {showPreview && photoUrl ? (
        <div className="pointer-events-none absolute left-0 top-12 z-30 hidden w-56 rounded-[var(--helix-radius-lg)] border border-[var(--helix-border)] bg-white p-3 shadow-2xl group-hover:block group-focus-within:block">
          <img src={photoUrl} alt="" className="h-40 w-full rounded-[var(--helix-radius-md)] object-cover" />
          <p className="mt-3 font-black text-[var(--helix-navy)]">{student.displayName || 'Naam ontbreekt'}</p>
          <p className="helix-muted text-xs">{student.klasName}</p>
          <p className="helix-muted mt-1 break-all text-xs">{student.email || 'Geen e-mail'}</p>
        </div>
      ) : null}
    </div>
  );
}
