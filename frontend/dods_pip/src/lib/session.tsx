/* eslint-disable  @typescript-eslint/no-explicit-any */
// withIronSession return type is Promise<any>

// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import { NextApiRequest, NextApiResponse } from 'next';
import { Session, withIronSession } from 'next-iron-session';

// optionally add stronger typing for next-specific implementation
export type NextIronRequest = NextApiRequest & { session: Session };
export type NextIronHandler = (req: NextIronRequest, res: NextApiResponse) => void | Promise<void>;

const withSession = (handler: NextIronHandler): (() => Promise<any>) =>
  withIronSession(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD || 'example',
    cookieName: 'next-iron-session/examples/next.js',
    cookieOptions: {
      // from https://github.com/jshttp/cookie#cookieserializename-value-options
      // note be careful when setting this to true, as compliant clients will not allow 
      //  client-side JavaScript to see the cookie in document.cookie.
      // setting to true since our dev servers are using http
      httpOnly: true,
      secure: false

      // the next line allows to use the session in non-https environments like
      // Next.js dev mode (http://localhost:3000)
      // secure: process.env.NODE_ENV === 'production',
    },
  });

export default withSession;
