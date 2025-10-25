import { get, post, put, del } from '@/lib/api';
import { endpoints } from '@/lib/endpoints';

export interface Event {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  videoUrl: string | null;
}

// Fetch all events
export const getEvents = async (): Promise<Event[]> => {
  return get<Event[]>(endpoints.events);
};

// Fetch a single event by ID
export const getEventById = async (id: number): Promise<Event> => {
  return get<Event>(`${endpoints.events}/${id}`);
};

// Add a new event
export const addEvent = async (event: Partial<Event>): Promise<Event> => {
  return post<Event>(endpoints.events, event);
};

// Update Event
export const updateEvent = async (id: number, event: Partial<Event>): Promise<Event> => {
  return put<Event>(`${endpoints.events}/${id}`, event);
};

// Delete Event
export const deleteEvent = async (id: number): Promise<void> => {
  return del(`${endpoints.events}/${id}`);
};
