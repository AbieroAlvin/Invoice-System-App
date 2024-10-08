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

export async function getAllInvoices(
  status: "all" | "pending" | "draft" | "paid" = "all"
): Promise<InvoiceResponse2> {
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
}

export async function getInvoiceById(id: string): Promise<InvoiceResponse2> {
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
}

export async function createItemRow(item: ItemProps) {
  const { data, error } = await supabase.from("items").insert([item]).select();

  if (error) {
    console.log(error);
    throw new Error(`Could not create item ${item.name}`);
  }

  return { data, error };
}

export async function createInvoiceRow(invoice: CreateInvoiceProps) {
  const { data, error } = await supabase
    .from("invoice")
    .insert([invoice])
    .select();

  if (error) {
    console.log(error);
    throw new Error(`Could not create Invoice ${invoice.clientName}`);
  }

  return { data, error };
}

export async function createClientAddressRow(address: ClientAddressProps) {
  const { data, error } = await supabase
    .from("clientAddress")
    .insert([address])
    .select();

  if (error) {
    console.error(error);
    throw new Error(`Could not create clientAddress`);
  }

  return { data, error };
}

export async function createSenderAddressRow(address: SenderAddressProps) {
  const { data, error } = await supabase
    .from("senderAdd")
    .insert([address])
    .select();

  if (error) {
    console.error(error);
    throw new Error(`Could not create senderAddress`);
  }

  return { data, error };
}

export async function createItemsRow(items: ItemProps) {
  const { data, error } = await supabase.from("items").insert([items]).select();

  if (error) {
    console.error(error);
    throw new Error(`Could not create items`);
  }

  return { data, error };
}

export async function updateInvoiceRows(
  invoice: CreateInvoiceProps,
  invoiceId: string
) {
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
}

export async function updateClientAddress(
  address: ClientAddressProps,
  id: number
) {
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
}
export async function updateSenderAddress(
  address: SenderAddressProps,
  id: number
) {
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
}
export async function updateItemsRow(item: ItemProps, id: number) {
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
}

export async function deleteItemsRow(id: number) {
  const { error } = await supabase.from("items").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error(`Could not delete item`);
  }
}
export async function deleteSenderRow(id: number) {
  const { error } = await supabase.from("senderAdd").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error(`Could not delete item`);
  }
}
export async function deleteClientRow(id: number) {
  const { error } = await supabase.from("clientAddress").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error(`Could not delete item`);
  }
}
export async function deleteInvoiceRow(id: number) {
  const { error } = await supabase.from("invoice").delete().eq("idd", id);

  if (error) {
    console.error(error);
    throw new Error(`Could not delete item`);
  }
}

export async function toggleStatus(id: string) {
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
}

export function generateRandomId() {
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
}

export function getPaymentDue(createdAt: string, paymentTerms: number) {
  const paymentDueDate = addDays(createdAt, paymentTerms);
  const formattedPaymentDueDate = format(paymentDueDate, "yyyy-MM-dd");
  return formattedPaymentDueDate;
}
