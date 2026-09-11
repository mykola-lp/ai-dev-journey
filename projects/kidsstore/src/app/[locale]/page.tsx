import About from "@/components/About";
import Categories from "@/components/Categories";
import ContactForm from "@/components/ContactForm";
import Hero from "@/components/Hero";
import TrustSignals from "@/components/TrustSignals";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";

export default async function HomePage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <>
      <Hero dict={dict} />
      <Categories dict={dict} />
      <About dict={dict} />
      <TrustSignals dict={dict} />
      <ContactForm locale={locale} dict={dict} />
    </>
  );
}
