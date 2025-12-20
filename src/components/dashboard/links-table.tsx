'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Copy,
  MoreHorizontal,
  BarChart,
  QrCode,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { type LinkData } from './mock-data';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { AnalyticsCharts } from './analytics-charts';
import Image from 'next/image';
import { useLinks } from '../links/links-provider';
import NextLink from 'next/link';

export function LinksTable() {
  const { links } = useLinks();
  const [selectedLink, setSelectedLink] = useState<LinkData | null>(null);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isQrCodeOpen, setIsQrCodeOpen] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'The link has been copied to your clipboard.',
    });
  };

  const handleViewAnalytics = (link: LinkData) => {
    setSelectedLink(link);
    setIsAnalyticsOpen(true);
  };

  const handleViewQrCode = (link: LinkData) => {
    setSelectedLink(link);
    setIsQrCodeOpen(true);
  };

  return (
    <>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Short Link</TableHead>
              <TableHead className="hidden md:table-cell">
                Original URL
              </TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead className="hidden lg:table-cell">Created</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link) => (
              <TableRow key={link.id}>
                <TableCell>
                  <NextLink
                    href={`/${link.shortCode}`}
                    target="_blank"
                    className="font-medium text-primary hover:underline cursor-pointer font-code"
                  >
                    example.com/{link.shortCode}
                  </NextLink>
                </TableCell>
                <TableCell className="hidden md:table-cell max-w-sm truncate">
                  <a
                    href={link.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {link.originalUrl}
                  </a>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {link.clicks.toLocaleString()}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {format(new Date(link.createdAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => handleViewAnalytics(link)}>
                        <BarChart className="mr-2 h-4 w-4" /> Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleViewQrCode(link)}>
                        <QrCode className="mr-2 h-4 w-4" /> View QR Code
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() =>
                          copyToClipboard(`https://example.com/${link.shortCode}`)
                        }
                      >
                        <Copy className="mr-2 h-4 w-4" /> Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isAnalyticsOpen} onOpenChange={setIsAnalyticsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Analytics for example.com/{selectedLink?.shortCode}
            </DialogTitle>
            <DialogDescription>
              Detailed click-through data for your shortened link.
            </DialogDescription>
          </DialogHeader>
          {selectedLink && <AnalyticsCharts link={selectedLink} />}
        </DialogContent>
      </Dialog>

      <Dialog open={isQrCodeOpen} onOpenChange={setIsQrCodeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              QR Code for example.com/{selectedLink?.shortCode}
            </DialogTitle>
            <DialogDescription>
              Scan or download the QR code for your link.
            </DialogDescription>
          </DialogHeader>
          {selectedLink && (
            <div className="flex flex-col items-center gap-4 pt-4">
              <Image
                src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                  `https://example.com/${selectedLink.shortCode}`
                )}&size=250x250&qzone=1`}
                alt="QR Code for shortened link"
                width={250}
                height={250}
                className="rounded-lg border p-1"
              />
              <Button>Download QR Code</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
