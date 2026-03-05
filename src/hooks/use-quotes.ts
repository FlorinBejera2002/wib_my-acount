import { useQuery } from "@tanstack/react-query";
import { mockQuotes } from "@/mocks/quotes";
import { delay, paginateMock } from "@/lib/utils";
import type { Quote, PaginatedResponse, TableParams } from "@/api/types";

const fetchQuotes = async (
  params: TableParams
): Promise<PaginatedResponse<Quote>> => {
  // TODO: decomentează când API-ul e gata
  // const { data } = await api.get(ENDPOINTS.QUOTES.LIST, { params });
  // return data;

  await delay(500);
  return paginateMock(mockQuotes, params);
};

const fetchQuote = async (id: string): Promise<Quote> => {
  // TODO: decomentează când API-ul e gata
  // const { data } = await api.get(ENDPOINTS.QUOTES.DETAIL(id));
  // return data;

  await delay(400);
  const quote = mockQuotes.find((q) => q.id === id);
  if (!quote) throw new Error("Cotația nu a fost găsită");
  return quote;
};

export function useQuotes(params: TableParams) {
  return useQuery({
    queryKey: ["quotes", params],
    queryFn: () => fetchQuotes(params),
  });
}

export function useQuote(id: string) {
  return useQuery({
    queryKey: ["quotes", id],
    queryFn: () => fetchQuote(id),
    enabled: !!id,
  });
}
