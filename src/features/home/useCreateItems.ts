import { useMutation } from "@tanstack/react-query";
import { ItemProps } from "../../types/Types";
import { createItemsRow } from "../../utils/helpers";

export const useCreateItems = () => {
  const { mutate: createItems, isPending: creatingItems } = useMutation({
    mutationFn: (item: ItemProps) => createItemsRow(item),
  });

  return { createItems, creatingItems };
};
