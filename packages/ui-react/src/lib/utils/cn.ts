import { type ClassNameValue, twMerge } from "tailwind-merge";

export const cnMerge = (...classNames: ClassNameValue[]) => twMerge(classNames);
