import helixLogo from '../../afbeeldingen/logo.png';

const variantClasses = {
  default: 'min-h-[11rem] p-6 sm:min-h-[12.5rem] sm:p-8',
  compact: 'p-6',
  modal: 'min-h-[7.25rem] p-5 sm:min-h-[8rem] sm:p-6',
  login: 'min-h-[42rem] p-10'
};

const logoClasses = {
  default: 'h-20 w-40 sm:h-24 sm:w-48',
  compact: 'h-[4.5rem] w-36 sm:h-20 sm:w-40',
  modal: 'h-14 w-28 sm:h-16 sm:w-32',
  login: 'h-24 w-48'
};

const cx = (...classes) => classes.filter(Boolean).join(' ');

export default function HelixBrandBanner({
  children,
  variant = 'default',
  className = '',
  contentClassName = '',
  logoClassName = ''
}) {
  const resolvedVariant = variantClasses[variant] ? variant : 'default';

  return (
    <section className={cx('helix-brand-banner', `helix-brand-banner-${resolvedVariant}`, variantClasses[resolvedVariant], className)}>
      <div className="helix-brand-banner-pattern" aria-hidden="true" />

      <div className="helix-brand-banner-inner">
        <div className={cx('helix-brand-banner-logo-card', logoClasses[resolvedVariant], logoClassName)}>
          <img src={helixLogo} alt="HELIX" className="h-28 w-28 max-w-none scale-[1.5] object-contain" />
        </div>

        {children && (
          <div className={cx('helix-brand-banner-content', contentClassName)}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
