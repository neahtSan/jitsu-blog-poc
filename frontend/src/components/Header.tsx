import type { FormEvent } from "react";
import { useJitsu } from "@jitsu/jitsu-react";

export default function Header() {
  const { analytics } = useJitsu();

  function onIdentify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement & { alias: { value: string } };
    const alias = form.alias.value.trim();
    if (alias) {
      analytics.identify(alias, { alias });
      analytics.track("AliasSet", { alias });
      form.reset();
    }
  }

  return (
    <header className="header">
      {/* ...same UI... */}
      <form className="inline" onSubmit={onIdentify}>
        <input name="alias" placeholder="Set alias (identify)" aria-label="Alias" />
        <button className="button" type="submit">Identify</button>
      </form>
    </header>
  );
}
