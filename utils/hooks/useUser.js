import { useContext } from 'react';
import { UserContext } from '../UserContext';

export default function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    console.error('Not inside User Context');
  }

  return context;
}

