import { useState, useEffect, ComponentType } from "react";
import { To, Router, Routes, Route } from "react-router";
import { History } from "@remix-run/router";

const withRouter = (Component: ComponentType, { history, path }: { history: History, path: string }) => () => {
    const [location, setLocation] = useState(history.location);

    useEffect(() => {
        history.listen(({ location }) => setLocation(location));
    }, []);

    const push = (to: To) => setTimeout(() => history.push(to), 100); // simulate remix loader fetch before changing route

    return <Router location={location} navigator={{ ...history, push }}>
        <Routes>
            <Route path={path} element={<Component />} />
            <Route path="*" element={null} />
        </Routes>
    </Router>;
};

export default withRouter;
