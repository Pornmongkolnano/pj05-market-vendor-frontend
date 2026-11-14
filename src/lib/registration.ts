export type RegistrationValues = {
  name: string;
  email: string;
  tel: string;
  password: string;
};

type RegistrationErrors = Partial<Record<keyof RegistrationValues, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const minimumPasswordLength = 6;

export function validateRegistration(
  values: RegistrationValues,
): RegistrationErrors {
  const errors: RegistrationErrors = {};
  const email = values.email.trim();

  if (!values.name.trim()) {
    errors.name = "กรุณากรอกชื่อ";
  }

  if (!email) {
    errors.email = "กรุณากรอกอีเมล";
  } else if (!emailPattern.test(email)) {
    errors.email = "กรุณากรอกอีเมลให้ถูกต้อง";
  }

  if (!values.tel.trim()) {
    errors.tel = "กรุณากรอกเบอร์โทรศัพท์";
  }

  if (!values.password.trim()) {
    errors.password = "กรุณากรอกรหัสผ่าน";
  } else if (values.password.length < minimumPasswordLength) {
    errors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
  }

  return errors;
}
