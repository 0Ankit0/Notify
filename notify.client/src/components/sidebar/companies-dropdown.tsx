"use client";
import React from "react";
import { AcmeIcon } from "../icons/acme-icon";
import Link from "next/link";

interface Company {
  name: string;
  location: string;
  logo: React.ReactNode;
}

export const CompaniesDropdown = () => {
  const company: Company = {
    name: "Acme Co.",
    location: "Palo Alto, CA",
    logo: <AcmeIcon />,
  };
  return (
    <Link className="w-full cursor-pointer" href={"/"}>
      <div className="flex items-center gap-2">
        {company.logo}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-medium m-0 text-default-900 -mb-4 whitespace-nowrap">
            {company.name}
          </h3>
          <span className="text-xs font-medium text-default-500">
            {company.location}
          </span>
        </div>
      </div>
    </Link>
  );
};
