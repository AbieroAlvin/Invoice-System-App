import { InvoiceDataProps } from "../../types/Types";
import HomeInvoiceItem from "./HomeInvoiceItem";

const HomeInvoicesBox = ({ data }: { data: InvoiceDataProps[] | null }) => {
  return (
    <section className="flex flex-col gap-[1.6rem]">
      {data?.map((info) => (
        <HomeInvoiceItem
          id={info.id}
          key={info.id}
          name={info.clientName}
          dueDate={info.paymentDue}
          status={info.status}
          amount={info.total}
        />
      ))}
    </section>
  );
};

export default HomeInvoicesBox;
