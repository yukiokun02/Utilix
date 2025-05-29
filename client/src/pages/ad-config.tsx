import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BackgroundShapes from "@/components/background-shapes";
import AdsterraAdMobile from "@/components/AdsterraAdMobile";
import AdsterraAdDesktop from "@/components/AdsterraAdDesktop";
import { ArrowLeftIcon, SettingsIcon, EyeIcon, SaveIcon, MonitorIcon, SmartphoneIcon, CopyIcon, CheckIcon, AlertCircleIcon } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface AdConfig {
  enabled: boolean;
  adKey: string;
  width: number;
  height: number;
  customCode: string;
}

interface AdPlacements {
  mobile: AdConfig;
  desktop: AdConfig;
}

interface PageAdConfig {
  topAd: AdPlacements;
  middleAd: AdPlacements;
  bottomAd: AdPlacements;
  sidebarAd: AdPlacements;
}

const DEFAULT_AD_CONFIG: AdConfig = {
  enabled: true,
  adKey: "9713846a01389bccb7945a5638e800ae",
  width: 320,
  height: 50,
  customCode: ""
};

const DEFAULT_DESKTOP_CONFIG: AdConfig = {
  enabled: true,
  adKey: "9713846a01389bccb7945a5638e800ae", 
  width: 728,
  height: 90,
  customCode: ""
};

const PAGES = [
  { id: 'home', name: 'Homepage', hasMiddle: true, hasSidebar: false },
  { id: 'image-resizer', name: 'Image Resizer', hasMiddle: true, hasSidebar: true },
  { id: 'color-picker', name: 'Color Picker', hasMiddle: true, hasSidebar: false },
  { id: 'file-converter', name: 'File Converter', hasMiddle: true, hasSidebar: false },
  { id: 'file-compressor', name: 'File Compressor', hasMiddle: true, hasSidebar: false },
  { id: 'font-changer', name: 'Font Changer', hasMiddle: true, hasSidebar: false },
  { id: 'code-notepad', name: 'Code Notepad', hasMiddle: true, hasSidebar: false },
  { id: 'image-converter', name: 'Image Converter', hasMiddle: true, hasSidebar: false },
  { id: 'temp-email', name: 'Temp Email', hasMiddle: false, hasSidebar: false },
  { id: 'about', name: 'About', hasMiddle: false, hasSidebar: false },
  { id: 'terms', name: 'Terms', hasMiddle: false, hasSidebar: false },
  { id: 'privacy', name: 'Privacy', hasMiddle: false, hasSidebar: false },
];

export default function AdConfig() {
  const [selectedPage, setSelectedPage] = useState('home');
  const [adConfigs, setAdConfigs] = useState<Record<string, PageAdConfig>>({});
  const [previewMode, setPreviewMode] = useState(false);
  const [globalAdKey, setGlobalAdKey] = useState("9713846a01389bccb7945a5638e800ae");
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const currentPage = PAGES.find(p => p.id === selectedPage);
  const currentConfig = adConfigs[selectedPage] || {
    topAd: { mobile: DEFAULT_AD_CONFIG, desktop: DEFAULT_DESKTOP_CONFIG },
    middleAd: { mobile: DEFAULT_AD_CONFIG, desktop: DEFAULT_DESKTOP_CONFIG },
    bottomAd: { mobile: DEFAULT_AD_CONFIG, desktop: DEFAULT_DESKTOP_CONFIG },
    sidebarAd: { mobile: DEFAULT_AD_CONFIG, desktop: DEFAULT_DESKTOP_CONFIG },
  };

  const updateAdConfig = (position: keyof PageAdConfig, device: 'mobile' | 'desktop', updates: Partial<AdConfig>) => {
    setAdConfigs(prev => ({
      ...prev,
      [selectedPage]: {
        ...currentConfig,
        [position]: {
          ...currentConfig[position],
          [device]: {
            ...currentConfig[position][device],
            ...updates
          }
        }
      }
    }));
  };

  const applyGlobalAdKey = () => {
    const updatedConfigs = { ...adConfigs };
    
    PAGES.forEach(page => {
      updatedConfigs[page.id] = {
        topAd: {
          mobile: { ...DEFAULT_AD_CONFIG, adKey: globalAdKey },
          desktop: { ...DEFAULT_DESKTOP_CONFIG, adKey: globalAdKey }
        },
        middleAd: {
          mobile: { ...DEFAULT_AD_CONFIG, adKey: globalAdKey },
          desktop: { ...DEFAULT_DESKTOP_CONFIG, adKey: globalAdKey }
        },
        bottomAd: {
          mobile: { ...DEFAULT_AD_CONFIG, adKey: globalAdKey },
          desktop: { ...DEFAULT_DESKTOP_CONFIG, adKey: globalAdKey }
        },
        sidebarAd: {
          mobile: { ...DEFAULT_AD_CONFIG, adKey: globalAdKey },
          desktop: { ...DEFAULT_DESKTOP_CONFIG, adKey: globalAdKey }
        }
      };
    });

    setAdConfigs(updatedConfigs);
    toast({
      title: "Applied Global Settings",
      description: `Ad key ${globalAdKey} applied to all pages`
    });
  };

  const generateAdCode = (config: AdConfig, device: 'mobile' | 'desktop') => {
    if (config.customCode) {
      return config.customCode;
    }

    return `<script type="text/javascript">
  atOptions = {
    'key': '${config.adKey}',
    'format': 'iframe',
    'height': ${config.height},
    'width': ${config.width},
    'params': {}
  };
</script>
<script type="text/javascript" src="//www.highperformanceformat.com/${config.adKey}/invoke.js"></script>`;
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const exportConfiguration = () => {
    const configData = JSON.stringify(adConfigs, null, 2);
    const blob = new Blob([configData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'utilitix-ad-config.json';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Configuration Exported",
      description: "Ad configuration downloaded as JSON file"
    });
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
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Ad Placement Wizard
              </span>
            </h1>
            <p className="text-gray-300 font-medium">Configure and manage ad placements across your entire website</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2"
            >
              <EyeIcon className="w-4 h-4" />
              {previewMode ? 'Edit Mode' : 'Preview Mode'}
            </Button>
            <Link href="/">
              <Button variant="outline" size="icon" className="w-10 h-10 rounded-lg">
                <ArrowLeftIcon className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Page Selector */}
          <div className="lg:col-span-1">
            <Card className="solid-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  Pages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {PAGES.map((page) => (
                  <Button
                    key={page.id}
                    variant={selectedPage === page.id ? "default" : "ghost"}
                    className="w-full justify-start text-left"
                    onClick={() => setSelectedPage(page.id)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{page.name}</span>
                      <div className="flex gap-1">
                        {page.hasMiddle && <Badge variant="secondary" className="text-xs">M</Badge>}
                        {page.hasSidebar && <Badge variant="secondary" className="text-xs">S</Badge>}
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Global Settings */}
            <Card className="solid-card mt-4">
              <CardHeader>
                <CardTitle className="text-foreground text-sm">Global Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="globalAdKey" className="text-sm">Default Ad Key</Label>
                  <Input
                    id="globalAdKey"
                    value={globalAdKey}
                    onChange={(e) => setGlobalAdKey(e.target.value)}
                    placeholder="Enter ad key"
                    className="text-sm"
                  />
                </div>
                <Button 
                  onClick={applyGlobalAdKey}
                  className="w-full text-sm"
                  size="sm"
                >
                  Apply to All Pages
                </Button>
                <Button 
                  onClick={exportConfiguration}
                  variant="outline"
                  className="w-full text-sm"
                  size="sm"
                >
                  Export Config
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Configuration Panel */}
          <div className="lg:col-span-3">
            <Card className="solid-card">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Configure: {currentPage?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="top" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="top">Top Ad</TabsTrigger>
                    <TabsTrigger value="middle" disabled={!currentPage?.hasMiddle}>
                      Middle Ad
                    </TabsTrigger>
                    <TabsTrigger value="bottom">Bottom Ad</TabsTrigger>
                    <TabsTrigger value="sidebar" disabled={!currentPage?.hasSidebar}>
                      Sidebar Ad
                    </TabsTrigger>
                  </TabsList>

                  {(['top', 'middle', 'bottom', 'sidebar'] as const).map((position) => (
                    <TabsContent key={position} value={position} className="mt-4">
                      {((position === 'middle' && !currentPage?.hasMiddle) || 
                        (position === 'sidebar' && !currentPage?.hasSidebar)) ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <AlertCircleIcon className="w-8 h-8 mx-auto mb-2" />
                          <p>This ad position is not available for {currentPage?.name}</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* Mobile Configuration */}
                          <Card className="border-l-4 border-l-blue-500">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm flex items-center gap-2">
                                <SmartphoneIcon className="w-4 h-4" />
                                Mobile Ad Configuration
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Label htmlFor={`${position}-mobile-enabled`}>Enabled</Label>
                                <Switch
                                  id={`${position}-mobile-enabled`}
                                  checked={currentConfig[`${position}Ad`].mobile.enabled}
                                  onCheckedChange={(checked) => 
                                    updateAdConfig(`${position}Ad`, 'mobile', { enabled: checked })
                                  }
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor={`${position}-mobile-key`}>Ad Key</Label>
                                  <Input
                                    id={`${position}-mobile-key`}
                                    value={currentConfig[`${position}Ad`].mobile.adKey}
                                    onChange={(e) => 
                                      updateAdConfig(`${position}Ad`, 'mobile', { adKey: e.target.value })
                                    }
                                    placeholder="Ad key"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <Label htmlFor={`${position}-mobile-width`}>Width</Label>
                                    <Input
                                      id={`${position}-mobile-width`}
                                      type="number"
                                      value={currentConfig[`${position}Ad`].mobile.width}
                                      onChange={(e) => 
                                        updateAdConfig(`${position}Ad`, 'mobile', { width: parseInt(e.target.value) })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`${position}-mobile-height`}>Height</Label>
                                    <Input
                                      id={`${position}-mobile-height`}
                                      type="number"
                                      value={currentConfig[`${position}Ad`].mobile.height}
                                      onChange={(e) => 
                                        updateAdConfig(`${position}Ad`, 'mobile', { height: parseInt(e.target.value) })
                                      }
                                    />
                                  </div>
                                </div>
                              </div>

                              <div>
                                <Label htmlFor={`${position}-mobile-custom`}>Custom Ad Code (Optional)</Label>
                                <Textarea
                                  id={`${position}-mobile-custom`}
                                  value={currentConfig[`${position}Ad`].mobile.customCode}
                                  onChange={(e) => 
                                    updateAdConfig(`${position}Ad`, 'mobile', { customCode: e.target.value })
                                  }
                                  placeholder="Paste your custom ad code here..."
                                  rows={3}
                                />
                              </div>

                              <div className="bg-gray-900 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <Label className="text-xs">Generated Code:</Label>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => copyToClipboard(
                                      generateAdCode(currentConfig[`${position}Ad`].mobile, 'mobile'),
                                      `${position} mobile code`
                                    )}
                                    className="text-xs"
                                  >
                                    {copied === `${position} mobile code` ? (
                                      <CheckIcon className="w-3 h-3" />
                                    ) : (
                                      <CopyIcon className="w-3 h-3" />
                                    )}
                                  </Button>
                                </div>
                                <pre className="text-xs text-green-400 overflow-x-auto">
                                  {generateAdCode(currentConfig[`${position}Ad`].mobile, 'mobile')}
                                </pre>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Desktop Configuration */}
                          <Card className="border-l-4 border-l-purple-500">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm flex items-center gap-2">
                                <MonitorIcon className="w-4 h-4" />
                                Desktop Ad Configuration
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Label htmlFor={`${position}-desktop-enabled`}>Enabled</Label>
                                <Switch
                                  id={`${position}-desktop-enabled`}
                                  checked={currentConfig[`${position}Ad`].desktop.enabled}
                                  onCheckedChange={(checked) => 
                                    updateAdConfig(`${position}Ad`, 'desktop', { enabled: checked })
                                  }
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor={`${position}-desktop-key`}>Ad Key</Label>
                                  <Input
                                    id={`${position}-desktop-key`}
                                    value={currentConfig[`${position}Ad`].desktop.adKey}
                                    onChange={(e) => 
                                      updateAdConfig(`${position}Ad`, 'desktop', { adKey: e.target.value })
                                    }
                                    placeholder="Ad key"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <Label htmlFor={`${position}-desktop-width`}>Width</Label>
                                    <Input
                                      id={`${position}-desktop-width`}
                                      type="number"
                                      value={currentConfig[`${position}Ad`].desktop.width}
                                      onChange={(e) => 
                                        updateAdConfig(`${position}Ad`, 'desktop', { width: parseInt(e.target.value) })
                                      }
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`${position}-desktop-height`}>Height</Label>
                                    <Input
                                      id={`${position}-desktop-height`}
                                      type="number"
                                      value={currentConfig[`${position}Ad`].desktop.height}
                                      onChange={(e) => 
                                        updateAdConfig(`${position}Ad`, 'desktop', { height: parseInt(e.target.value) })
                                      }
                                    />
                                  </div>
                                </div>
                              </div>

                              <div>
                                <Label htmlFor={`${position}-desktop-custom`}>Custom Ad Code (Optional)</Label>
                                <Textarea
                                  id={`${position}-desktop-custom`}
                                  value={currentConfig[`${position}Ad`].desktop.customCode}
                                  onChange={(e) => 
                                    updateAdConfig(`${position}Ad`, 'desktop', { customCode: e.target.value })
                                  }
                                  placeholder="Paste your custom ad code here..."
                                  rows={3}
                                />
                              </div>

                              <div className="bg-gray-900 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <Label className="text-xs">Generated Code:</Label>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => copyToClipboard(
                                      generateAdCode(currentConfig[`${position}Ad`].desktop, 'desktop'),
                                      `${position} desktop code`
                                    )}
                                    className="text-xs"
                                  >
                                    {copied === `${position} desktop code` ? (
                                      <CheckIcon className="w-3 h-3" />
                                    ) : (
                                      <CopyIcon className="w-3 h-3" />
                                    )}
                                  </Button>
                                </div>
                                <pre className="text-xs text-green-400 overflow-x-auto">
                                  {generateAdCode(currentConfig[`${position}Ad`].desktop, 'desktop')}
                                </pre>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ==================== BOTTOM AD AREA - START ==================== */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 mt-8">
          <div className="mb-6 flex justify-center">
            <div className="w-full max-w-4xl">
              <AdsterraAdMobile />
              <AdsterraAdDesktop />
            </div>
          </div>
        </div>
        {/* ==================== BOTTOM AD AREA - END ==================== */}
      </div>
    </div>
  );
}