document.querySelectorAll(".language-sql.highlight code").forEach((code) => {
  const attributes = new Set([
    "LOGIN", "NOLOGIN", "PASSWORD", "SUPERUSER", "NOSUPERUSER",
    "CREATEDB", "NOCREATEDB", "CREATEROLE", "NOCREATEROLE",
    "INHERIT", "NOINHERIT", "REPLICATION", "NOREPLICATION",
    "BYPASSRLS", "NOBYPASSRLS", "CONNECTION", "LIMIT", "VALID", "UNTIL",
  ]);
  let state = "start";

  code.querySelectorAll("span").forEach((token) => {
    const text = token.textContent.trim();
    if (!text || token.classList.contains("w") ||
        [...token.classList].some((name) => name.startsWith("c"))) return;

    if (text === ";") {
      state = "start";
    } else if (state === "start") {
      if (/^(CREATE|ALTER)$/i.test(text)) {
        state = "role-keyword";
      } else if (/^REASSIGN$/i.test(text) && token.classList.contains("n")) {
        token.classList.add("role-attribute");
        state = "reassign-owned";
      } else {
        state = "other";
      }
    } else if (state === "reassign-owned") {
      if (/^OWNED$/i.test(text) && token.classList.contains("n")) {
        token.classList.add("role-attribute");
      }
      state = "other";
    } else if (state === "role-keyword") {
      state = /^ROLE$/i.test(text) ? "role-name" : "other";
    } else if (state === "role-name") {
      state = "attributes";
    } else if (state === "attributes" && token.classList.contains("n") &&
               attributes.has(text.toUpperCase())) {
      token.classList.add("role-attribute");
    }
  });
});
