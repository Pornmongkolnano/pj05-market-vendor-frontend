"use client";

import { useRouter } from "next/navigation";
import { type SubmitEvent, useState } from "react";
import { isRole } from "@/lib/auth-types";
import {
  minimumPasswordLength,
  type RegistrationValues,
  validateRegistration,
} from "@/lib/registration";

const fields = [
  {
    name: "name",
    label: "Full name",
    placeholder: "Enter your name",
    type: "text",
    autoComplete: "name",
  },
  {
    name: "email",
    label: "Email address",
    placeholder: "you@example.com",
    type: "email",
    autoComplete: "email",
  },
  {
    name: "tel",
    label: "Phone number",
    placeholder: "Enter your phone number",
    type: "tel",
    autoComplete: "tel",
  },
  { name: "role", label: "Role", type: "select" },
  {
    name: "password",
    label: "Password",
    placeholder: "Create a password",
    type: "password",
    autoComplete: "new-password",
  },
] as const;

type FieldName = keyof RegistrationValues;

const initialValues: RegistrationValues = {
  name: "",
  email: "",
  tel: "",
  role: "member",
  password: "",
};

const submitMessages = {
  emailInUse: "This email address is already registered.",
  invalid: "Check your registration details and try again.",
  rateLimited: "Too many registration attempts. Please try again later.",
  unavailable: "Registration is temporarily unavailable. Please try again.",
};

type SubmitStatus = "submitting" | keyof typeof submitMessages | null;

function focusField(form: HTMLFormElement, name: FieldName) {
  const input = form.elements.namedItem(name);
  if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement) {
    input.focus();
  }
}

export default function RegisterForm({ successUrl }: { successUrl: string }) {
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

  function updateField(name: Exclude<FieldName, "role">, value: string) {
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
      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      switch (response.status) {
        case 201:
          router.replace(successUrl);
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
    <form
      method="post"
      noValidate
      onSubmit={handleSubmit}
      className="market-auth-form"
    >
      <div className="market-fields">
        {fields.map((field) => {
          const { name, label, type } = field;
          if (type === "select") {
            return (
              <div key={name} className="market-field">
                <label htmlFor={name}>{label}</label>
                <select
                  id={name}
                  name={name}
                  className="market-control"
                  required
                  disabled={isSubmitting}
                  value={values.role}
                  onChange={(event) => {
                    const role = event.currentTarget.value;
                    if (isRole(role)) {
                      setValues((previous) => ({ ...previous, role }));
                    }
                  }}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            );
          }

          const error =
            name === "email" && duplicateEmail
              ? submitMessages.emailInUse
              : hasChecked
                ? errors[name]
                : undefined;
          const errorId = `${name}-error`;
          const hintId = name === "password" ? "password-hint" : undefined;

          return (
            <div key={name} className="market-field">
              <label htmlFor={name}>{label}</label>
              <input
                id={name}
                name={name}
                type={type}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                required
                readOnly={isSubmitting}
                value={values[name]}
                onChange={(event) =>
                  updateField(name, event.currentTarget.value)
                }
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : hintId}
                className="market-control"
              />
              {hintId ? (
                <p id={hintId} className="market-hint">
                  At least {minimumPasswordLength} characters.
                </p>
              ) : null}
              {error ? (
                <p id={errorId} className="market-field-error">
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
        className="market-primary-action"
      >
        {isSubmitting ? "Registering…" : "Register"}
      </button>
      <div role="status">
        {generalError ? (
          <p className="market-error-notice">{generalError}</p>
        ) : null}
        {duplicateEmail ? (
          <p className="sr-only">{submitMessages.emailInUse}</p>
        ) : null}
        {isSubmitting ? <p className="sr-only">Registering…</p> : null}
        {hasChecked && firstInvalidField ? (
          <p className="sr-only">Check the highlighted fields.</p>
        ) : null}
      </div>
    </form>
  );
}
