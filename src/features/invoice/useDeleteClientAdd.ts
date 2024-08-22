import { useMutation } from "@tanstack/react-query";
import { deleteClientRow } from "../../utils/helpers";

export const useDeleteClientAdd = () => {
  const { mutate: deleteClient, isSuccess: isDeletingClient } = useMutation({
    mutationFn: (id: number) => deleteClientRow(id),
  });

  return { deleteClient, isDeletingClient };
};
