'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Crisp } from 'crisp-sdk-web';

const CRISP_ID = process.env.NEXT_PUBLIC_CRISP_ID;

// Routes where Crisp chat bubble is visible by default
const SHOW_ON_ROUTES = ['/', '/login'];

export function CrispChat() {
  const pathname = usePathname();

  useEffect(() => {
    if (!CRISP_ID) return;

    Crisp.configure(CRISP_ID);

    if (!SHOW_ON_ROUTES.includes(pathname)) {
      Crisp.chat.hide();
      Crisp.chat.onChatClosed(() => {
        Crisp.chat.hide();
      });
    }
  }, [pathname]);

  return null;
}

export function openSupportChat() {
  if (CRISP_ID) {
    Crisp.chat.show();
    Crisp.chat.open();
  } else {
    window.open(
      'mailto:support@molinar.ai?subject=Need help with Molinar Business',
      '_blank'
    );
  }
}
