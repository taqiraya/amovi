import { socialLinks } from '../config/socialLinks';

function SocialIconSvg({ name, className = "w-4 h-4 fill-current" }) {
  switch (name) {
    case 'Facebook':
      return (
        <svg className={className} viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    case 'Instagram':
      return (
        <svg className={className} viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      );
    case 'Threads':
      return (
        <svg className={className} viewBox="0 0 24 24">
          <path d="M12.186 24C5.467 24 0 18.533 0 11.814 0 5.094 5.467 0 12.186 0c6.643 0 11.968 5.253 12.186 11.85h-2.673c-.212-5.187-4.478-9.284-9.513-9.284-5.27 0-9.554 4.284-9.554 9.554 0 5.27 4.284 9.554 9.554 9.554 4.093 0 7.643-2.607 9.006-6.44h2.723C22.428 20.062 17.72 24 12.186 24zm-.008-15.068c2.097 0 3.797 1.7 3.797 3.797s-1.7 3.797-3.797 3.797-3.797-1.7-3.797-3.797 1.7-3.797 3.797-3.797z"/>
        </svg>
      );
    case 'LinkedIn':
      return (
        <svg className={className} viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      );
    case 'YouTube':
      return (
        <svg className={className} viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    case 'X (Twitter)':
      return (
        <svg className={className} viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    case 'TikTok':
      return (
        <svg className={className} viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .59.05.86.15V9.4a6.33 6.33 0 0 0-.86-.06A6.34 6.34 0 0 0 3.14 15.7 6.34 6.34 0 0 0 9.48 22a6.34 6.34 0 0 0 6.33-6.33V9.17a8.28 8.28 0 0 0 5-1.63l-1.22-2.85z"/>
        </svg>
      );
    default:
      return null;
  }
}

export default function SocialLinks({ variant = "footer" }) {
  if (variant === "contact") {
    return (
      <div className="flex flex-wrap items-center gap-3 pt-2" dir="ltr">
        {socialLinks.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.ariaLabel}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 text-slate-700 bg-slate-50 hover:bg-[#FCA311] hover:text-[#14213D] hover:border-[#FCA311] transition-all duration-200 text-xs font-semibold shadow-sm"
          >
            <SocialIconSvg name={item.name} className="w-3.5 h-3.5 fill-current" />
            <span>{item.name}</span>
          </a>
        ))}
      </div>
    );
  }

  // Default: Footer style
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2.5" dir="ltr">
      {socialLinks.map((item) => (
        <a
          key={item.name}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.ariaLabel}
          title={item.name}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FCA311] hover:text-[#FCA311] bg-white/5 shadow-sm"
        >
          <SocialIconSvg name={item.name} className="w-3.5 h-3.5 fill-current" />
        </a>
      ))}
    </div>
  );
}
