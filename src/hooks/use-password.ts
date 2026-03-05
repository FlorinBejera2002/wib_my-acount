import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { delay } from "@/lib/utils";
import type { ChangePasswordRequest } from "@/api/types";

const changePasswordFn = async (data: ChangePasswordRequest): Promise<void> => {
  // TODO: decomentează când API-ul e gata
  // await api.post(ENDPOINTS.USERS.CHANGE_PASSWORD, data);

  await delay(700);

  if (data.oldPassword === "wrong") {
    throw new Error("Parola actuală este incorectă");
  }
};

export function useChangePassword() {
  return useMutation({
    mutationFn: changePasswordFn,
    onSuccess: () => {
      toast.success("Parola a fost schimbată cu succes");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Eroare la schimbarea parolei");
    },
  });
}
