'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { AdBlock } from './AdBlock'
import type { GeneratedOutput, Channel } from '@/types'

interface OutputPanelProps {
  output: GeneratedOutput
  channels: Channel[]
}

export function OutputPanel({ output, channels }: OutputPanelProps) {
  const firstChannel = channels[0]

  return (
    <Tabs defaultTab={firstChannel}>
      <TabsList className="mb-4">
        {channels.includes('social') && <TabsTrigger value="social">Social</TabsTrigger>}
        {channels.includes('google') && <TabsTrigger value="google">Google</TabsTrigger>}
        {channels.includes('email') && <TabsTrigger value="email">Email</TabsTrigger>}
      </TabsList>

      {output.social && (
        <TabsContent value="social">
          <div className="flex flex-col gap-3">
            <AdBlock label="Facebook Headline" value={output.social.facebook_headline} />
            <AdBlock label="Facebook Body" value={output.social.facebook_body} multiline />
            <AdBlock label="Instagram Caption" value={output.social.instagram_caption} multiline />
            <AdBlock label="X (Twitter) Post" value={output.social.x_post} />
          </div>
        </TabsContent>
      )}

      {output.google && (
        <TabsContent value="google">
          <div className="flex flex-col gap-3">
            <AdBlock label="Headline 1" value={output.google.headline1} maxLength={30} />
            <AdBlock label="Headline 2" value={output.google.headline2} maxLength={30} />
            <AdBlock label="Headline 3" value={output.google.headline3} maxLength={30} />
            <AdBlock label="Description 1" value={output.google.description1} maxLength={90} />
            <AdBlock label="Description 2" value={output.google.description2} maxLength={90} />
          </div>
        </TabsContent>
      )}

      {output.email && (
        <TabsContent value="email">
          <div className="flex flex-col gap-3">
            <AdBlock label="Subject Line" value={output.email.subject_line} />
            <AdBlock label="Preview Text" value={output.email.preview_text} />
            <AdBlock label="Email Body" value={output.email.body} multiline />
          </div>
        </TabsContent>
      )}
    </Tabs>
  )
}
