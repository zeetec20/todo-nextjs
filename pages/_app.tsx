import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import Layout from '../component/layout'
import { GetStaticProps } from 'next'
import AuthService from '../service/auth'
import { CookiesProvider } from 'react-cookie'
import App from 'next/app'
import { useEffect, useState } from 'react'

const MyApp = ({ Component, pageProps }: AppProps) => {
  const size = useWindowSize()
  pageProps.size = size
  return (
    <CookiesProvider>
      <ChakraProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </CookiesProvider>
  )
}

function useWindowSize(): {width: undefined | number, height: undefined | number} {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<{width: undefined | number, height: undefined | number}>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== 'undefined') {
      // Handler to call on window resize
      const handleResize = () => {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    
      // Add event listener
      window.addEventListener("resize", handleResize);
     
      // Call handler right away so state gets updated with initial window size
      handleResize();
    
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

export default MyApp