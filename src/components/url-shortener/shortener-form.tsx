'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Image from 'next/image';
import {
  Copy,
  Link,
  Loader2,
  QrCode,
  Sparkles,
  Wand2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getLinkCategories } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '../ui/separator';

const formSchema = z.object({
  longUrl: z.string().url({ message: 'Please enter a valid URL.' }),
  customAlias: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ShortenedResult {
  shortUrl: string;
  qrCodeUrl: string;
}

export function ShortenerForm() {
  const [isPending, startTransition] = useTransition();
  const [isCategorizing, startCategorizingTransition] = useTransition();
  const [categories, setCategories] = useState<string[]>([]);
  const [shortenedResult, setShortenedResult] =
    useState<ShortenedResult | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      longUrl: '',
      customAlias: '',
    },
  });

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue('longUrl', e.target.value);
    const url = e.target.value;
    if (z.string().url().safeParse(url).success) {
      startCategorizingTransition(async () => {
        const result = await getLinkCategories(url);
        if (result.success && result.data) {
          setCategories(result.data);
        } else {
          setCategories([]);
        }
      });
    } else {
      setCategories([]);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'The link has been copied to your clipboard.',
    });
  };

  function onSubmit(values: FormValues) {
    startTransition(() => {
      setShortenedResult(null);
      // Simulate API call
      setTimeout(() => {
        const alias =
          values.customAlias || Math.random().toString(36).substring(2, 8);
        const shortUrl = `linkw.se/${alias}`;
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
          `https://${shortUrl}`
        )}&size=150x150&qzone=1`;

        setShortenedResult({ shortUrl, qrCodeUrl });

        toast({
          title: 'Success!',
          description: 'Your shortened link has been created.',
        });
      }, 1000);
    });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="longUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Long URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/very/long/url/to/shorten"
                    {...field}
                    onChange={handleUrlChange}
                  />
                </FormControl>
                <FormMessage />
                {isCategorizing ? (
                  <div className="flex items-center text-sm text-muted-foreground pt-2">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing URL...
                  </div>
                ) : (
                  categories.length > 0 && (
                    <div className="pt-2">
                      <div className="flex items-center text-sm font-medium mb-2 text-muted-foreground">
                        <Sparkles className="mr-2 h-4 w-4 text-primary" />
                        Suggested Categories
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <Badge
                            key={category}
                            variant="secondary"
                            className="cursor-pointer"
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customAlias"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Alias (Optional)</FormLabel>
                <div className="flex items-center">
                  <span className="inline-flex items-center h-10 px-3 rounded-l-md border border-r-0 bg-muted text-muted-foreground text-sm">
                    linkw.se/
                  </span>
                  <FormControl>
                    <Input
                      placeholder="my-awesome-link"
                      {...field}
                      className="rounded-l-none font-code"
                    />
                  </FormControl>
                </div>
                <FormDescription>
                  Customize your short link for better branding.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isPending || isCategorizing}
            className="w-full"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Shorten Link
          </Button>
        </form>
      </Form>

      {shortenedResult && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Link is Ready!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-md">
              <Link className="h-5 w-5 text-primary" />
              <span className="font-code text-primary font-semibold flex-1 mx-4 truncate">
                {shortenedResult.shortUrl}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  copyToClipboard(`https://${shortenedResult.shortUrl}`)
                }
              >
                <Copy className="h-5 w-5" />
              </Button>
            </div>
            <Separator />
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                <QrCode className="h-5 w-5 text-muted-foreground mb-2" />
                <Image
                  src={shortenedResult.qrCodeUrl}
                  alt="QR Code for shortened link"
                  width={150}
                  height={150}
                  className="rounded-md border p-1"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold text-foreground mb-2">QR Code</p>
                <p>
                  Share this QR code to direct users to your link. It's perfect
                  for print materials, presentations, and events.
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Download QR
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
