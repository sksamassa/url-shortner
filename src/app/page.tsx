import { ShortenerForm } from '@/components/url-shortener/shortener-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex justify-center items-start pt-10">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">
            Shorten a long URL
          </CardTitle>
          <CardDescription>
            Create a short link for your long URL with advanced analytics and
            customization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ShortenerForm />
        </CardContent>
      </Card>
    </div>
  );
}
