import { useMutation } from "@tanstack/react-query";
import { updateItemsRow } from "../../utils/helpers";
import { ItemProps } from "../../types/Types";

export const useUpdateItems = () => {
  const { mutate: updateItems } = useMutation({
    mutationFn: (data: { items: ItemProps; id: number }) =>
      updateItemsRow(data.items, data.id),
  });

  return { updateItems };
};
