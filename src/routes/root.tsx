import { Home, Results, Setup, Vote } from "@/pages";
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-gray-200 p-4 mb-6">
        <h1 className="text-xl font-bold text-center text-blue-600 italic">
          Bing-Bongson
        </h1>
      </nav>
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 pb-12 ">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <Home />,
});

const setupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/setup",
  component: () => <Setup />,
});

const voteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vote",
  component: () => <Vote />,
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results",
  component: () => <Results />,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  setupRoute,
  voteRoute,
  resultsRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
