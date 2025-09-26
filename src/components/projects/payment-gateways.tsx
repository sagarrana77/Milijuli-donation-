import Image from 'next/image';

const gateways = [
  { name: 'Esewa', logo: '/payment-logos/esewa.svg' },
  { name: 'Khalti', logo: '/payment-logos/khalti.svg' },
  { name: 'FonePay', logo: '/payment-logos/fonepay.svg' },
  { name: 'PayPal', logo: '/payment-logos/paypal.svg' },
  { name: 'Stripe', logo: '/payment-logos/stripe.svg' },
  { name: 'Crypto', logo: '/payment-logos/crypto.svg' },
];

const PlaceholderLogo = ({ name }: { name: string }) => (
    <div className="flex h-10 w-20 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground" title={name}>
      {name}
    </div>
  );

export function PaymentGateways() {
  return (
    <div className="w-full">
        <p className="mb-2 text-center text-sm text-muted-foreground">We accept</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
        {gateways.map((gateway) => (
            // In a real app, these would be Image components with actual logo files in /public
            <PlaceholderLogo key={gateway.name} name={gateway.name} />
        ))}
        </div>
    </div>
  );
}
