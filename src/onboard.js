import { useState, useEffect, useRef } from 'react';
import MetaMaskOnboarding from '@metamask/onboarding';

const SIGN_IN = 'Sign in';
const CONNECT = 'Connect';
const CONNECTED = 'Connected';

export function Connect() {
  const [state, setState] = useState(SIGN_IN);
  const [isDisabled, setDisabled] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const onboarding = useRef();

  useEffect(() => {
    if (!onboarding.current) {
      //@ts-ignore
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        setState(CONNECTED);
        setDisabled(true);
        //@ts-ignore
        onboarding.current.stopOnboarding();
      } else {
        setState(CONNECT);
        setDisabled(false);
      }
    }
  }, [accounts]);

  useEffect(() => {}, [state]);

  const connect = () => {
    function handleNewAccounts(newAccounts) {
      setAccounts(newAccounts);
    }
    //@ts-ignore
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      //@ts-ignore
      window.ethereum.request({ method: 'eth_requestAccounts' }).then(handleNewAccounts);
      //@ts-ignore
      window.ethereum.on('accountsChanged', handleNewAccounts);
      return () => {
        //@ts-ignore
        window.ethereum.off('accountsChanged', handleNewAccounts);
      };
    }
    //@ts-ignore
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      //@ts-ignore
      window.ethereum.request({ method: 'eth_requestAccounts' }).then(newAccounts => {
        setAccounts(newAccounts);
      });
    } else {
      //@ts-ignore
      onboarding.current.stopOnboarding();
    }
  };

  return [connect, state, isDisabled, accounts];
}
