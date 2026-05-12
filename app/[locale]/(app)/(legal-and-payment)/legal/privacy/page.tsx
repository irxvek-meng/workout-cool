import { getLocalizedMdx } from "@/shared/lib/mdx/load-mdx";
import { Typography } from "@/components/ui/typography";

type PageProps = {
  params: Promise<{ locale: string }>;
};

// 隐藏协议内容
const hideContent = true;

export default async function PrivacyPolicyPage({ params }: PageProps) {
  const { locale } = await params;
  const content = await getLocalizedMdx("privacy-policy", locale);

  if (hideContent) {
    return <div>Privacy Policy</div>;
  }

  return (
    <div className="bg-muted/50 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <header className="mb-10 text-center">
          <Typography className="mb-2 text-3xl md:text-4xl" variant="h1">
            {locale === "fr" ? "Politique de Confidentialité" : "Privacy Policy"}
          </Typography>
          <p className="text-muted-foreground text-base md:text-lg">
            {locale === "fr"
              ? "Voici comment nous traitons vos données personnelles."
              : "How we handle your personal data at Workout Cool."}
          </p>
        </header>

        <div className="prose prose-neutral max-w-none dark:prose-invert">111{content}</div>
      </div>
    </div>
  );
}
