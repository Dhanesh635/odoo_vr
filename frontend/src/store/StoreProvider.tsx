/**
 * Redux Store Provider Component
 * 
 * Wraps the application with Redux Provider to make the store available
 * to all components. Compatible with Next.js 16 App Router.
 * 
 * This component uses 'use client' directive because Redux requires
 * client-side state management and cannot run during server-side rendering.
 * 
 * Usage in root layout:
 * ```typescript
 * export default function RootLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <html lang="en">
 *       <body>
 *         <StoreProvider>
 *           {children}
 *         </StoreProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 * 
 * Requirements: 1.2, 1.4, 11.1, 11.2, 11.7
 */

'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';

/**
 * StoreProvider props
 */
interface StoreProviderProps {
  /** Child components to be wrapped with Redux Provider */
  children: React.ReactNode;
}

/**
 * StoreProvider component
 * 
 * Provides Redux store to the entire React component tree.
 * Uses useRef to ensure store instance is stable across re-renders.
 * Includes PersistGate to delay rendering until persisted state is loaded.
 * 
 * Key features:
 * - Client-only component ('use client' directive)
 * - Stable store reference via useRef
 * - Redux Persist integration with PersistGate
 * - No server-side rendering of Redux state
 * - Compatible with Next.js App Router
 * 
 * @param props Component props
 * @returns Redux Provider wrapping children
 */
export function StoreProvider({ children }: StoreProviderProps) {
  // Use ref to maintain stable store and persistor instances across re-renders
  const storeRef = useRef(store);
  const persistorRef = useRef(persistor);

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistorRef.current}>
        {children}
      </PersistGate>
    </Provider>
  );
}
