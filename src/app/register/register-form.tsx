"use client";

import { useRouter } from "next/navigation";
import { type SubmitEvent, useState } from "react";
import {
  type RegistrationValues,
  validateRegistration,
} from "@/lib/registration";

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

type FieldName = keyof RegistrationValues;

const initialValues: RegistrationValues = {
  name: "",
  email: "",
  tel: "",
  password: "",
};

const submitMessages = {
  emailInUse: "อีเมลนี้ถูกใช้สมัครสมาชิกแล้ว",
  invalid: "กรุณาตรวจสอบข้อมูลสมัครสมาชิกอีกครั้ง",
  rateLimited: "มีคำขอสมัครสมาชิกมากเกินไป กรุณาลองใหม่ภายหลัง",
  unavailable: "ระบบสมัครสมาชิกขัดข้อง กรุณาลองใหม่อีกครั้ง",
};

type SubmitStatus = "submitting" | keyof typeof submitMessages | null;

function focusField(form: HTMLFormElement, name: FieldName) {
  const input = form.elements.namedItem(name);
  if (input instanceof HTMLInputElement) {
    input.focus();
  }
}

export default function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState<RegistrationValues>(initialValues);
  const [hasChecked, setHasChecked] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);
  const errors = validateRegistration(values);
  const firstInvalidField = fields.find(({ name }) => errors[name]);
  const isSubmitting = submitStatus === "submitting";
  const duplicateEmail = submitStatus === "emailInUse";
  const generalError =
    submitStatus && !isSubmitting && !duplicateEmail
      ? submitMessages[submitStatus]
      : null;

  function updateField(name: FieldName, value: string) {
    setValues((previous) => ({ ...previous, [name]: value }));
    if (name === "email" && duplicateEmail) {
      setSubmitStatus(null);
    }
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setHasChecked(true);
    const form = event.currentTarget;

    if (firstInvalidField) {
      focusField(form, firstInvalidField.name);
      return;
    }

    setSubmitStatus("submitting");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      switch (response.status) {
        case 201:
          router.replace("/login?registered=1");
          break;
        case 400:
          setSubmitStatus("invalid");
          break;
        case 409:
          setSubmitStatus("emailInUse");
          focusField(form, "email");
          break;
        case 429:
          setSubmitStatus("rateLimited");
          break;
        default:
          setSubmitStatus("unavailable");
      }
    } catch {
      setSubmitStatus("unavailable");
    }
  }

  return (
    <form method="post" noValidate onSubmit={handleSubmit} className="mt-6">
      <div className="space-y-4">
        {fields.map(({ name, label, type, autoComplete }) => {
          const error =
            name === "email" && duplicateEmail
              ? submitMessages.emailInUse
              : hasChecked
                ? errors[name]
                : undefined;
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
                readOnly={isSubmitting}
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
        disabled={isSubmitting}
        className="mt-6 min-h-11 w-full rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white enabled:hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-wait disabled:opacity-70"
      >
        {isSubmitting ? "กำลังสมัครสมาชิก…" : "สมัครสมาชิก"}
      </button>
      <div role="status">
        {generalError ? (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-900">
            {generalError}
          </p>
        ) : null}
        {duplicateEmail ? (
          <p className="sr-only">{submitMessages.emailInUse}</p>
        ) : null}
        {isSubmitting ? <p className="sr-only">กำลังสมัครสมาชิก…</p> : null}
        {hasChecked && firstInvalidField ? (
          <p className="sr-only">กรุณาแก้ไขช่องที่มีข้อผิดพลาด</p>
        ) : null}
      </div>
    </form>
  );
}
