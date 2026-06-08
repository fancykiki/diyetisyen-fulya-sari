export const FrontendGuard = async ({ client }) => {
  const checklist = `
Premium Frontend Checklist:
- Mobil görünüm bozulmadı mı?
- Header, hero, kartlar ve footer tasarım dili uyumlu mu?
- Renk paleti tutarlı mı?
- Buton hover/focus durumları var mı?
- Font boyutları ve boşluklar dengeli mi?
- Gereksiz gri placeholder veya eski tema rengi kaldı mı?
- CSS class çakışması var mı?
- Animasyonlar abartısız, smooth ve performanslı mı?
- Değişiklikler sadece istenen alanlarla sınırlı mı?
- Formlar, linkler ve CTA butonları hâlâ çalışıyor mu?
`

  return {
    event: async ({ event }) => {
      if (event.type === "session.idle") {
        await client.app.log({
          service: "frontend-guard",
          level: "info",
          message: checklist,
        })
      }
    },
  }
}
