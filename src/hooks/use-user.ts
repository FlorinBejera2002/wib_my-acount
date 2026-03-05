import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { mockUser } from "@/mocks/user";
import { delay } from "@/lib/utils";
import { api } from "@/api/axios-client";
import { ENDPOINTS } from "@/api/endpoints";
import type {
  UserProfile,
  UpdateProfileRequest,
  UpdatePreferencesRequest,
} from "@/api/types";

const fetchProfile = async (): Promise<UserProfile> => {
  // TODO: decomentează când API-ul e gata
  // const { data } = await api.get(ENDPOINTS.USERS.PROFILE);
  // return data;

  await delay(500);
  return mockUser;
};

const updateProfileFn = async (
  data: UpdateProfileRequest
): Promise<UserProfile> => {
  const { data: response } = await api.patch(ENDPOINTS.USERS.UPDATE_PROFILE, data);
  return response;
};

const updatePreferencesFn = async (
  data: UpdatePreferencesRequest
): Promise<UserProfile> => {
  // TODO: decomentează când API-ul e gata
  // const { data: response } = await api.patch(ENDPOINTS.USERS.UPDATE_PREFERENCES, data);
  // return response;

  await delay(600);
  return { ...mockUser, preferences: { ...mockUser.preferences, ...data } };
};

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileFn,
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
      toast.success("Profilul a fost actualizat cu succes");
    },
    onError: () => {
      toast.error("Eroare la actualizarea profilului");
    },
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePreferencesFn,
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
      toast.success("Preferințele au fost salvate");
    },
    onError: () => {
      toast.error("Eroare la salvarea preferințelor");
    },
  });
}
