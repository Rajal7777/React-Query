import { useIsFetching } from "@tanstack/react-query";

export default function Header({ children }) {
  const isFetching = useIsFetching();  //returns the number of active queries that are currently fetching data. If there are no active queries, it returns 0. 
 
  
  return (
    <>
      <div id="main-header-loading">{isFetching > 0 && <p>Loading...</p>}</div>
      <header id="main-header">
        <div id="header-title">
          <h1>React Events</h1>
        </div>
        <nav>{children}</nav>
      </header>
    </>
  );
}
