import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cnMerge = (...classNames: ClassValue[]) => twMerge(clsx(classNames));
