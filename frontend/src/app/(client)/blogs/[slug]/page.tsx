import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return <div>Single Blog {slug}</div>;
}