import Link from 'next/link';
import { type AnchorHTMLAttributes } from 'react';

interface SmartLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
}

/**
 * 智能链接：自动判断外链（new tab）vs 内链（next/link）
 */
export function SmartLink({ href, children, className, ...props }: SmartLinkProps) {
  const safeHref = href ?? '#';
  const isExternal = /^https?:\/\//.test(safeHref);

  if (isExternal) {
    return (
      <a
        href={safeHref}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...props}
      >
        {children}
        <span className="ml-0.5 inline-block text-[0.7em] opacity-60">↗</span>
      </a>
    );
  }

  return (
    <Link href={safeHref} className={className} {...props}>
      {children}
    </Link>
  );
}