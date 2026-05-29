/**
 * Server-side JSON-LD <script> tag. Pass any schema.org object.
 *
 * Using `dangerouslySetInnerHTML` is the recommended Next.js pattern for
 * structured data — it ships clean JSON inside <script type="application/ld+json">
 * without React escaping the special characters.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
