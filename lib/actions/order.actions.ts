import { nanoid } from "nanoid";
import { db } from "../db";

export const createOrder = async (
  userId: string,
  totalAmount: string,
  stripepaymentId: string
) => {
  const id = nanoid();
  const status = "pending";
};
