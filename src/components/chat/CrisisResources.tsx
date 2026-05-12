import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Globe, MessageCircle, Heart } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface CrisisResourcesProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Hotline {
  name: string;
  phone?: string;
  text?: string;
  website?: string;
  description: string;
}

interface Region {
  name: string;
  flag: string;
  hotlines: Hotline[];
}

const crisisResources: Region[] = [
  {
    name: 'United States',
    flag: '🇺🇸',
    hotlines: [
      {
        name: '988 Suicide & Crisis Lifeline',
        phone: '988',
        text: 'Text 988',
        website: 'https://988lifeline.org',
        description: '24/7 free, confidential support for people in distress',
      },
      {
        name: 'Crisis Text Line',
        text: 'Text HOME to 741741',
        website: 'https://crisistextline.org',
        description: 'Free 24/7 text-based mental health support',
      },
      {
        name: 'SAMHSA National Helpline',
        phone: '1-800-662-4357',
        website: 'https://samhsa.gov/find-help/national-helpline',
        description: 'Free treatment referral and information service',
      },
      {
        name: 'Veterans Crisis Line',
        phone: '988 (Press 1)',
        text: 'Text 838255',
        description: 'Support for veterans and their loved ones',
      },
    ],
  },
  {
    name: 'United Kingdom',
    flag: '🇬🇧',
    hotlines: [
      {
        name: 'Samaritans',
        phone: '116 123',
        website: 'https://samaritans.org',
        description: '24/7 emotional support for anyone in distress',
      },
      {
        name: 'Mind Infoline',
        phone: '0300 123 3393',
        website: 'https://mind.org.uk',
        description: 'Mental health information and support',
      },
      {
        name: 'Shout',
        text: 'Text SHOUT to 85258',
        website: 'https://giveusashout.org',
        description: 'Free 24/7 text support for anyone struggling',
      },
    ],
  },
  {
    name: 'India',
    flag: '🇮🇳',
    hotlines: [
      {
        name: 'iCall',
        phone: '9152987821',
        website: 'https://icallhelpline.org',
        description: 'Psychosocial helpline by TISS',
      },
      {
        name: 'Vandrevala Foundation',
        phone: '1860-2662-345',
        website: 'https://vandrevalafoundation.com',
        description: '24/7 free mental health support',
      },
      {
        name: 'NIMHANS',
        phone: '080-46110007',
        description: 'National Institute of Mental Health helpline',
      },
      {
        name: 'Snehi',
        phone: '044-24640050',
        description: 'Emotional support and suicide prevention',
      },
    ],
  },
  {
    name: 'Canada',
    flag: '🇨🇦',
    hotlines: [
      {
        name: 'Talk Suicide Canada',
        phone: '1-833-456-4566',
        text: 'Text 45645',
        website: 'https://talksuicide.ca',
        description: '24/7 suicide prevention support',
      },
      {
        name: 'Kids Help Phone',
        phone: '1-800-668-6868',
        text: 'Text CONNECT to 686868',
        description: '24/7 support for young people',
      },
    ],
  },
  {
    name: 'Australia',
    flag: '🇦🇺',
    hotlines: [
      {
        name: 'Lifeline Australia',
        phone: '13 11 14',
        text: 'Text 0477 13 11 14',
        website: 'https://lifeline.org.au',
        description: '24/7 crisis support and suicide prevention',
      },
      {
        name: 'Beyond Blue',
        phone: '1300 22 4636',
        website: 'https://beyondblue.org.au',
        description: 'Anxiety, depression, and suicide prevention',
      },
    ],
  },
  {
    name: 'International',
    flag: '🌍',
    hotlines: [
      {
        name: 'International Association for Suicide Prevention',
        website: 'https://www.iasp.info/resources/Crisis_Centres/',
        description: 'Directory of crisis centers worldwide',
      },
      {
        name: 'Befrienders Worldwide',
        website: 'https://befrienders.org/find-a-helpline',
        description: 'Global network of emotional support centers',
      },
    ],
  },
];

export function CrisisResources({ isOpen, onClose }: CrisisResourcesProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Heart className="w-5 h-5 text-destructive" />
            Crisis Resources
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            If you're in immediate danger, please call your local emergency services (911, 999, 112, etc.)
          </p>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] px-6 pb-6">
          <div className="space-y-2">
            <Card className="border-destructive/30 bg-destructive/5 mb-4">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-destructive">
                  🚨 In case of immediate emergency, call your local emergency number
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  US: 911 • UK: 999 • EU: 112 • India: 112 • Australia: 000
                </p>
              </CardContent>
            </Card>

            <Accordion type="single" collapsible className="w-full">
              {crisisResources.map((region) => (
                <AccordionItem key={region.name} value={region.name}>
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-2">
                      <span className="text-xl">{region.flag}</span>
                      <span>{region.name}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      {region.hotlines.map((hotline, idx) => (
                        <Card key={idx} className="border-border/50">
                          <CardHeader className="p-3 pb-1">
                            <CardTitle className="text-sm font-medium">
                              {hotline.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 pt-0">
                            <p className="text-xs text-muted-foreground mb-2">
                              {hotline.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {hotline.phone && (
                                <a
                                  href={`tel:${hotline.phone.replace(/[^0-9+]/g, '')}`}
                                  className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-md hover:bg-primary/20 transition-colors"
                                >
                                  <Phone className="w-3 h-3" />
                                  {hotline.phone}
                                </a>
                              )}
                              {hotline.text && (
                                <span className="inline-flex items-center gap-1 text-xs bg-secondary px-2 py-1 rounded-md">
                                  <MessageCircle className="w-3 h-3" />
                                  {hotline.text}
                                </span>
                              )}
                              {hotline.website && (
                                <a
                                  href={hotline.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-md hover:bg-muted/80 transition-colors"
                                >
                                  <Globe className="w-3 h-3" />
                                  Website
                                </a>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
