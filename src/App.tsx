import { QueryClientProvider } from "@tanstack/react-query";
import { Router } from "Router";
import { queryClient as createQueryClient } from "./common/queryClient/index";

const queryClient = createQueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
