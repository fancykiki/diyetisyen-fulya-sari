export const SessionReport = async ({ client }) => {
  return {
    event: async ({ event }) => {
      if (event.type === "session.idle") {
        await client.app.log({
          service: "session-report",
          level: "info",
          message: "OpenCode işi tamamladı. Değişiklikleri Git/diff ekranından kontrol et kral.",
        })
      }

      if (event.type === "session.error") {
        await client.app.log({
          service: "session-report",
          level: "error",
          message: "OpenCode session hata verdi. Son komutları ve değişen dosyaları kontrol et.",
        })
      }
    },
  }
}
