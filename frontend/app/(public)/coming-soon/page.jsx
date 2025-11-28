'use client';

import { useEffect, useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export default function ComingSoonPage() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Mark as mounted to prevent hydration mismatch
    setMounted(true);

    // Set target date (example: 30 days from now)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleNotifyMe = (e) => {
    e.preventDefault();
    // TODO: Implement notification subscription
    alert('Thank you! We will notify you when we launch.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-4xl w-full space-y-8 text-center">
        {/* Logo/Brand */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Binirman BD
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            We&apos;re Coming Soon
          </p>
        </div>

        {/* Countdown Timer */}
        <Card className="border-2">
          <CardContent className="p-6 md:p-8">
            {mounted ? (
              <div className="flex items-center justify-center gap-4 md:gap-8">
                <div className="text-center">
                  <div className="text-3xl md:text-5xl font-bold text-primary">
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground mt-1">
                    Days
                  </div>
                </div>
                <div className="text-2xl md:text-4xl text-muted-foreground">:</div>
                <div className="text-center">
                  <div className="text-3xl md:text-5xl font-bold text-primary">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground mt-1">
                    Hours
                  </div>
                </div>
                <div className="text-2xl md:text-4xl text-muted-foreground">:</div>
                <div className="text-center">
                  <div className="text-3xl md:text-5xl font-bold text-primary">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground mt-1">
                    Minutes
                  </div>
                </div>
                <div className="text-2xl md:text-4xl text-muted-foreground">:</div>
                <div className="text-center">
                  <div className="text-3xl md:text-5xl font-bold text-primary">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground mt-1">
                    Seconds
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4 md:gap-8">
                <div className="text-center">
                  <div className="text-3xl md:text-5xl font-bold text-primary">00</div>
                  <div className="text-sm md:text-base text-muted-foreground mt-1">Days</div>
                </div>
                <div className="text-2xl md:text-4xl text-muted-foreground">:</div>
                <div className="text-center">
                  <div className="text-3xl md:text-5xl font-bold text-primary">00</div>
                  <div className="text-sm md:text-base text-muted-foreground mt-1">Hours</div>
                </div>
                <div className="text-2xl md:text-4xl text-muted-foreground">:</div>
                <div className="text-center">
                  <div className="text-3xl md:text-5xl font-bold text-primary">00</div>
                  <div className="text-sm md:text-base text-muted-foreground mt-1">Minutes</div>
                </div>
                <div className="text-2xl md:text-4xl text-muted-foreground">:</div>
                <div className="text-center">
                  <div className="text-3xl md:text-5xl font-bold text-primary">00</div>
                  <div className="text-sm md:text-base text-muted-foreground mt-1">Seconds</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <p className="text-lg text-foreground/80">
            We&apos;re working hard to bring you an amazing experience. Stay tuned
            for updates!
          </p>
        </div>

        {/* Notify Me Form */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleNotifyMe} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="flex-1"
                />
                <Button type="submit" className="whitespace-nowrap">
                  Notify Me
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Mail className="size-4" />
            <span className="text-sm">info@binirmanbd.com</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Phone className="size-4" />
            <span className="text-sm">+880 XXX XXX XXXX</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="size-4" />
            <span className="text-sm">Dhaka, Bangladesh</span>
          </div>
        </div>
      </div>
    </div>
  );
}

