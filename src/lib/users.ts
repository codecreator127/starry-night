import { get, post, put, del } from '@/lib/api';
import { endpoints } from '@/lib/endpoints';
import { UUID } from 'crypto';

export interface User {
  id: UUID;
  username: string;
}

// Fetch user
export const getUser = async (): Promise<User> => {
  return get<User>(endpoints.events);
};
