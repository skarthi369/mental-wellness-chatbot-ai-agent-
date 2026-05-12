import { MentalHealthReport } from '@/types/chat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EmotionBadge } from './EmotionBadge';
import { RiskIndicator } from './RiskIndicator';
import { 
  FileText, 
  Brain, 
  Shield, 
  Lightbulb, 
  Download,
  X,
  AlertCircle
} from 'lucide-react';
import { generateSessionPDF } from '@/services/pdfService';
import { cn } from '@/lib/utils';

interface ReportPanelProps {
  report: MentalHealthReport | undefined;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportPanel({ report, isOpen, onClose }: ReportPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-background border-l border-border shadow-soft-lg z-50 animate-slide-in">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Mental Health Report</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {!report ? (
              <div className="text-center py-12">
                <Brain className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Share a few messages to generate your wellness report
                </p>
              </div>
            ) : (
              <>
                 {/* Disclaimer */}
                <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold">Mode: {report.modeUsed}</p>
                    <p className="text-xs text-muted-foreground">
                      This report is for informational purposes only and is not a medical diagnosis.
                    </p>
                  </div>
                </div>

                {/* Session Summary */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      Session Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {report.sessionSummary}
                    </p>
                  </CardContent>
                </Card>

                {/* Emotions Section */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Brain className="w-4 h-4 text-primary" />
                      Emotional Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <EmotionBadge emotion={report.emotions.primary} />
                      <span className="text-xs text-muted-foreground capitalize">{report.emotions.primary}</span>
                    </div>
                    <div className="pt-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Confidence</span>
                        <span className="font-medium">{Math.round(report.emotions.confidence * 100)}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${report.emotions.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Assessment */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      Risk & Severity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RiskIndicator 
                      level={report.emotions.riskLevel || report.risk.level} 
                      score={report.emotions.severityScore || report.risk.score}
                      showDetails
                    />
                  </CardContent>
                </Card>

                {/* Interventions Section */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-primary" />
                      Interventions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {report.interventions.map((item, i) => (
                        <li 
                          key={i}
                          className="text-sm flex items-center gap-2 p-2 bg-muted/50 rounded-lg"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-primary" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {report.recommendations.map((rec, i) => (
                        <li 
                          key={i}
                          className="text-sm flex items-start gap-2"
                        >
                          <span className="text-primary mt-0.5">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Download Button */}
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 shadow-lg shadow-primary/20" 
                  onClick={() => generateSessionPDF(report)}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Professional PDF Report
                </Button>

                <p className="text-[10px] text-center text-muted-foreground italic">
                  PDF includes session timestamp, mode, emotional analysis, and recommendations.
                </p>
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
