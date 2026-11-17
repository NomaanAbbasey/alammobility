import type { ReactNode } from "react";
import { ActionLink, ContentPage, SiteFooter, SiteHeader } from "@alammobility/ui/components";
import { name, links, facts } from "./site-content";

export function InfoPage({ title, intro, children, wide }: { title: string; intro: string; children: ReactNode; wide?: boolean }) {
  return <>
    <SiteHeader name={name} links={links} />
    <ContentPage title={title} intro={intro} wide={wide}>
      {children}
      <ActionLink href="/book">Book a ride</ActionLink>
    </ContentPage>
    <SiteFooter name={name} facts={facts} />
  </>;
}
