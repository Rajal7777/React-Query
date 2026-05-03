import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

//useMutation
//to handle Create, Update, or Delete (CRUD) operations || unlike useQuery, which automatically fetches data on component mount, useMutaion is imperative ->it returns a trigger fun which can be called manually.
import { createNewEvent } from "../../util/http.js";
import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function NewEvent() {
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEvent,
  });

  function handleSubmit(formData) {
    mutate({ event: formData });
  }

  return (
    <Modal onClose={() => navigate("../")}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && "Submitting.."}
        {!isPending && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && (
        <ErrorBlock
          title="Failed to create event"
          message={
            error.info?.message ||
            "Failed to create event.Please check your inputs and try again later."
          }
        />
      )}
    </Modal>
  );
}
