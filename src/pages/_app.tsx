import "@/styles/globals.css";
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../contexts/AuthContext'
import dynamic from 'next/dynamic'
import theme from '../theme'
import { useRouter } from 'next/router'
import ErrorBoundary from '@/components/ErrorBoundary'
import Custom404 from '@/pages/404'
import type { NextPage } from 'next'
import type { NextPageContext } from 'next'

interface CustomPageProps {
  error?: {
    statusCode: number;
    message?: string;
  };
}

const Navbar = dynamic(
  () => import('../components/Navbar'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        height: '60px',
        width: '100%',
        backgroundColor: 'transparent'
      }} />
    )
  }
)

function MyApp({ Component, pageProps }: AppProps<CustomPageProps>) {
  const router = useRouter()
  const isAdminPage = router.pathname.startsWith('/admin')

  if (pageProps.error?.statusCode === 404) {
    return (
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <AuthProvider>
          <Navbar />
          <Custom404 />
        </AuthProvider>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ErrorBoundary>
        <AuthProvider>
          {!isAdminPage && <Navbar />}
          <Component {...pageProps} />
        </AuthProvider>
      </ErrorBoundary>
    </ChakraProvider>
  )
}

type AppPropsWithLayout = AppProps<CustomPageProps> & {
  Component: NextPage;
  ctx: NextPageContext;
};

MyApp.getInitialProps = async ({ Component, ctx }: AppPropsWithLayout) => {
  let pageProps: CustomPageProps = {};

  if (Component.getInitialProps) {
    try {
      pageProps = await Component.getInitialProps(ctx);
    } catch (error) {
      if (error instanceof Error) {
        pageProps.error = {
          statusCode: 404,
          message: error.message
        };
      }
    }
  }

  if (ctx.res?.statusCode === 404) {
    pageProps.error = {
      statusCode: 404
    };
  }

  return { pageProps };
};

export default MyApp;