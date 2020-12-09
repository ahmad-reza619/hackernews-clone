import PropTypes from 'prop-types';
import useSWR from 'swr';
import '../styles/globals.css'
import { UserProvider } from '../utils/UserContext';

const fetcher = url => fetch(url).then(r => r.json());

function MyApp({ Component, pageProps }) {

  const result = useSWR('/api/user', fetcher);

  return (
    <UserProvider value={result}>
      <Component {...pageProps} />
    </UserProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp
