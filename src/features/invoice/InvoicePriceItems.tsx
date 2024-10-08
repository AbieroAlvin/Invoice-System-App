import { useDarkMode } from "../../context/DarkModeContext";

type InVoicePriceItemsProps = {
  name: string | undefined;
  qty: number | undefined;
  price: number | undefined;
  total: number | undefined;
};

const InVoicePriceItems = ({
  name,
  qty,
  price,
  total,
}: InVoicePriceItemsProps) => {
  const { isDarkMode } = useDarkMode();
  return (
    <div className="mobile:grid-cols-2 mobile:gap-12 mobile:items-center grid grid-cols-[3fr_2.6rem_1fr_1fr] gap-28 pb-12">
      <div>
        <p
          className={`text-[1.5rem] font-bold leading-[2rem] tracking-[-0.025rem] text-[#0c0e16] ${isDarkMode ? "text-white" : "text-[#0c0e16]"}`}
        >
          {name}
        </p>
        <span
          className={`mobile:block hidden justify-self-center pt-4 text-[1.5rem] font-bold leading-[2rem] tracking-[-0.025rem] ${isDarkMode ? "text-[#dfe3fa]" : "text-[#7e88c3]"}`}
        >
          {qty} x £ {(+price!).toFixed(2)}{" "}
        </span>
      </div>

      <p
        className={`mobile:hidden justify-self-center text-[1.5rem] font-bold leading-[2rem] tracking-[-0.025rem] ${isDarkMode ? "text-[#dfe3fa]" : "text-[#7e88c3]"}`}
      >
        {qty}
      </p>

      <p
        className={`mobile:hidden justify-self-end text-[1.5rem] font-bold leading-[2rem] tracking-[-0.025rem] ${isDarkMode ? "text-[#dfe3fa]" : "text-[#7e88c3]"}`}
      >
        £ {(+price!).toFixed(2)}
      </p>

      <p
        className={`justify-self-end text-[1.5rem] font-bold leading-[2rem] tracking-[-0.025rem] ${isDarkMode ? "text-white" : "text-[#0c0e16]"}`}
      >
        £ {(+total!).toFixed(2)}
      </p>
    </div>
  );
};

export default InVoicePriceItems;
