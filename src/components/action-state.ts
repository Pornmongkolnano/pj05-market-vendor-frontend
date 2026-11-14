export type MutationState = { error: string } | null;

export type FormMutation = (
  previous: MutationState,
  data: FormData,
) => Promise<MutationState>;

export function textField(data: FormData, name: string) {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}
