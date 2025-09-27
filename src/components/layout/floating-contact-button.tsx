
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MessageSquare, X } from 'lucide-react';
import WhatsAppIcon from '@/components/icons/whatsapp-icon';
import { ViberIcon } from '@/components/icons/viber-icon';
import InstagramIcon from '@/components/icons/instagram-icon';
import MessengerIcon from '@/components/icons/messenger-icon';
import Link from 'next/link';
import { socialLinks } from '@/lib/data';


export function FloatingContactButton() {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappLink = `https://wa.me/${socialLinks.whatsapp.replace(/\D/g, '')}`;
  const viberLink = `viber://chat?number=%2B${socialLinks.viber.replace(/\D/g, '')}`;
  const messengerLink = `https://m.me/${socialLinks.messenger}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
                    {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
                </Button>
            </PopoverTrigger>
            <PopoverContent side="top" align="end" className="w-auto rounded-full p-2 border-none bg-transparent shadow-none">
                <div className="flex items-center gap-3 rounded-full bg-background border p-2 shadow-lg">
                    <Link href={whatsappLink} target="_blank" passHref>
                        <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 bg-green-500 hover:bg-green-600 text-white">
                            <WhatsAppIcon className="h-6 w-6" color="white"/>
                        </Button>
                    </Link>
                    <Link href={viberLink} target="_blank" passHref>
                        <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 bg-purple-600 hover:bg-purple-700 text-white">
                            <ViberIcon className="h-6 w-6 fill-white" />
                        </Button>
                    </Link>
                    <Link href={socialLinks.instagram} target="_blank" passHref>
                        <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 bg-pink-600 hover:bg-pink-700 text-white">
                            <InstagramIcon className="h-6 w-6" color="white" />
                        </Button>
                    </Link>
                    <Link href={messengerLink} target="_blank" passHref>
                         <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 bg-blue-600 hover:bg-blue-700 text-white">
                            <MessengerIcon className="h-6 w-6" color="white" />
                        </Button>
                    </Link>
                </div>
            </PopoverContent>
        </Popover>
    </div>
  );
}
