
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Calendar, FileText, Database } from 'lucide-react';
import { toast } from 'sonner';

export const ExportPanel = () => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('all');
  const [includeGroups, setIncludeGroups] = useState(true);
  const [includeIndividual, setIncludeIndividual] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success(`Data exported successfully as ${exportFormat.toUpperCase()}`);
    setIsExporting(false);
  };

  const getMessageCount = () => {
    // Mock calculation based on filters
    let count = 1247;
    if (!includeGroups) count -= 623;
    if (!includeIndividual) count -= 624;
    if (dateRange === 'week') count = Math.floor(count * 0.1);
    if (dateRange === 'month') count = Math.floor(count * 0.4);
    return count;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="format" className="text-white">Export Format</Label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="csv">CSV (Comma Separated)</SelectItem>
                    <SelectItem value="json">JSON (JavaScript Object)</SelectItem>
                    <SelectItem value="txt">TXT (Plain Text)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dateRange" className="text-white">Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {dateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="startDate" className="text-white text-sm">Start Date</Label>
                    <Input 
                      type="date" 
                      id="startDate"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate" className="text-white text-sm">End Date</Label>
                    <Input 
                      type="date" 
                      id="endDate"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-white">Message Types</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="groups"
                      checked={includeGroups}
                      onCheckedChange={setIncludeGroups}
                      className="border-gray-600"
                    />
                    <Label htmlFor="groups" className="text-gray-300">
                      Group Messages
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="individual"
                      checked={includeIndividual}
                      onCheckedChange={setIncludeIndividual}
                      className="border-gray-600"
                    />
                    <Label htmlFor="individual" className="text-gray-300">
                      Individual Messages
                    </Label>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-700 rounded-lg">
                <h4 className="font-medium text-white mb-2">Export Summary</h4>
                <div className="space-y-1 text-sm text-gray-300">
                  <p>Messages to export: <span className="text-white font-medium">{getMessageCount()}</span></p>
                  <p>Format: <span className="text-white font-medium">{exportFormat.toUpperCase()}</span></p>
                  <p>Date range: <span className="text-white font-medium">{dateRange === 'all' ? 'All time' : dateRange}</span></p>
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleExport}
            disabled={isExporting || (!includeGroups && !includeIndividual)}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isExporting ? (
              <>
                <Database className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export {getMessageCount()} Messages
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Export History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'whatsapp-messages-2024-06-05.csv', size: '2.3 MB', date: '2024-06-05 14:30' },
              { name: 'whatsapp-messages-2024-06-04.json', size: '4.1 MB', date: '2024-06-04 09:15' },
              { name: 'whatsapp-messages-2024-06-03.csv', size: '1.8 MB', date: '2024-06-03 16:45' }
            ].map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-white">{file.name}</p>
                  <p className="text-sm text-gray-400">{file.size} • {file.date}</p>
                </div>
                <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-gray-600">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
