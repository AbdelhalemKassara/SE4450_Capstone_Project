'use client'
import './globals.css'
import { useEffect, useState } from 'react';



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      
      </head>
      <body>
        <Dynamic>{children}</Dynamic>
      </body>
    </html>
  )
}

const Dynamic = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};