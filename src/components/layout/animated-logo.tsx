
'use client';

import Image from 'next/image';

export function AnimatedLogo() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
       <Image
          src="https://media.tenor.com/9Rt9JC45-54AAAAj/nepal-nepali.gif"
          alt="Loading Nepali Flag"
          width={150}
          height={150}
          unoptimized
        />
        <p className="text-xl font-semibold text-muted-foreground">बन्दै छ नेपाल</p>
    </div>
  );
}
