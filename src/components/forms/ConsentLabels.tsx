import Link from 'next/link';

export function KvkkLabel() {
  return (
    <>
      <Link href="/yasal/kvkk" className="text-navy underline">
        KVKK Aydınlatma Metni
      </Link>{' '}
      ve{' '}
      <Link href="/yasal/acik-riza" className="text-navy underline">
        Açık Rıza Metni
      </Link>
      ’ni okudum, kişisel verilerimin işlenmesini onaylıyorum.
    </>
  );
}

export function MarketingLabel() {
  return <>Kampanya ve bilgilendirmeler için ticari elektronik ileti almak istiyorum. (İsteğe bağlı)</>;
}
