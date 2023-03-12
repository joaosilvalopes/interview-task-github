import type { ComponentType } from "react";
import { useState, useEffect } from "react";
import type { To} from "react-router";
import { Router, Routes, Route } from "react-router";
import type { History } from "@remix-run/router";

/**
 * Wraps a component with the React Router `Router` component and a custom `history` object.
 * 
 * @param Component - The component to wrap.
 * @param options.history - The `history` object provided by Remix.
 * @param options.path - The path of the route to match the component.
 * @returns A higher-order component that renders the wrapped component with a `Router` component and the provided `history` object.
 */
const withRouter = (
    Component: ComponentType,
    options: { history: History; path: string }
  ) => {
    const ComponentWithRouter = () => {
      const [location, setLocation] = useState(options.history.location);
    
      useEffect(() => {
          options.history.listen(({ location }) => setLocation(location));
      }, []);
    
      // A function that navigates to a new route after a delay to simulate the Remix loader fetching data before changing the route.
      const push = (to: To) => setTimeout(() => options.history.push(to), 100);
    
      return (
        <Router location={location} navigator={{ ...options.history, push }}>
          <Routes>
            <Route path={options.path} element={<Component />} />
            <Route path="*" element={null} />
          </Routes>
        </Router>
      );
    }

    return ComponentWithRouter;
  };
  
  export default withRouter;
  