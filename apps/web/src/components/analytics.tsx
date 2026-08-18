import Script from 'next/script';

export function Analytics() {
  return (
    <Script
      src="https://analytics-xirpl.tigasearah.my.id/script.js"
      data-website-id="297e3767-4ac8-4d41-85e6-1cf8255ae5b9"
      strategy="afterInteractive"
    />
  );
}
