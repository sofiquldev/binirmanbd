'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { APP_MENU } from '@/config/app-menu.config';
import { useMenu } from '@/hooks/use-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function HeaderBreadcrumb() {
  const pathname = usePathname();
  const { getBreadcrumb } = useMenu(pathname);
  const items = getBreadcrumb(APP_MENU);

  if (items.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={index}>
              {index > 0 && (
                <BreadcrumbSeparator className="text-xs text-muted-foreground">
                  /
                </BreadcrumbSeparator>
              )}
              <BreadcrumbItem>
                {!isLast && item.path ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.path}>{item.title}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.title}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

