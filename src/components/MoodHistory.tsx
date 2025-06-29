import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useMoodTracker } from '@/hooks/useMoodTracker';
import { Search, Filter, Calendar as CalendarIcon, Trash2, Edit3, MessageSquare, Activity, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export const MoodHistory = () => {
  const {
    moodEntries,
    filter,
    setFilter,
    getMoodConfig,
    deleteMoodEntry,
    MOOD_LEVELS,
  } = useMoodTracker();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});

  // Filter entries based on search and filters
  const filteredEntries = moodEntries.filter(entry => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesNotes = entry.notes?.toLowerCase().includes(searchLower) || false;
      const matchesActivities = entry.activities?.some(activity => 
        activity.toLowerCase().includes(searchLower)
      ) || false;
      const moodConfig = getMoodConfig(entry.moodLevel);
      const matchesMoodLabel = moodConfig?.label.toLowerCase().includes(searchLower) || false;
      
      if (!matchesNotes && !matchesActivities && !matchesMoodLabel) {
        return false;
      }
    }

    return true;
  });

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setSelectedDateRange(range);
    if (range.from || range.to) {
      setFilter({
        ...filter,
        dateRange: {
          start: range.from || new Date(0),
          end: range.to || new Date(),
        },
      });
    }
  };

  const handleMoodLevelFilter = (level: string) => {
    if (level === 'all') {
      const { moodLevels, ...restFilter } = filter;
      setFilter(restFilter);
    } else {
      setFilter({
        ...filter,
        moodLevels: [parseInt(level)],
      });
    }
  };

  const handleNotesFilter = (hasNotes: string) => {
    if (hasNotes === 'all') {
      const { hasNotes: _, ...restFilter } = filter;
      setFilter(restFilter);
    } else {
      setFilter({
        ...filter,
        hasNotes: hasNotes === 'true',
      });
    }
  };

  const clearFilters = () => {
    setFilter({
      dateRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
    });
    setSelectedDateRange({});
    setSearchTerm('');
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      await deleteMoodEntry(entryId);
    } catch (error) {
      console.error('Error deleting mood entry:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-hc-primary">Mood History</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by notes, activities, or mood..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Date Range Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Date Range</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDateRange.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDateRange.from ? (
                          selectedDateRange.to ? (
                            <>
                              {format(selectedDateRange.from, "LLL dd, y")} -{" "}
                              {format(selectedDateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(selectedDateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={selectedDateRange.from}
                        selected={selectedDateRange}
                        onSelect={handleDateRangeChange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Mood Level Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Mood Level</label>
                  <Select onValueChange={handleMoodLevelFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All moods" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Moods</SelectItem>
                      {MOOD_LEVELS.map((mood) => (
                        <SelectItem key={mood.level} value={mood.level.toString()}>
                          {mood.emoji} {mood.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Notes Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Notes</label>
                  <Select onValueChange={handleNotesFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All entries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Entries</SelectItem>
                      <SelectItem value="true">With Notes</SelectItem>
                      <SelectItem value="false">Without Notes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {filteredEntries.length} of {moodEntries.length} entries
        </span>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No entries found</h3>
              <p className="text-gray-600">
                {searchTerm || showFilters
                  ? "Try adjusting your search or filters"
                  : "Start tracking your mood to see entries here"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredEntries
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .map((entry) => {
              const moodConfig = getMoodConfig(entry.moodLevel);
              return (
                <Card key={entry.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Mood Emoji */}
                        <div className="text-4xl">{entry.emoji}</div>
                        
                        {/* Entry Details */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center space-x-3">
                            <Badge variant="secondary" className="bg-hc-tertiary/20 text-hc-primary">
                              {moodConfig?.label} ({entry.moodLevel}/5)
                            </Badge>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              {format(new Date(entry.timestamp), "PPpp")}
                            </div>
                          </div>

                          {/* Notes */}
                          {entry.notes && (
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-700">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Notes
                              </div>
                              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                                {entry.notes}
                              </p>
                            </div>
                          )}

                          {/* Activities */}
                          {entry.activities && entry.activities.length > 0 && (
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-gray-700">
                                <Activity className="h-4 w-4 mr-1" />
                                Activities
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {entry.activities.map((activity, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="bg-hc-accent/10 text-hc-accent border-hc-accent/20"
                                  >
                                    {activity}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Reflection Prompts */}
                          {entry.reflectionPrompts && entry.reflectionPrompts.length > 0 && (
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-gray-700">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Reflection Prompts
                              </div>
                              <div className="space-y-1">
                                {entry.reflectionPrompts.map((prompt, index) => (
                                  <p key={index} className="text-sm text-gray-600 pl-4 border-l-2 border-hc-tertiary/30">
                                    {prompt}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Mood Entry</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this mood entry? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteEntry(entry.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
        )}
      </div>
    </div>
  );
};