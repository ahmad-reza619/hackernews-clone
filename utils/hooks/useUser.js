import useSWR from 'swr';

const fetcher = url => fetch(url).then(r => r.json());

export default function useUser() {
  return useSWR('/api/user', fetcher);
}

