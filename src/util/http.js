import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export async function fetchEvents({ signal, searchTerm }) {
  //searchTerms -> search data from the input field

  let url = "http://localhost:3000/events";

  if (searchTerm) {
    url += `?search=${searchTerm}`;
  }

  const response = await fetch(url, { signal: signal });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the events");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}

export async function createNewEvent(eventData) {
  const response = await fetch(`http://localhost:3000/events`, {
    method: "POST",
    body: JSON.stringify(eventData),
    headers: {
      "content-type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error("An error occured while creating the event");
    error.code = response.status;
    error.info = await response.json();
    throw error; //throw error object and return
  }

  const { event } = await response.json();

  return event;
}

export async function fetchSelectedImages({ signal }) {
  const response = await fetch(`http://localhost:3000/events/images`, {
    signal,
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the images");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { images } = await response.json();

  return images;
}

export async function fetchEvent({ id, signal }) {
  const response = await fetch(`http://localhost:3000/events/${id}`, { signal });

  if (!response.ok){
    const error = new Error('An error occurre while fetching the event');
    console.log('error obj',error)
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();
  return event;
}

export async function deleteEvent({id}){
  const response = await fetch(`http://localhost:3000/events/${id}`,{
    method: 'DELETE',
  })

  if(!response.ok){
    const error = new Error('An error occurred while deleting the event');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = response.json();
  return event;
}
