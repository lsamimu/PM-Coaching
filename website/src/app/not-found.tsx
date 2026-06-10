import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-7xl">🚀</p>
      <h1 className="mt-6 text-4xl font-extrabold text-charcoal">
        Lost in space
      </h1>
      <p className="mt-3 max-w-md text-charcoal-soft">
        This page didn&apos;t make it to launch. Let&apos;s get you back on
        track.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href="/">Back home</Button>
        <Button href="/pm-roles" variant="ghost">
          Browse PM jobs
        </Button>
      </div>
    </Container>
  );
}
