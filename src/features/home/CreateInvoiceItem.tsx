import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { InvoiceDataProps } from "../../types/Types";
import { useEffect, useState } from "react";

type CreateInvoiceItemProps = {
  register: UseFormRegister<InvoiceDataProps>;
  index: number;
  errors: FieldErrors<InvoiceDataProps>;
  onDelete: (id: number) => void;
  setValue: UseFormSetValue<InvoiceDataProps>;
  creatingItems: boolean;
  isDarkMode: boolean;
};

const CreateInvoiceItem = ({
  register,
  index,
  errors,
  onDelete,
  setValue,
  creatingItems,
  isDarkMode,
}: CreateInvoiceItemProps) => {
  const [totalQty, setTotalQty] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalPriceItem, setTotalPriceItem] = useState(0);

  useEffect(() => {
    setTotalPriceItem(totalQty * totalPrice);
    setValue(`items.${index}.id`, Date.now());
  }, [totalQty, totalPrice, index, setValue]);

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQty = Number(e.target.value);
    setTotalQty(newQty);

    const newTotal = newQty * totalPrice;
    setTotalPriceItem(newTotal);
    setValue(`items.${index}.total`, newTotal);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = Number(e.target.value);

    setTotalPrice(newPrice);

    const newTotal = totalQty * newPrice;
    setTotalPriceItem(newTotal);
    setValue(`items.${index}.total`, newTotal);
  };

  return (
    <div className="grid grid-cols-[4fr_6rem_2fr_2fr_1fr] items-center gap-6 pb-6 mobile:grid-cols-[1fr_1fr_1fr_6rem] mobile:pb-20">
      <div className="mobile:col-span-full mobile:pb-8">
        <p className="hidden pb-6 text-[1.3rem] font-medium leading-[1.5rem] tracking-[-0.01rem] text-[#888eb0] mobile:block">
          Item Name
        </p>
        <input
          type="text"
          id="itemName"
          className={`w-full rounded-[0.4rem] border border-solid  px-8 py-6 text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem] focus:border focus:outline-none disabled:bg-slate-200 disabled:text-zinc-500 ${errors?.items?.[index!]?.name ? "border-[#ec5757]" : isDarkMode ? "border-[#252945] focus:border-[#9277ff]" : "border-[#dfe3fa] focus:border-[#9277ff]"} ${isDarkMode ? "bg-[#1e2139] text-white" : "bg-white text-[#0c0e16]"}`}
          placeholder="Item name"
          {...register(`items.${index}.name`, { required: "can't be empty" })}
          disabled={creatingItems}
        />
      </div>
      <div>
        <p className="hidden pb-6 text-[1.3rem] font-medium leading-[1.5rem] tracking-[-0.01rem] text-[#888eb0] mobile:block">
          Qty.
        </p>
        <input
          type="number"
          id="qty"
          className={`w-full rounded-[0.4rem] border border-solid px-4 py-6 text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem]  focus:border focus:outline-none disabled:bg-slate-200 disabled:text-zinc-500 ${errors?.items?.[index!]?.quantity ? "border-[#ec5757]" : isDarkMode ? "border-[#252945] focus:border-[#9277ff]" : "border-[#dfe3fa] focus:border-[#9277ff]"} ${isDarkMode ? "bg-[#1e2139] text-white" : "bg-white text-[#0c0e16]"}`}
          placeholder="Qty."
          {...register(`items.${index}.quantity`, {
            required: "can't be empty",
            min: { value: 1, message: "quantity must be at least 1" },
          })}
          onChange={(e) => handleQtyChange(e)}
          disabled={creatingItems}
        />
      </div>

      <div>
        <p className="hidden pb-6 text-[1.3rem] font-medium leading-[1.5rem] tracking-[-0.01rem] text-[#888eb0] mobile:block">
          Price
        </p>
        <input
          type="number"
          id="price"
          className={`w-full rounded-[0.4rem] border border-solid  px-5 py-6 text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem] focus:border focus:border-[#9277ff] focus:outline-none disabled:bg-slate-200 disabled:text-zinc-500 ${errors?.items?.[index!]?.price ? "border-[#ec5757]" : isDarkMode ? "border-[#252945] focus:border-[#9277ff]" : "border-[#dfe3fa] focus:border-[#9277ff]"} ${isDarkMode ? "bg-[#1e2139] text-white" : "bg-white text-[#0c0e16]"}`}
          placeholder="Price"
          {...register(`items.${index}.price`, {
            required: "can't be empty",
            min: { value: 1, message: "price must be at least 1" },
          })}
          onChange={(e) => handlePriceChange(e)}
          disabled={creatingItems}
        />
      </div>

      <div>
        <p className="hidden pb-6 text-[1.3rem] font-medium leading-[1.5rem] tracking-[-0.01rem] text-[#888eb0] mobile:block">
          Total
        </p>
        <p className="py-6 text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem] text-[#888eb0]">
          {totalPriceItem.toFixed(2)}
        </p>
      </div>
      <svg
        className="h-[1.6rem] w-[1.3rem] cursor-pointer fill-[#888EB0] hover:fill-[#ec5757]"
        onClick={() => onDelete(index)}
      >
        <use xlinkHref="/icon-delete.svg#delete" />
      </svg>
    </div>
  );
};

export default CreateInvoiceItem;
