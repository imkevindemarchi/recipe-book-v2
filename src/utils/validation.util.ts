import { TFunction } from "i18next";

export type TValidation = {
  isValid: boolean;
  message?: string;
};

export function validateEmail(email: string): boolean {
  const REG_EX: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return REG_EX.test(email);
}

export function validateFormEmail(
  email: string,
  t: TFunction,
  isRequired: boolean = false
): TValidation {
  const REG_EX: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if ((!email || email.trim() !== "") && isRequired)
    return {
      isValid: false,
      message: t("requiredField"),
    };
  else if (!isRequired) return { isValid: true };
  else if (!REG_EX.test(email))
    return {
      isValid: false,
      message: t("invalidEmail"),
    };
  else
    return {
      isValid: true,
    };
}

export function validateFormField(field: string, t: TFunction): TValidation {
  return field && field.trim() !== ""
    ? { isValid: true }
    : { isValid: false, message: t("requiredField") };
}

export function validateFormImage(image: File, t: TFunction): TValidation {
  return image
    ? { isValid: true }
    : { isValid: false, message: t("requiredField") };
}
