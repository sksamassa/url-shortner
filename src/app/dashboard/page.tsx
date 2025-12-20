import { LinksTable } from '@/components/dashboard/links-table';
import { Button } from '@/components/ui/button';
import { Download, PlusCircle } from 'lucide-react';
import NextLink from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">My Links</h1>
          <p className="text-muted-foreground">
            Manage and analyze your shortened links.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <NextLink href="/">
              <PlusCircle className="mr-2" />
              Create New Link
            </NextLink>
          </Button>
          <Button variant="outline">
            <Download className="mr-2" />
            Export All
          </Button>
        </div>
      </div>
      <LinksTable />
    </div>
  );
}
