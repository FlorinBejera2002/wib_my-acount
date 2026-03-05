import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { mockSessions } from "@/mocks/sessions";
import { delay } from "@/lib/utils";
import type { Session } from "@/api/types";

const fetchSessions = async (): Promise<Session[]> => {
  // TODO: decomentează când API-ul e gata
  // const { data } = await api.get(ENDPOINTS.SESSIONS.LIST);
  // return data;

  await delay(500);
  return mockSessions;
};

const terminateSessionFn = async (id: string): Promise<void> => {
  // TODO: decomentează când API-ul e gata
  // await api.delete(ENDPOINTS.SESSIONS.TERMINATE(id));

  await delay(400);
  const session = mockSessions.find((s) => s.id === id);
  if (session?.isCurrent) {
    throw new Error("Nu poți încheia sesiunea curentă");
  }
};

const terminateAllSessionsFn = async (): Promise<void> => {
  // TODO: decomentează când API-ul e gata
  // await api.delete(ENDPOINTS.SESSIONS.TERMINATE_ALL);

  await delay(600);
};

export function useSessions() {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
  });
}

export function useTerminateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: terminateSessionFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Sesiunea a fost încheiată cu succes");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useTerminateAllSessions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: terminateAllSessionsFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Toate sesiunile au fost încheiate");
    },
    onError: () => {
      toast.error("Eroare la încheierea sesiunilor");
    },
  });
}
