import { useMutation } from "@tanstack/react-query";
import { deleteItemsRow } from "../../utils/helpers";

export const useDeleteItems = () => {
  const { mutate: deleteItems, isSuccess: isDeletingItems } = useMutation({
    mutationFn: (id: number) => deleteItemsRow(id),
  });

  return { deleteItems, isDeletingItems };
};
