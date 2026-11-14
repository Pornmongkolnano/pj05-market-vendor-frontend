"use client";

import { type SubmitEvent, useState } from "react";

const fields = [
  { name: "name", label: "ชื่อ", type: "text", autoComplete: "name" },
  { name: "email", label: "อีเมล", type: "email", autoComplete: "email" },
  { name: "tel", label: "เบอร์โทรศัพท์", type: "tel", autoComplete: "tel" },
  {
    name: "password",
    label: "รหัสผ่าน",
    type: "password",
    autoComplete: "new-password",
  },
] as const;

type FieldName = (typeof fields)[number]["name"];
type FormValues = Record<FieldName, string>;
type FormErrors = Partial<Record<FieldName, string>>;

const initialValues: FormValues = {
  name: "",
  email: "",
  tel: "",
  password: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const minimumPasswordLength = 6;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
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

export default function RegisterForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [hasChecked, setHasChecked] = useState(false);
  const errors = validate(values);
  const firstInvalidField = fields.find(({ name }) => errors[name]);

  function updateField(name: FieldName, value: string) {
    setValues((previous) => ({ ...previous, [name]: value }));
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasChecked(true);

    if (firstInvalidField) {
      const input = event.currentTarget.elements.namedItem(
        firstInvalidField.name,
      );
      if (input instanceof HTMLInputElement) {
        input.focus();
      }
    }
  }

  return (
    <form method="post" noValidate onSubmit={handleSubmit} className="mt-6">
      <div className="space-y-4">
        {fields.map(({ name, label, type, autoComplete }) => {
          const error = hasChecked ? errors[name] : undefined;
          const errorId = `${name}-error`;

          return (
            <div key={name}>
              <label htmlFor={name} className="block text-sm font-medium">
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                autoComplete={autoComplete}
                required
                value={values[name]}
                onChange={(event) =>
                  updateField(name, event.currentTarget.value)
                }
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                className="mt-1.5 block min-h-11 w-full rounded-lg border border-slate-500 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 aria-invalid:border-red-700"
              />
              {error ? (
                <p id={errorId} className="mt-1.5 text-sm text-red-700">
                  {error}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
      <button
        type="submit"
        className="mt-6 min-h-11 w-full rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
      >
        ตรวจสอบข้อมูล
      </button>
      <div role="status">
        {hasChecked ? (
          <p
            className={
              firstInvalidField
                ? "sr-only"
                : "mt-4 rounded-lg bg-emerald-50 px-3 py-2.5 text-sm text-emerald-900"
            }
          >
            {firstInvalidField
              ? "กรุณาแก้ไขช่องที่มีข้อผิดพลาด"
              : "ข้อมูลผ่านการตรวจสอบแล้ว"}
          </p>
        ) : null}
      </div>
    </form>
  );
}
