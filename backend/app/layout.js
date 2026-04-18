export const metadata = {
  title: 'Backend',
  description: 'Next.js backend app'
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
