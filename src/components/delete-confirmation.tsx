"use client";

import { useActionState, useState } from "react";
import type { FormMutation } from "./action-state";

export default function DeleteConfirmation({
  action,
  label,
  prompt,
}: {
  action: FormMutation;
  label: string;
  prompt: string;
}) {
  const [state, submit, pending] = useActionState(action, null);
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="button-secondary text-dark-wine cursor-pointer"
      >
        {label}
      </button>
    );
  }

  return (
    <form action={submit} className="space-y-2">
      <p className="text-sm" role="status">
        {prompt}
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={pending} className="button-primary">
          {pending ? "กำลังดำเนินการ…" : "ยืนยัน"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => setConfirming(false)}
          className="button-secondary"
        >
          ยกเลิก
        </button>
      </div>
      {state ? (
        <p role="alert" className="mt-2 text-sm text-red-800">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
