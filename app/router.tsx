import {
  MutationCache,
  QueryClient,
  notifyManager,
} from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
//import toast from "react-hot-toast";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { routeTree } from "./routeTree.gen";
// import { DefaultCatchBoundary } from "./components/DefaultCatchBoundary";
// import { NotFound } from "./components/NotFound";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";

export function createRouter() {
  if (typeof document !== "undefined") {
    notifyManager.setScheduler(window.requestAnimationFrame);
  }

  const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL!;
  if (!CONVEX_URL) {
    console.error("missing envar CONVEX_URL");
  }
  const convexQueryClient = new ConvexQueryClient(CONVEX_URL);

  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
    mutationCache: new MutationCache({
      onError: (error) => {
        //  toast(error.message, { className: "bg-red-500 text-white" });
      },
    }),
  });
  convexQueryClient.connect(queryClient);

  const router = routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      defaultPreload: "intent",
      defaultErrorComponent: () => "Error!",
      defaultNotFoundComponent: () => "Not found!",
      context: { queryClient },
      Wrap: ({ children }) => (
        <ClerkProvider publishableKey="pk_test_bW9kZXJuLXN0dXJnZW9uLTEuY2xlcmsuYWNjb3VudHMuZGV2JA">
          <ConvexProviderWithClerk
            client={convexQueryClient.convexClient}
            useAuth={useAuth}
          >
            {children}
          </ConvexProviderWithClerk>
        </ClerkProvider>
      ),
    }),
    queryClient
  );

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
