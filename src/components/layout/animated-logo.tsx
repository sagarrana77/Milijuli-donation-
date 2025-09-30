
'use client';

import Image from 'next/image';

export function AnimatedLogo() {
  return (
    <div className="flex items-center justify-center">
       <Image
          src="https://media.tenor.com/9Rt9JC45-54AAAAj/nepal-nepali.gif"
          alt="Loading Nepali Flag"
          width={150}
          height={150}
          unoptimized
        />
    </div>
  );
}
