"use client";

import { useActionState, useRef } from "react";
import type { FormMutation } from "./action-state";
import { TrashIcon } from "./icons";

// <dialog> with showModal() gives the dark backdrop, focus trapping and Esc-to-close for free.
export default function DeleteSpotDialog({
  spotNumber,
  action,
}: {
  spotNumber: string;
  action: FormMutation;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, submit, pending] = useActionState(action, null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className="flex cursor-pointer items-center gap-[7px] rounded-[5px] border border-dark-wine bg-[#c0282b] px-[13px] py-2.5 text-xs leading-[1.45] font-medium text-apricot hover:bg-dark-wine"
      >
        <TrashIcon size={16} />
        Delete spot
      </button>

      <dialog
        ref={dialog}
        aria-labelledby="delete-spot-title"
        className="m-auto w-[min(707px,calc(100vw-2rem))] rounded-[10px] border border-dark-wine bg-[#fff7e3] p-0 text-coffee-bean backdrop:bg-coffee-bean/50"
      >
        <form
          action={submit}
          className="flex flex-col gap-6 p-6 sm:px-[22px] sm:pt-5 sm:pb-4"
        >
          <div className="flex flex-col gap-5 font-display font-medium">
            <h2
              id="delete-spot-title"
              className="text-[32px] leading-[1.05] text-dark-wine sm:text-[40px]"
            >
              Delete spot {spotNumber}
            </h2>
            <p className="text-xl leading-[1.15] sm:text-[23px]">
              This makes the spot inaccessible for every user and admin. This
              change cannot be undone. Do you confirm to proceed?
            </p>
          </div>

          {state ? (
            <p role="alert" className="text-sm text-dark-wine">
              {state.error}
            </p>
          ) : null}

          <div className="flex items-center justify-end gap-6">
            <button
              type="button"
              disabled={pending}
              onClick={() => dialog.current?.close()}
              className="cursor-pointer text-xs leading-[1.45] font-medium text-dark-coffee hover:underline"
            >
              cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="cursor-pointer rounded-[5px] border border-dark-wine bg-[#c0282b] px-[13px] py-2.5 text-xs leading-[1.45] font-medium text-apricot hover:bg-dark-wine disabled:cursor-wait disabled:opacity-60"
            >
              {pending ? "deleting…" : "confirm"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
