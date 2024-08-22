import { addDays, format } from "date-fns";

import supabase from "../services/supabase";
import {
  ClientAddressProps,
  CreateInvoiceProps,
  InvoiceDataProps,
  ItemProps,
  SenderAddressProps,
} from "../types/Types";

type InvoiceResponse2 = {
  data: InvoiceDataProps[];
  error: any;
};

export const getAllInvoices = async (
  status: "all" | "pending" | "draft" | "paid" = "all"
): Promise<InvoiceResponse2> => {
  let query = supabase.from("invoice").select(`
    *,
    senderAdd (*),
    clientAddress (*),
    items (*)
  `);

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.log(error);
    throw new Error(`Could not get ${status} Invoices`);
  }

  return { data, error };
};

export const getInvoiceById = async (id: string): Promise<InvoiceResponse2> => {
  const { data, error } = await supabase
    .from("invoice")
    .select(
      `
  *,
  senderAdd (*),
  clientAddress (*),
  items (*)
  `
    )
    .eq("id", id);

  if (error) {
    console.log(error);
    throw new Error(`Could not get Invoice ${id}`);
  }

  return { data, error };
};

export const createItemRow = async (item: ItemProps) => {
  const { data, error } = await supabase.from("items").insert([item]).select();

  if (error) {
    console.log(error);
    throw new Error(`Could not create item ${item.name}`);
  }

  return { data, error };
};

export const createInvoiceRow = async (invoice: CreateInvoiceProps) => {
  const { data, error } = await supabase
    .from("invoice")
    .insert([invoice])
    .select();

  if (error) {
    console.log(error);
    throw new Error(`Could not create Invoice ${invoice.clientName}`);
  }

  return { data, error };
};

export const createClientAddressRow = async (address: ClientAddressProps) => {
  const { data, error } = await supabase
    .from("clientAddress")
    .insert([address])
    .select();

  if (error) {
    console.error(error);
    throw new Error(`Could not create clientAddress`);
  }

  return { data, error };
};

export const createSenderAddressRow = async (address: SenderAddressProps) => {
  const { data, error } = await supabase
    .from("senderAdd")
    .insert([address])
    .select();

  if (error) {
    console.error(error);
    throw new Error(`Could not create senderAddress`);
  }

  return { data, error };
};

export const createItemsRow = async (items: ItemProps) => {
  const { data, error } = await supabase.from("items").insert([items]).select();

  if (error) {
    console.error(error);
    throw new Error(`Could not create items`);
  }

  return { data, error };
};

export const updateInvoiceRows = async (
  invoice: CreateInvoiceProps,
  invoiceId: string
) => {
  const { data, error } = await supabase
    .from("invoice")
    .update({
      idd: invoice.idd,
      id: invoice.id,
      createdAt: invoice.createdAt,
      paymentDue: invoice.paymentDue,
      description: invoice.description,
      paymentTerms: invoice.paymentTerms,
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      status: invoice.status,
      total: invoice.total,
    })
    .eq("id", invoiceId)
    .select();

  if (error) {
    console.log(error);
    throw new Error(`Could not update item ${invoice.clientName}`);
  }

  return { data, error };
};

export const updateClientAddress = async (
  address: ClientAddressProps,
  id: number
) => {
  const { data, error } = await supabase
    .from("clientAddress")
    .update({
      id: address.id,
      invoiceId: address.invoiceId,
      street: address.street,
      city: address.city,
      country: address.country,
      postCode: address.postCode,
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    throw new Error(`Could not update clientAddress`);
  }

  return { data, error };
};

export const updateSenderAddress = async (
  address: SenderAddressProps,
  id: number
) => {
  const { data, error } = await supabase
    .from("senderAdd")
    .update({
      id: address.id,
      invoiceId: address.invoiceId,
      street: address.street,
      city: address.city,
      country: address.country,
      postCode: address.postCode,
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    throw new Error(`Could not update senderAddress`);
  }

  return { data, error };
};

export const updateItemsRow = async (item: ItemProps, id: number) => {
  const { data, error } = await supabase
    .from("items")
    .upsert({
      id: item.id,
      invoiceId: item.invoiceId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.total,
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    throw new Error(`Could not update senderAddress`);
  }

  return { data, error };
};

export const deleteItemsRow = async (id: number) => {
  const { error } = await supabase.from("items").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error(`Could not delete item`);
  }
};

export const deleteSenderRow = async (id: number) => {
  const { error } = await supabase.from("senderAdd").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error(`Could not delete item`);
  }
};

export const deleteClientRow = async (id: number) => {
  const { error } = await supabase.from("clientAddress").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error(`Could not delete item`);
  }
};

export const deleteInvoiceRow = async (id: number) => {
  const { error } = await supabase.from("invoice").delete().eq("idd", id);

  if (error) {
    console.error(error);
    throw new Error(`Could not delete item`);
  }
};

export const toggleStatus = async (id: string) => {
  const { data, error } = await supabase
    .from("invoice")
    .update({ status: "paid" })
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    throw new Error(`Could not update status ${id}`);
  }

  return { data, error };
};

export const generateRandomId = () => {
  const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  const randomUppercaseLetter1 = uppercaseLetters.charAt(
    Math.floor(Math.random() * uppercaseLetters.length)
  );
  const randomUppercaseLetter2 = uppercaseLetters.charAt(
    Math.floor(Math.random() * uppercaseLetters.length)
  );

  const randomId = `${randomUppercaseLetter1}${randomUppercaseLetter2}${randomNumber}`;

  return randomId;
};

export const getPaymentDue = (createdAt: string, paymentTerms: number) => {
  const paymentDueDate = addDays(createdAt, paymentTerms);
  const formattedPaymentDueDate = format(paymentDueDate, "yyyy-MM-dd");
  return formattedPaymentDueDate;
};
