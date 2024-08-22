import { useMutation } from "@tanstack/react-query";
import { createSenderAddressRow } from "../../utils/helpers";
import { SenderAddressProps } from "../../types/Types";

export const useCreateSenderAdd = () => {
  const { mutate: createSAddress, isPending: creatingSAddress } = useMutation({
    mutationFn: (address: SenderAddressProps) =>
      createSenderAddressRow(address),
  });
  return { createSAddress, creatingSAddress };
};
