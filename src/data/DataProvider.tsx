import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { memoryRepository } from './memoryRepository';
import type { Repository } from './repository';

const DataContext = createContext<Repository>(memoryRepository);

/**
 * Screens read the repository from here, never by importing a concrete
 * implementation. Swapping in `firebaseRepository` is a one-line change at the
 * app root — see data/firebase.ts.
 */
export function DataProvider({
  children,
  repository = memoryRepository,
}: {
  children: ReactNode;
  repository?: Repository;
}) {
  const value = useMemo(() => repository, [repository]);
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): Repository {
  return useContext(DataContext);
}
