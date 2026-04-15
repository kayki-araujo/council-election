import { createRootRoute, createRoute, Outlet } from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <>index</>,
});

const setupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/setup",
  component: () => <>setup</>,
});

const voteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vote",
  component: () => <>vote</>,
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results",
  component: () => <>results</>,
});
