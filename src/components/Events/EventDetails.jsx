import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteEvent, fetchEvent, queryClient } from "../../util/http.js";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

import Header from "../Header.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EventDetails() {
  const params = useParams();
  const navigate = useNavigate();

  //fetch editing data
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", params.id],
    //React Query gives a signal to cancel request if the component unmounts before the request completes or its primary job is to let you "cancel" an asynchronous operation (like a network request) before it finishes when user cancel the req or go back.
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
 });


 //useMutation is for (POST,PUT,DELETE)
 //used for change of data on the server and to handle side effects after the mutation (like updating the UI or invalidating queries).

 //invalidateQueries 
 // Marks cached data as outdated , so next time the query is accessed, React Query will refetch the data to ensure the UI reflects the most current state of the server.

 //refetchType: 'none'
//it does not immediately refetch the data just marks it as stale/invalid.

   const { mutate} = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['events'],
        refetchType: 'none'
      });
      navigate('/events')
    }
  })

  function handleDelete(){
    mutate({id: params.id})
  }
 
  let content;

  if (isPending){
    content = (
      <div className="center" id="event-details-content">
        <p>Fetching event data...</p>
      </div>
    )
  }
  
  if (isError){
    content = (
      <div className="center" id="event-details-content">
        <ErrorBlock 
        title='Failed to load event'
        message={
          error.info?.message || 
          'Failed to fetch event data, please try again later.'
        }
        />
      </div>
    )
  }
  
   if (data){
    const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })

    content =(
      <>
       <header>
        <h1>{data.title}</h1>
        <nav>
          <button onClick={handleDelete}>Delete</button>
          <Link to='edit'>Edit</Link>
        </nav>
       </header>
       <div id="event-details-content">
        <img src={`http://localhost:3000/${data.image}`} alt={data.titile} />
        <div id="event-detail-info">
          <div>
            <p id="event-details-location">
              {data.location}
            </p>
            <time dateTime={`Todo-DateT$Todo-Time`}>
              {formattedDate} @ {data.time}
            </time>
          </div>
          <p id="event-details-description">{data.description}</p>
        </div>
       </div>
      </>
    )
   }

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
    <article id="event-details">{content}</article>
    </>
  );
}
