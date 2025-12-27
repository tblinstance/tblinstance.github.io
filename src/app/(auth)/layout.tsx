
'use client';

import Link from 'next/link';
import { Zap, Server, Circle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockVpsInstances, type VpsInstance } from '@/lib/types';


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

    const totalInstances = mockVpsInstances.length;
    const runningInstances = mockVpsInstances.filter(vps => vps.status === 'running').length;
    const stoppedInstances = mockVpsInstances.filter(vps => vps.status === 'stopped').length;
    const startingInstances = mockVpsInstances.filter(vps => vps.status === 'starting').length;

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="p-2 bg-primary rounded-lg">
                        <Zap className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold font-sans">AuthFlow</h1>
                </div>
            </div>
          {children}
        </div>
      </div>
      <div className="hidden bg-muted lg:flex flex-col items-center justify-center p-12">
        <div className="w-full max-w-sm">
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
                    <p className="text-xs text-muted-foreground">Log in to manage your instances.</p>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
