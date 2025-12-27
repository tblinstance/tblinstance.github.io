
"use client";

import Link from 'next/link';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
  } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Server, Circle, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { type VpsInstance, mockVpsInstances } from '@/lib/types';


export default function VpsDashboardPage() {
    const totalInstances = mockVpsInstances.length;
    const runningInstances = mockVpsInstances.filter(vps => vps.status === 'running').length;
    const stoppedInstances = mockVpsInstances.filter(vps => vps.status === 'stopped').length;
    const startingInstances = mockVpsInstances.filter(vps => vps.status === 'starting').length;


    return (
      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>VPS System Overview</CardTitle>
            <Server className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInstances} Total Instances</div>
            <p className="text-xs text-muted-foreground">
              Summary of your Contabo VPS infrastructure
            </p>
            <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Circle className="h-3 w-3 fill-green-500 text-green-500" />
                        <span>Running</span>
                    </div>
                    <Badge variant="secondary">{runningInstances}</Badge>
                </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Circle className="h-3 w-3 fill-red-500 text-red-500" />
                        <span>Stopped</span>
                    </div>
                    <Badge variant="secondary">{stoppedInstances}</Badge>
                </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Circle className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span>Starting</span>
                    </div>
                    <Badge variant="secondary">{startingInstances}</Badge>
                </div>
            </div>
          </CardContent>
           <CardFooter>
            <Button asChild className="w-full">
                <Link href="/">
                    Manage All Instances <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
}
