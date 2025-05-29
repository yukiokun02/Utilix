import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import BackgroundShapes from "@/components/background-shapes";
import { ArrowLeftIcon, MailIcon, RefreshCwIcon, CopyIcon, ClockIcon, InboxIcon } from "lucide-react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { TempEmail, TempEmailMessage } from "@shared/schema";

export default function TempEmail() {
  const [currentEmail, setCurrentEmail] = useState<TempEmail | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: messages, isLoading: messagesLoading, refetch: refetchMessages } = useQuery({
    queryKey: ['/api/temp-email', currentEmail?.email, 'messages'],
    enabled: !!currentEmail?.email,
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  });

  const refreshInbox = () => {
    if (currentEmail) {
      refetchMessages();
      toast({
        title: "Inbox refreshed",
        description: "Checking for new messages..."
      });
    }
  };

  const generateEmailMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/temp-email/generate');
      return response.json();
    },
    onSuccess: (data: TempEmail) => {
      setCurrentEmail(data);
      queryClient.invalidateQueries({ queryKey: ['/api/temp-email'] });
      toast({
        title: "New email generated",
        description: `Your temporary email: ${data.email}`
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate temporary email",
        variant: "destructive"
      });
    }
  });

  const deleteEmailMutation = useMutation({
    mutationFn: async (email: string) => {
      await apiRequest('DELETE', `/api/temp-email/${email}`);
    },
    onSuccess: () => {
      setCurrentEmail(null);
      queryClient.invalidateQueries({ queryKey: ['/api/temp-email'] });
      toast({
        title: "Email deleted",
        description: "Temporary email has been deleted"
      });
    }
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Email address copied successfully"
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diffMs = new Date(expiresAt).getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours <= 0) return 'Expired';
    if (diffHours < 24) return `${diffHours}h remaining`;
    return `${Math.floor(diffHours / 24)}d remaining`;
  };

  return (
    <div className="min-h-screen pt-20 relative">
      <BackgroundShapes />
      
      {/* ==================== TOP AD AREA - START ==================== */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="mb-6 flex justify-center">
          <div className="w-full max-w-4xl">
            <AdsterraAdMobile />
            <AdsterraAdDesktop />
          </div>
        </div>
      </div>
      {/* ==================== TOP AD AREA - END ==================== */}
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Temporary Email
              </span>
            </h1>
            <p className="text-muted-foreground">Generate temporary email addresses with inbox</p>
          </div>
          <Link href="/">
            <Button variant="outline" size="icon" className="w-10 h-10 rounded-lg">
              <ArrowLeftIcon className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Email Generator */}
          <Card className="solid-card">
            <CardHeader>
              <CardTitle className="text-foreground">Your Temporary Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentEmail ? (
                <div className="bg-background border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-400 font-mono text-sm break-all">{currentEmail.email}</span>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard(currentEmail.email)}
                    >
                      <CopyIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <ClockIcon className="w-3 h-3 mr-1" />
                    {getTimeRemaining(currentEmail.expiresAt)}
                  </p>
                </div>
              ) : (
                <div className="bg-background border border-border rounded-lg p-4 text-center">
                  <MailIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No active email address</p>
                </div>
              )}
              
              <div className="flex space-x-3">
                <Button 
                  onClick={() => generateEmailMutation.mutate()}
                  disabled={generateEmailMutation.isPending}
                  className="flex-1 pill-button bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                >
                  <RefreshCwIcon className="w-4 h-4 mr-2" />
                  {generateEmailMutation.isPending ? "Generating..." : "Generate New"}
                </Button>
                {currentEmail && (
                  <Button 
                    variant="outline"
                    onClick={() => deleteEmailMutation.mutate(currentEmail.email)}
                    disabled={deleteEmailMutation.isPending}
                    className="pill-button"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Email Stats */}
          <Card className="solid-card">
            <CardHeader>
              <CardTitle className="text-foreground">Inbox Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {Array.isArray(messages) ? messages.length : 0}
                  </div>
                  <div className="text-muted-foreground text-sm">Messages</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">
                    {currentEmail ? getTimeRemaining(currentEmail.expiresAt) : 'N/A'}
                  </div>
                  <div className="text-muted-foreground text-sm">Valid For</div>
                </div>
              </div>
              
              {currentEmail && (
                <div className="mt-4 p-3 bg-background rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    Created: {new Date(currentEmail.createdAt).toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Inbox */}
        <Card className="solid-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Inbox</CardTitle>
              {currentEmail && (
                <Button 
                  onClick={refreshInbox}
                  size="sm"
                  variant="outline"
                  className="pill-button"
                >
                  <InboxIcon className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!currentEmail ? (
              <div className="text-center py-8">
                <MailIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Generate an email address to start receiving messages</p>
              </div>
            ) : messagesLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-background border border-border rounded-lg p-4 animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : Array.isArray(messages) && messages.length > 0 ? (
              <div className="space-y-3">
                {messages.map((message: TempEmailMessage) => (
                  <div key={message.id} className="bg-background border border-border rounded-lg p-4 hover:bg-muted/20 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{message.subject}</div>
                        <div className="text-muted-foreground text-sm">{message.fromEmail}</div>
                        <div className="text-muted-foreground text-sm mt-1 line-clamp-2">
                          {message.content.substring(0, 100)}...
                        </div>
                      </div>
                      <div className="text-muted-foreground text-sm ml-4">
                        {formatTimeAgo(message.receivedAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MailIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No messages yet</p>
                <p className="text-muted-foreground text-sm mt-2">
                  Messages will appear here automatically when received
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Info */}
        <Card className="mt-8 solid-card">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <ClockIcon className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">24 Hour Validity</h4>
                <p className="text-sm text-muted-foreground">
                  Each email address is valid for 24 hours from creation
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MailIcon className="w-6 h-6 text-emerald-400" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Instant Delivery</h4>
                <p className="text-sm text-muted-foreground">
                  Messages appear in your inbox within seconds
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <RefreshCwIcon className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Auto Refresh</h4>
                <p className="text-sm text-muted-foreground">
                  Inbox updates automatically every 5 seconds
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
