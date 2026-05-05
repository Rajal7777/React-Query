import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { fetchEvent, queryClient, updateEvent } from "../../util/http.js";

export default function EditEvent() {
  const navigate = useNavigate();
  const params = useParams;

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  });

  const { mutate } = useMutation({
    mutationFn: updateEvent,
    //onMutate -> Runs before the request is sent.
    //it get the current data in the parameter
    //(data) is whatever you pass to the mutate mutate({event: {id: 1,title: "New });
    onMutate: async (data) => {
      //extracts the updated event data from the input
      const newEvent = data.event;

      // 1) Stops any ongoing fetch for this event.
      // 2) prevents overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ["events", params.id] });

      //saves current(old) event data / this is backup incase somethg fails
      const previousEvent = queryClient.getQueriesData(["events", params.id]);

      //Immediately updates the cache with new data.
      //UI updates instantly (before server responds).
      queryClient.setQueriesData(["events", params.id], newEvent);

      //incase of error return the prev(currn) event data
      return { previousEvent };
    },
    //runs if api request fails
    onError: (error, data, context) => {
      //context is the return value of onMutate (previousEvent)
      //rollback to the previous event data
      //restore the old data from backup// rollback
      queryClient.setQueriesData(["events", params.id], context.previousEvent);
    },
    //runs no matter success or fails
    onSettled: () => {
      //refetch fresh data from the server
      //ensures UI is 100% accurate
      queryClient.invalidateQueries(["events", params.id]);
    },
  });

  let content;

  if (isPending) {
    content = (
      <div className="center">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError) {
    content = (
      <>
        <ErrorBlock
          title="Failed to load event"
          message={
            error.info?.message ||
            "Failed to load event. Please check your inputs and try again later."
          }
        />
        <div className="form-actions">
          <Link to="../" className="button">
            Okay
          </Link>
        </div>
      </>
    );
  }

  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    );
  }

  function handleSubmit(formData) {
    mutate({ event: { id: params.id, ...formData } });
    navigate("../");
  }

  function handleClose() {
    navigate("../");
  }

  return <Modal onClose={handleClose}>{content}</Modal>;
}
