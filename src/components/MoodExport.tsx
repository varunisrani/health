import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useMoodTracker } from '@/hooks/useMoodTracker';
import { Download, Calendar as CalendarIcon, FileText, BarChart3, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export const MoodExport = () => {
  const {
    moodEntries,
    moodStats,
    exportToCSV,
    exportToPDF,
    getMoodConfig,
  } = useMoodTracker();

  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');
  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  });
  const [isExporting, setIsExporting] = useState(false);

  // Get entries in date range
  const entriesInRange = moodEntries.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    const from = dateRange.from || new Date(0);
    const to = dateRange.to || new Date();
    return entryDate >= from && entryDate <= to;
  });

  const handleExport = async () => {
    if (entriesInRange.length === 0) {
      return;
    }

    setIsExporting(true);
    try {
      if (exportFormat === 'csv') {
        exportToCSV();
      } else {
        exportToPDF();
      }
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange(range);
  };

  // Calculate stats for the selected range
  const rangeStats = React.useMemo(() => {
    if (entriesInRange.length === 0) return null;

    const totalEntries = entriesInRange.length;
    const averageMood = entriesInRange.reduce((sum, entry) => sum + entry.moodLevel, 0) / totalEntries;
    
    const moodDistribution = entriesInRange.reduce((dist, entry) => {
      dist[entry.moodLevel] = (dist[entry.moodLevel] || 0) + 1;
      return dist;
    }, {} as Record<number, number>);

    const entriesWithNotes = entriesInRange.filter(entry => entry.notes && entry.notes.trim()).length;
    const entriesWithActivities = entriesInRange.filter(entry => entry.activities && entry.activities.length > 0).length;

    return {
      totalEntries,
      averageMood,
      moodDistribution,
      entriesWithNotes,
      entriesWithActivities,
    };
  }, [entriesInRange]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-hc-primary">
            <Download className="h-5 w-5 mr-2" />
            Export Mood Data
          </CardTitle>
          <p className="text-gray-600">
            Export your mood tracking data for backup or analysis
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Range Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={handleDateRangeChange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Export Format */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Export Format</label>
              <Select value={exportFormat} onValueChange={(value: 'csv' | 'pdf') => setExportFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">
                    <div className="flex items-center">
                      <Database className="h-4 w-4 mr-2" />
                      CSV (Spreadsheet)
                    </div>
                  </SelectItem>
                  <SelectItem value="pdf">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      PDF (Report)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preview Stats */}
          {rangeStats && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <h4 className="font-medium text-gray-800 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Export Preview
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-hc-primary">{rangeStats.totalEntries}</div>
                  <div className="text-sm text-gray-600">Total Entries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-hc-primary">{rangeStats.averageMood.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Avg Mood</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-hc-primary">{rangeStats.entriesWithNotes}</div>
                  <div className="text-sm text-gray-600">With Notes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-hc-primary">{rangeStats.entriesWithActivities}</div>
                  <div className="text-sm text-gray-600">With Activities</div>
                </div>
              </div>

              {/* Mood Distribution */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Mood Distribution:</h5>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(rangeStats.moodDistribution).map(([level, count]) => {
                    const moodConfig = getMoodConfig(parseInt(level));
                    return (
                      <Badge key={level} variant="secondary" className="bg-hc-tertiary/20 text-hc-primary">
                        {moodConfig?.emoji} {moodConfig?.label}: {count}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Export Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleExport}
              disabled={entriesInRange.length === 0 || isExporting}
              className="bg-hc-primary hover:bg-hc-primary/90 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : `Export ${entriesInRange.length} Entries as ${exportFormat.toUpperCase()}`}
            </Button>
          </div>

          {entriesInRange.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No entries found in the selected date range.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Format Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Database className="h-4 w-4 mr-2" />
              CSV Export
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-600">
              Exports data as a comma-separated values file that can be opened in spreadsheet applications.
            </p>
            <div className="text-xs text-gray-500">
              <strong>Includes:</strong> Date, Mood Level, Emoji, Notes, Activities
            </div>
            <div className="text-xs text-gray-500">
              <strong>Best for:</strong> Data analysis, importing into other tools
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              PDF Export
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-gray-600">
              Exports data as a formatted PDF report with statistics and visualizations.
            </p>
            <div className="text-xs text-gray-500">
              <strong>Includes:</strong> All entry details, statistics, charts
            </div>
            <div className="text-xs text-red-600">
              <strong>Note:</strong> Requires jsPDF library installation
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Exports */}
      {moodStats && moodStats.totalEntries > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-700">Quick Export Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDateRange({
                    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    to: new Date(),
                  });
                }}
              >
                Last 7 Days
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDateRange({
                    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    to: new Date(),
                  });
                }}
              >
                Last 30 Days
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDateRange({
                    from: new Date(moodEntries[moodEntries.length - 1]?.timestamp || 0),
                    to: new Date(),
                  });
                }}
              >
                All Time
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};