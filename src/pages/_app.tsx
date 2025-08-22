import { useEffect } from 'react'
import '../styles/globals.css'
import '../styles/home.scss'
import type { AppProps } from 'next/app'
import { Geist, Geist_Mono } from "next/font/google";
import { Provider as ReduxProvider } from 'react-redux';
import store from '@/store';
import Main from './_main'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Apply font classes to body
    document.body.className = `${geistSans.variable} ${geistMono.variable} antialiased`;
  }, []);


  return (
    <ReduxProvider store={store}>
      <Main Component={Component} pageProps={pageProps} />
    </ReduxProvider>
  )
} 