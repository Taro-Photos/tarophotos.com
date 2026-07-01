export type JsonLdProps = {
  data: unknown;
  id?: string;
};

export function JsonLd({ data, id }: JsonLdProps) {
  const json = JSON.stringify(data);

  if (!json) {
    return null;
  }

  return <script id={id} type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
