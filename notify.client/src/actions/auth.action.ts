"use server";

import { cookies } from "next/headers";

export const createAuthCookie = async (token:string) => {
  cookies().set("userAuth", token, { secure: true });
};

export const deleteAuthCookie = async () => {
  cookies().delete("userAuth");
};
