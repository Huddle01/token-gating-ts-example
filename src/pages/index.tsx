import { useState } from 'react';

import {
  getAccessToken,
  getLensAccessToken,
  getLensMessage,
  getMessage,
} from '@huddle01/token-gating';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { verifyMessage } from 'ethers/lib/utils';
import Head from 'next/head';
import Image from 'next/image';
import { useAccount, useSignMessage } from 'wagmi';

import Brand from '@/components/Brand/Brand';
import styles from '@/styles/Home.module.css';

export default function Home() {
  const [recoveredAddress, setRecoveredAddress] = useState('');
  const [message, setMessage] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>('');

  const {
    data: signature,
    error,
    isLoading,
    signMessage,
  } = useSignMessage({
    onSuccess(signature, variables) {
      // Verify signature when sign message succeeds
      const address = verifyMessage(variables.message, signature);
      setRecoveredAddress(address);
    },
  });

  const { address, isConnecting, isDisconnected } = useAccount();

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.description}>
          <div className="flex items-center gap-8">
            <p>
              <Image
                src="https://huddle01.com/_next/image?url=%2Fimages%2FOldLogo.png&w=256&q=100"
                width={100}
                height={100}
                alt="Huddle01 Logo"
              />
            </p>
          </div>
          <div>
            <ConnectButton />
          </div>
        </div>

        <div className={styles.center}>
          {!(message || signature || accessToken) && (
            <Image
              src="https://huddle01.com/_next/image?url=%2Fimages%2FShow.png&w=1080&q=100"
              width={700}
              height={700}
              alt="Huddle01 Logo"
            />
          )}
          <div>
            {message && (
              <div className={styles.description}>
                Message:
                <p>{message}</p>
              </div>
            )}
            <br />
            {signature && (
              <div className={styles.description}>
                Signature:
                <p>{signature}</p>
              </div>
            )}
            <br />
            {accessToken && (
              <div className={styles.description}>
                Access Token:
                <p className="whitespace-normal break-words">{accessToken}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <div>
            <div className="mx-auto block w-fit my-4">
              <Brand
                name="Eth"
                alt="Eth Protocol Logo"
                src="https://d33wubrfki0l68.cloudfront.net/fcd4ecd90386aeb50a235ddc4f0063cfbb8a7b66/4295e/static/bfc04ac72981166c740b189463e1f74c/40129/eth-diamond-black-white.jpg"
              />
            </div>
            <div className="flex gap-4">
              <button
                className={
                  'bg-zinc-500/95 hover:opacity-75  px-3 py-2 rounded-lg'
                }
                onClick={async () => {
                  if (address) {
                    const { message: _message } = await getMessage(address);

                    setMessage(_message);
                  } else console.log('no address', { address });
                }}
              >
                getMessage()
              </button>

              <button
                className={
                  'bg-zinc-500/95 hover:opacity-75  px-3 py-2 rounded-lg'
                }
                onClick={async () => {
                  signMessage({ message });
                }}
              >
                signMessage()
              </button>
              <button
                className={
                  'bg-zinc-500/95 hover:opacity-75  px-3 py-2 rounded-lg'
                }
                onClick={async () => {
                  if (signature && address) {
                    const { accessToken: _accessToken } = await getAccessToken(
                      signature,
                      address
                    );

                    console.log({ _accessToken });

                    setAccessToken(_accessToken);
                  }
                }}
              >
                getAccessToken()
              </button>
            </div>
          </div>
          <div className="mx-4 text-center font-bold ">OR</div>
          <div>
            <div className="mx-auto block w-fit my-4">
              <Brand
                name="Lens"
                alt="Lens Protocol Logo"
                src="https://icodrops.com/wp-content/uploads/2022/02/LensProtocol_logo-1.jpeg"
              />
            </div>
            <div className="flex gap-4">
              <button
                className={
                  'bg-green-600 hover:opacity-75  px-3 py-2 rounded-lg'
                }
                onClick={async () => {
                  if (address) {
                    const { message: _message } = await getLensMessage(address);

                    setMessage(_message);
                  } else console.log('no address', { address });
                }}
              >
                getLensMessage()
              </button>
              <button
                className={
                  'bg-zinc-500/95 hover:opacity-75  px-3 py-2 rounded-lg'
                }
                onClick={async () => {
                  signMessage({ message });
                }}
              >
                signMessage()
              </button>
              <button
                className={
                  'bg-green-600 hover:opacity-75  px-3 py-2 rounded-lg'
                }
                onClick={async () => {
                  if (signature && address) {
                    const { accessToken: _accessToken } =
                      await getLensAccessToken(signature, address);

                    console.log({ _accessToken });

                    setAccessToken(_accessToken);
                  }
                }}
              >
                getLensAccessToken()
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
