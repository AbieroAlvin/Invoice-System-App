import { useState } from "react";
import { useForm } from "react-hook-form";
import { InvoiceDataProps } from "../../types/Types";
import { motion } from "framer-motion";
import CreateInvoiceItem from "./CreateInvoiceItem";
import { useCreateInvoice } from "./useCreateInvoice";
import { generateRandomId, getPaymentDue } from "../../utils/helpers";
import { useCreateSenderAdd } from "./useCreateSenderAdd";
import { useCreateClientAdd } from "./useCreateClientAdd";
import { useCreateItems } from "./useCreateItems";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../../context/DarkModeContext";

type InitialItems = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  total: number;
  invoiceId: number;
};

type CreateInvoiceProps = {
  setCreateInvoice: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateInvoice = ({ setCreateInvoice }: CreateInvoiceProps) => {
  const [isPaymentDisplayed, setIsPaymentDisplayed] = useState(false);
  const [payment, setPayment] = useState(1);
  const [status, setStatus] = useState("pending");
  const [itemsList, setItemsList] = useState<InitialItems[]>([]);

  const navigate = useNavigate();

  const { register, handleSubmit, formState, getValues, setValue } =
    useForm<InvoiceDataProps>();
  const { errors } = formState;

  const { createInvoice, creatingInvoice } = useCreateInvoice();
  const { createSAddress, creatingSAddress } = useCreateSenderAdd();
  const { createClAddress, creatingClAddress } = useCreateClientAdd();
  const { createItems, creatingItems } = useCreateItems();
  const { isDarkMode } = useDarkMode();

  const togglePaymentDisplay = () => {
    setIsPaymentDisplayed((prev) => !prev);
  };

  const toggleItemsList = () => {
    setItemsList((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        quantity: 0,
        price: 0,
        total: 0,
        invoiceId: Date.now(),
      },
    ]);
  };

  const onSubmit = (data: InvoiceDataProps) => {
    const invoiceId = Date.now();

    setValue(`clientAddress.${0}.invoiceId`, invoiceId);

    setValue(`senderAdd.${0}.invoiceId`, invoiceId);
    const randomId = generateRandomId();
    const paymentDueDate = getPaymentDue(data.createdAt, payment);

    const invoiceData = {
      idd: invoiceId,
      id: randomId,
      createdAt: data.createdAt,
      paymentDue: paymentDueDate,
      description: data.description,
      paymentTerms: payment,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      status: status,
      total: getValues()?.items?.reduce((acc, item) => acc + item.total, 0),
    };

    const clientData = {
      id: Date.now(),
      street: getValues().clientAddress[0].street,
      city: getValues().clientAddress[0].city,
      postCode: getValues().clientAddress[0].postCode,
      country: getValues().clientAddress[0].country,
      invoiceId: invoiceId,
    };

    const senderData = {
      id: Date.now(),
      street: getValues().senderAdd[0].street,
      city: getValues().senderAdd[0].city,
      postCode: getValues().senderAdd[0].postCode,
      country: getValues().senderAdd[0].country,
      invoiceId: invoiceId,
    };

    createInvoice(invoiceData, {
      onSuccess: () => {
        // Once the invoice is created successfully, create the rest of the data
        const itemsList = getValues()?.items;

        itemsList.forEach((item) => {
          const itemsData = {
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
            invoiceId: invoiceId,
          };

          createItems(itemsData);
        });

        createClAddress(clientData);
        createSAddress(senderData, {
          onSuccess: () => {
            navigate(`/invoice/${randomId}`);
          },
        });
      },
    });
  };

  const handleDeleteItem = (id: number) => {
    setItemsList(itemsList.filter((_, index) => index !== id));
    const updatedItemsList = getValues().items.filter(
      (_, index) => index !== id
    );

    setValue("items", updatedItemsList);
  };

  return (
    <form
      className={`absolute left-[8rem] top-0 z-[9] h-full max-w-[80rem] overflow-y-auto pb-20 pl-28 pr-20 pt-28 laptop:left-0 laptop:top-[6rem] mobile:px-0 ${
        isDarkMode ? "bg-[#141625]" : "bg-white"
      }`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div
        onClick={() => setCreateInvoice(false)}
        className="hidden cursor-pointer items-center gap-12 pb-12 laptop:flex mobile:px-8"
      >
        <img src="/icon-arrow-left.svg" alt="arrow left" />
        <p
          className={`text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem] ${isDarkMode ? "text-white hover:text-[#888eb0]" : "text-[#0c0e16] hover:text-[#7e88c3]"}`}
        >
          Go back
        </p>
      </div>

      <h2
        className={`pb-[4.6rem] text-[2.4rem] font-bold leading-[3.2rem] tracking-[-0.05rem] mobile:px-8 ${isDarkMode ? "text-white" : "text-[#0c0e16]"}`}
      >
        New Invoice
      </h2>

      <div className="mobile:px-8">
        <h3 className="pb-[2.4rem] text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem] text-[#7c5dfa]">
          Bill From
        </h3>

        <div>
          <div className="flex items-center justify-between">
            <label
              className={`block pb-4 text-[1.3rem] font-medium leading-[1.5rem] tracking-[-0.01rem] ${errors?.senderAdd?.[0]?.street?.message ? "text-[#ec5757]" : isDarkMode ? "text-[#dfe3fa]" : "text-[#7e88c3]"} `}
              htmlFor="billAddress"
            >
              Street Address
            </label>
            {errors?.senderAdd?.[0]?.street?.message && (
              <p className="text-[1rem] font-semibold leading-[1.5rem] tracking-[-0.0208rem] text-[#ec5757]">
                {errors.senderAdd?.[0]?.street.message}
              </p>
            )}
          </div>
          <input
            type="text"
            id="billAddress"
            className={`w-full rounded-[0.4rem] border border-solid px-8 py-6 text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem] focus:border  focus:outline-none disabled:bg-slate-200 disabled:text-zinc-500 ${errors?.senderAdd?.[0]?.street?.message ? "border-[#ec5757]" : isDarkMode ? "border-[#252945] focus:border-[#9277ff]" : "border-[#dfe3fa] focus:border-[#9277ff]"} ${isDarkMode ? "bg-[#1e2139] text-white" : "bg-white text-[#0c0e16]"}`}
            {...register(`senderAdd.${0}.street`, {
              required: "can’t be empty",
            })}
            disabled={creatingSAddress}
          />
        </div>

        <div className="grid grid-cols-3 gap-10 pb-20 pt-10 mobile:grid-cols-2">
          <div>
            <div className="flex items-center justify-between">
              <label
                className={`block pb-4 text-[1.3rem] font-medium leading-[1.5rem] tracking-[-0.01rem] ${errors?.senderAdd?.[0]?.city?.message ? "text-[#ec5757]" : isDarkMode ? "text-[#dfe3fa]" : "text-[#7e88c3]"}`}
                htmlFor="billCity"
              >
                City
              </label>

              {errors?.senderAdd?.[0]?.city?.message && (
                <p className="text-[1rem] font-semibold leading-[1.5rem] tracking-[-0.0208rem] text-[#ec5757]">
                  {errors.senderAdd?.[0]?.city.message}
                </p>
              )}
            </div>
            <input
              type="text"
              id="billCity"
              className={`w-full rounded-[0.4rem] border border-solid px-8 py-6 text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem] focus:border focus:outline-none disabled:bg-slate-200 disabled:text-zinc-500  ${errors?.senderAdd?.[0]?.city?.message ? "border-[#ec5757]" : isDarkMode ? "border-[#252945] focus:border-[#9277ff]" : "border-[#dfe3fa] focus:border-[#9277ff]"} ${isDarkMode ? "bg-[#1e2139] text-white" : "bg-white text-[#0c0e16]"}`}
              {...register(`senderAdd.${0}.city`, {
                required: "can’t be empty",
              })}
              disabled={creatingSAddress}
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                className={`block pb-4 text-[1.3rem] font-medium leading-[1.5rem] tracking-[-0.01rem] ${errors?.senderAdd?.[0]?.postCode?.message ? "text-[#ec5757]" : isDarkMode ? "text-[#dfe3fa]" : "text-[#7e88c3]"}`}
                htmlFor="postCode"
              >
                Post Code
              </label>
              {errors?.senderAdd?.[0]?.postCode?.message && (
                <p className="text-[1rem] font-semibold leading-[1.5rem] tracking-[-0.0208rem] text-[#ec5757]">
                  {errors.senderAdd?.[0]?.postCode.message}
                </p>
              )}
            </div>
            <input
              type="text"
              id="postCode"
              className={`w-full rounded-[0.4rem] border border-solid  px-8 py-6 text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem] focus:border focus:outline-none disabled:bg-slate-200 disabled:text-zinc-500  ${errors?.senderAdd?.[0]?.postCode?.message ? "border-[#ec5757]" : isDarkMode ? "border-[#252945] focus:border-[#9277ff]" : "border-[#dfe3fa] focus:border-[#9277ff]"} ${isDarkMode ? "bg-[#1e2139] text-white" : "bg-white text-[#0c0e16]"}`}
              {...register(`senderAdd.${0}.postCode`, {
                required: "can’t be empty",
              })}
              disabled={creatingSAddress}
            />
          </div>
          <div className="mobile:col-span-full">
            <div className="flex items-center justify-between">
              <label
                className={`block pb-4 text-[1.3rem] font-medium leading-[1.5rem] tracking-[-0.01rem] ${errors?.senderAdd?.[0]?.country?.message ? "text-[#ec5757]" : isDarkMode ? "text-[#dfe3fa]" : "text-[#7e88c3]"}`}
                htmlFor="billCountry"
              >
                Country
              </label>
              {errors?.senderAdd?.[0]?.country?.message && (
                <p className="text-[1rem] font-semibold leading-[1.5rem] tracking-[-0.0208rem] text-[#ec5757]">
                  {errors.senderAdd?.[0]?.country.message}
                </p>
              )}
            </div>
            <input
              type="text"
              id="billCountry"
              className={`w-full rounded-[0.4rem] border border-solid px-8 py-6 text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem] focus:border focus:outline-none disabled:bg-slate-200 disabled:text-zinc-500 ${errors?.senderAdd?.[0]?.country?.message ? "border-[#ec5757]" : isDarkMode ? "border-[#252945] focus:border-[#9277ff]" : "border-[#dfe3fa] focus:border-[#9277ff]"} ${isDarkMode ? "bg-[#1e2139] text-white" : "bg-white text-[#0c0e16]"}`}
              {...register(`senderAdd.${0}.country`, {
                required: "can’t be empty",
              })}
              disabled={creatingSAddress}
            />
          </div>
        </div>
      </div>

      <div className="mobile:px-8">
        <h3 className="pb-[2.4rem] text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem] text-[#7c5dfa]">
          Bill To
        </h3>

        <div className="space-y-10">
          <div>
            <div className="flex items-center justify-between">
              <label
                className={`block pb-4 text-[1.3rem] font-medium leading-[1.5rem] tracking-[-0.01rem] ${errors?.clientName?.message ? "text-[#ec5757]" : isDarkMode ? "text-[#dfe3fa]" : "text-[#7e88c3]"} `}
                htmlFor="clientName"
              >
                Client's Name
              </label>
              {errors?.clientName?.message && (
                <p className="text-[1rem] font-semibold leading-[1.5rem] tracking-[-0.0208rem] text-[#ec5757]">
                  {errors.clientName.message}
                </p>
              )}
            </div>
            <input
              type="text"
              id="clientName"
              className={`w-full rounded-[0.4rem] border border-solid px-8 py-6 text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem] focus:border  focus:outline-none disabled:bg-slate-200 disabled:text-zinc-500  ${errors?.clientName?.message ? "border-[#ec5757]" : isDarkMode ? "border-[#252945] focus:border-[#9277ff]" : "border-[#dfe3fa] focus:border-[#9277ff]"} ${isDarkMode ? "bg-[#1e2139] text-white" : "bg-white text-[#0c0e16]"}`}
              {...register("clientName", { required: "can’t be empty" })}
              disabled={creatingInvoice}
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                className={`block pb-4 text-[1.3rem] font-medium leading-[1.5rem] tracking-[-0.01rem] ${errors?.clientEmail?.message ? "text-[#ec5757]" : isDarkMode ? "text-[#dfe3fa]" : "text-[#7e88c3]"}`}
                htmlFor="clientMail"
              >
                Client's Mail
              </label>
              {errors?.clientEmail?.message && (
                <p className="text-[1rem] font-semibold leading-[1.5rem] tracking-[-0.0208rem] text-[#ec5757]">
                  {errors.clientEmail.message}
                </p>
              )}
            </div>
            <input
              type="email"
              id="clientMail"
              className={`w-full rounded-[0.4rem] border border-solid px-8 py-6 text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem] focus:border focus:outline-none disabled:bg-slate-200 disabled:text-zinc-500 ${errors?.clientEmail?.message ? "border-[#ec5757]" : isDarkMode ? "border-[#252945] focus:border-[#9277ff]" : "border-[#dfe3fa] focus:border-[#9277ff]"} ${isDarkMode ? "bg-[#1e2139] text-white" : "bg-white text-[#0c0e16]"}`}
              {...register("clientEmail", {
                required: "can’t be empty",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please provide a valid email address",
                },
              })}
              disabled={creatingInvoice}
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                className={`block pb-4 text-[1.3rem] font-medium leading-[1.5rem] tracking-[-0.01rem] ${errors?.clientAddress?.[0]?.street?.message ? "text-[#ec5757]" : isDarkMode ? "text-[#dfe3fa]" : "text-[#7e88c3]"}`}
                htmlFor="clientAddress"
              >
                Street Address
              </label>
              {errors?.clientAddress?.[0]?.street?.message && (
                <p className="text-[1rem] font-semibold leading-[1.5rem] tracking-[-0.0208rem] text-[#ec5757]">
                  {errors?.clientAddress?.[0]?.street.message}
                </p>
              )}
            </div>
            <input
              type="text"
              id="clientAddress"
              className={`w-full rounded-[0.4rem] border border-solid px-8 py-6 text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem] focus:border focus:outline-none disabled:bg-slate-200 disabled:text-zinc-500 ${errors?.clientAddress?.[0]?.street?.message ? "border-[#ec5757]" : isDarkMode ? "border-[#252945] focus:border-[#9277ff]" : "border-[#dfe3fa] focus:border-[#9277ff]"} ${isDarkMode ? "bg-[#1e2139] text-white" : "bg-white text-[#0c0e16]"}`}
              {...register(`clientAddress.${0}.street`, {
                required: "can’t be empty",
              })}
              disabled={creatingClAddress}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-10 pt-10 mobile:grid-cols-2">
          <div>
            <div className="flex items-center justify-between">
              <label
                className={`block pb-4 text-[1.3rem] font-medium leading-[1.5rem] tracking-[-0.01rem] ${errors?.clientAddress?.[0]?.city?.message ? "text-[#ec5757]" : isDarkMode ? "text-[#dfe3fa]" : "text-[#7e88c3]"}`}
                htmlFor="clientCity"
              >
                City
              </label>
              {errors?.clientAddress?.[0]?.city?.message && (
                <p className="text-[1rem] font-semibold leading-[1.5rem] tracking-[-0.0208rem] text-[#ec5757]">
                  {errors.clientAddress?.[0]?.city.message}
                </p>
              )}
            </div>
            <input
              type="text"
              id="clientCity"
              className={`w-full rounded-[0.4rem] border border-solid px-8 py-6 text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem] focus:border focus:outline-none disabled:bg-slate-200 disabled:text-zinc-500 ${errors?.clientAddress?.[0]?.city?.message ? "border-[#ec5757]" : isDarkMode ? "border-[#252945] focus:border-[#9277ff]" : "border-[#dfe3fa] focus:border-[#9277ff]"} ${isDarkMode ? "bg-[#1e2139] text-white" : "bg-white text-[#0c0e16]"}`}
              {...register(`clientAddress.${0}.city`, {
                required: "can’t be empty",
              })}
              disabled={creatingClAddress}
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                className={`block pb-4 text-[1.3rem] font-medium leading-[1.5rem] tracking-[-0.01rem] ${errors?.clientAddress?.[0]?.postCode?.message ? "text-[#ec5757]" : isDarkMode ? "text-[#dfe3fa]" : "text-[#7e88c3]"}`}
                htmlFor="clientPostCode"
              >
                Post Code
              </label>
              {errors?.clientAddress?.[0]?.postCode?.message && (
                <p className="text-[1rem] font-semibold leading-[1.5rem] tracking-[-0.0208rem] text-[#ec5757]">
                  {errors.clientAddress?.[0]?.postCode.message}
                </p>
              )}
            </div>
            <input
              type="text"
              id="clientPostCode"
              className={`w-full rounded-[0.4rem] border border-solid px-8 py-6 text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem] focus:border  focus:outline-none disabled:bg-slate-200 disabled:text-zinc-500 ${errors?.clientAddress?.[0]?.postCode?.message ? "border-[#ec5757]" : isDarkMode ? "border-[#252945] focus:border-[#9277ff]" : "border-[#dfe3fa] focus:border-[#9277ff]"} ${isDarkMode ? "bg-[#1e2139] text-white" : "bg-white text-[#0c0e16]"}`}
              {...register(`clientAddress.${0}.postCode`, {
                required: "can’t be empty",
              })}
              disabled={creatingClAddress}
            />
          </div>
          <div className="mobile:col-span-full">
            <div className="flex items-center justify-between">
              <label
                className={`block pb-4 text-[1.3rem] font-medium leading-[1.5rem] tracking-[-0.01rem] ${errors?.clientAddress?.[0]?.country?.message ? "text-[#ec5757]" : isDarkMode ? "text-[#dfe3fa]" : "text-[#7e88c3]"}`}
                htmlFor="clientCountry"
              >
                Country
              </label>
              {errors?.clientAddress?.[0]?.country?.message && (
                <p className="text-[1rem] font-semibold leading-[1.5rem] tracking-[-0.0208rem] text-[#ec5757]">
                  {errors.clientAddress?.[0]?.country.message}
                </p>
              )}
            </div>
            <input
              type="text"
              id="clientCountry"
              className={`w-full rounded-[0.4rem] border border-solid px-8 py-6 text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem] focus:border  focus:outline-none disabled:bg-slate-200 disabled:text-zinc-500 ${errors?.clientAddress?.[0]?.country?.message ? "border-[#ec5757]" : isDarkMode ? "border-[#252945] focus:border-[#9277ff]" : "border-[#dfe3fa] focus:border-[#9277ff]"} ${isDarkMode ? "bg-[#1e2139] text-white" : "bg-white text-[#0c0e16]"}`}
              {...register(`clientAddress.${0}.country`, {
                required: "can’t be empty",
              })}
              disabled={creatingClAddress}
            />
          </div>
        </div>
      </div>

      <div className="mobile:px-8">
        <div className="grid grid-cols-2 gap-10 pb-10 pt-20 mobile:grid-cols-1">
          <div>
            <div className="flex items-center justify-between">
              <label
                className={`block pb-4 text-[1.3rem] font-medium leading-[1.5rem] tracking-[-0.01rem] ${errors?.createdAt?.message ? "text-[#ec5757]" : isDarkMode ? "text-[#dfe3fa]" : "text-[#7e88c3]"}`}
                htmlFor="clientDate"
              >
                Invoice Date
              </label>
              {errors?.createdAt?.message && (
                <p className="text-[1rem] font-semibold leading-[1.5rem] tracking-[-0.0208rem] text-[#ec5757]">
                  {errors.createdAt.message}
                </p>
              )}
            </div>
            <input
              type="date"
              id="clientDate"
              className={`w-full rounded-[0.4rem] border border-solid  px-8 py-6 text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem] disabled:bg-slate-200 ${errors?.createdAt?.message ? "border-[#ec5757]" : isDarkMode ? "border-[#252945] focus:border-[#9277ff]" : "border-[#dfe3fa] focus:border-[#9277ff]"} ${isDarkMode ? "bg-[#1e2139] text-white" : "bg-white text-[#0c0e16]"}`}
              {...register("createdAt", { required: "can’t be empty" })}
              disabled={creatingInvoice}
            />
          </div>
          <div>
            <label
              className={`block pb-4 text-[1.3rem] font-medium leading-[1.5rem] tracking-[-0.01rem] ${isDarkMode ? "text-[#dfe3fa]" : "text-[#7e88c3]"}`}
              htmlFor="paymentTerms"
            >
              Payment Terms
            </label>
            <div
              className={`relative flex cursor-pointer items-center justify-between rounded-[0.4rem] border border-solid  px-8 py-6 ${isDarkMode ? "border-[#252945] bg-[#1e2139]" : "border-[#dfe3fa] bg-white"}`}
              onClick={togglePaymentDisplay}
            >
              <p
                className={`text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem] ${isDarkMode ? "text-white" : "text-[#0c0e16]"}`}
              >
                Next {payment} {payment === 1 ? "Day" : "Days"}
              </p>
              <motion.img
                src="/icon-arrow-down.svg"
                alt="arrow down"
                initial={{ rotate: 0 }}
                animate={{ rotate: isPaymentDisplayed ? 180 : 0 }}
              />
              {isPaymentDisplayed && (
                <div
                  className={`absolute left-0 top-[5rem] w-full divide-y-[1px] divide-solid  rounded-[0.8rem]  py-[1.6rem] shadow-bigSh ${isDarkMode ? "divide-[#1e2139] bg-[#252945] text-white" : "divide-[#dfe3fa] bg-white text-[#0c0e16]"}`}
                >
                  <p
                    className="px-[2.4rem] pb-6 text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem] hover:text-[#9277ff]"
                    onClick={() => setPayment(1)}
                  >
                    Next 1 Day
                  </p>
                  <p
                    className="px-[2.4rem] py-6 text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem] hover:text-[#9277ff]"
                    onClick={() => setPayment(7)}
                  >
                    Next 7 Days
                  </p>
                  <p
                    className="px-[2.4rem] py-6 text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem] hover:text-[#9277ff]"
                    onClick={() => setPayment(14)}
                  >
                    Next 14 Days
                  </p>
                  <p
                    className="px-[2.4rem] pt-6 text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem] hover:text-[#9277ff]"
                    onClick={() => setPayment(30)}
                  >
                    Next 30 Days
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              className={`block pb-4 text-[1.3rem] font-medium leading-[1.5rem] tracking-[-0.01rem] ${errors?.description?.message ? "text-[#ec5757]" : isDarkMode ? "text-[#dfe3fa]" : "text-[#7e88c3]"}`}
              htmlFor="projectDescription"
            >
              Project Description
            </label>
            {errors?.description?.message && (
              <p className="text-[1rem] font-semibold leading-[1.5rem] tracking-[-0.0208rem] text-[#ec5757]">
                {errors.description.message}
              </p>
            )}
          </div>
          <input
            type="text"
            id="projectDescription"
            className={`w-full rounded-[0.4rem] border border-solid px-8 py-6 text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem] focus:border  focus:outline-none disabled:bg-slate-200 disabled:text-zinc-500 ${errors?.description?.message ? "border-[#ec5757]" : isDarkMode ? "border-[#252945] focus:border-[#9277ff]" : "border-[#dfe3fa] focus:border-[#9277ff]"} ${isDarkMode ? "bg-[#1e2139] text-white" : "bg-white text-[#0c0e16]"}`}
            {...register("description", { required: "can't be empty" })}
            disabled={creatingInvoice}
          />
        </div>
      </div>

      <div className="pt-[3.5rem] mobile:px-8">
        <h3 className="pb-6 text-[1.8rem] font-bold leading-[3.2rem] tracking-[-0.0375rem] text-[#777f98]">
          Item List
        </h3>

        <div>
          <div className="grid grid-cols-[4fr_6rem_2fr_2fr_1fr] items-start gap-6 pb-6 mobile:hidden">
            <p
              className={`text-[1.3rem] font-medium leading-[1.5rem] tracking-[-0.01rem] ${isDarkMode ? "text-[#dfe3fa]" : "text-[#7e88c3]"}`}
            >
              Item Name
            </p>
            <p
              className={`text-[1.3rem] font-medium leading-[1.5rem] tracking-[-0.01rem] ${isDarkMode ? "text-[#dfe3fa]" : "text-[#7e88c3]"}`}
            >
              QTY.
            </p>
            <p
              className={`text-[1.3rem] font-medium leading-[1.5rem] tracking-[-0.01rem] ${isDarkMode ? "text-[#dfe3fa]" : "text-[#7e88c3]"}`}
            >
              Price
            </p>
            <p
              className={`text-[1.3rem] font-medium leading-[1.5rem] tracking-[-0.01rem] ${isDarkMode ? "text-[#dfe3fa]" : "text-[#7e88c3]"}`}
            >
              Total
            </p>
          </div>

          {itemsList &&
            itemsList.map((_, index) => (
              <CreateInvoiceItem
                key={index}
                register={register}
                index={index}
                errors={errors}
                onDelete={handleDeleteItem}
                setValue={setValue}
                creatingItems={creatingItems}
                isDarkMode={isDarkMode}
              />
            ))}
          <div
            className={`mt-7 flex w-full cursor-pointer items-center justify-center gap-6 rounded-[2.4rem] py-7 ${isDarkMode ? "bg-[#252945] text-white" : "bg-[#f9fafe] text-[#7e88c3] hover:bg-[#dfe3fa]"}`}
            onClick={toggleItemsList}
          >
            <img src="/icon-plus.svg" alt="plus icon" />
            <p className="text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem]">
              Add New Item
            </p>
          </div>
        </div>
      </div>
      <div className="mt-10 hidden h-[8.4rem] bg-linear-grad mobile:block"></div>
      <div className="flex items-center justify-between pt-16 mobile:px-6">
        <button
          className="rounded-[2.4rem] bg-[#f9fafe] px-11 py-7 text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem] text-[#7e88c3] mobile:px-6 mobile:py-5"
          onClick={(e) => {
            e.preventDefault();
            setCreateInvoice(false);
          }}
        >
          Discard
        </button>
        <div className="flex items-center justify-end gap-6 mobile:gap-3">
          <button
            className={`] rounded-[2.4rem] px-11 py-7 text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem] text-[#7e88c3] mobile:px-6 mobile:py-5 ${status === "draft" ? "bg-[#080911]" : "hover:bg-[#0c0e16 bg-[#7388c380]"}`}
            onClick={(e) => {
              e.preventDefault();
              setStatus("draft");
            }}
          >
            {status === "pending" ? "Save as draft" : "Saved as draft"}
          </button>
          <button className="rounded-[2.4rem] bg-[#7c5dfa] px-11 py-7 text-[1.5rem] font-bold leading-[1.5rem] tracking-[-0.025rem] text-white hover:bg-[#9277ff] mobile:px-6 mobile:py-5">
            Save & Send
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateInvoice;
