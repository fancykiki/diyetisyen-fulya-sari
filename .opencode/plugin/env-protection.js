export const EnvProtection = async () => {
  const blocked = [
    ".env",
    ".env.local",
    ".env.production",
    ".env.development",
    "wp-config.php",
    "database.sql",
    "backup.sql",
    "dump.sql",
    "db.sql",
    ".pem",
    ".key"
  ]

  function isBlocked(filePath = "") {
    const normalized = String(filePath).toLowerCase().replaceAll("\\", "/")
    return blocked.some((name) => normalized.includes(name.toLowerCase()))
  }

  return {
    "tool.execute.before": async (input, output) => {
      const args = output?.args || input?.args || {}

      const filePath =
        args.filePath ||
        args.path ||
        args.file ||
        args.target ||
        args.filename ||
        ""

      if (isBlocked(filePath)) {
        throw new Error(`Güvenlik için bu dosyaya erişim engellendi: ${filePath}`)
      }
    },
  }
}
