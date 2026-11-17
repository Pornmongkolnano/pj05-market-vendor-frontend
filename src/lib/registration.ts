export type RegistrationValues = {
  name: string;
  email: string;
  tel: string;
  password: string;
};

type RegistrationErrors = Partial<Record<keyof RegistrationValues, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const minimumPasswordLength = 6;

export function validateRegistration(
  values: RegistrationValues,
): RegistrationErrors {
  const errors: RegistrationErrors = {};
  const email = values.email.trim();

  if (!values.name.trim()) {
    errors.name = "Enter your name.";
  }

  if (!email) {
    errors.email = "Enter your email address.";
  } else if (!emailPattern.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.tel.trim()) {
    errors.tel = "Enter your phone number.";
  }

  if (!values.password.trim()) {
    errors.password = "Enter a password.";
  } else if (values.password.length < minimumPasswordLength) {
    errors.password = `Use at least ${minimumPasswordLength} characters.`;
  }

  return errors;
}
