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
import { useIsMobile } from '@/hooks/use-mobile';
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
  const isMobile = useIsMobile();

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
    <div className={cn(
      isMobile ? "space-y-4 px-2" : "space-y-6"
    )}>
      {/* Search and Filters */}
      <Card>
        <CardHeader className={cn(
          isMobile ? "p-4" : "p-6"
        )}>
          <div className={cn(
            "flex items-center justify-between",
            isMobile ? "flex-col space-y-3" : "flex-row"
          )}>
            <CardTitle className={cn(
              "text-hc-primary",
              isMobile ? "text-lg" : "text-xl"
            )}>Mood History</CardTitle>
            <Button
              variant="outline"
              size={isMobile ? "sm" : "sm"}
              onClick={() => setShowFilters(!showFilters)}
              className={isMobile ? "w-full" : ""}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className={cn(
          "space-y-4",
          isMobile ? "p-4" : "p-6"
        )}>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder={isMobile ? "Search mood entries..." : "Search by notes, activities, or mood..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "pl-10",
                isMobile ? "h-11 text-base" : ""
              )}
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <div className={cn(
              "bg-gray-50 rounded-lg",
              isMobile ? "space-y-3 p-3" : "space-y-4 p-4"
            )}>
              <div className={cn(
                "grid gap-4",
                isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"
              )}>
                {/* Date Range Filter */}
                <div className={cn(
                  isMobile ? "space-y-1.5" : "space-y-2"
                )}>
                  <label className={cn(
                    "font-medium text-gray-700",
                    isMobile ? "text-xs" : "text-sm"
                  )}>Date Range</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          isMobile ? "h-10 text-sm" : "",
                          !selectedDateRange.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDateRange.from ? (
                          selectedDateRange.to ? (
                            <>
                              {format(selectedDateRange.from, isMobile ? "MMM dd" : "LLL dd, y")} -{" "}
                              {format(selectedDateRange.to, isMobile ? "MMM dd" : "LLL dd, y")}
                            </>
                          ) : (
                            format(selectedDateRange.from, isMobile ? "MMM dd, y" : "LLL dd, y")
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
                        numberOfMonths={isMobile ? 1 : 2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Mood Level Filter */}
                <div className={cn(
                  isMobile ? "space-y-1.5" : "space-y-2"
                )}>
                  <label className={cn(
                    "font-medium text-gray-700",
                    isMobile ? "text-xs" : "text-sm"
                  )}>Mood Level</label>
                  <Select onValueChange={handleMoodLevelFilter}>
                    <SelectTrigger className={cn(
                      isMobile ? "h-10 text-sm" : ""
                    )}>
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
                <div className={cn(
                  isMobile ? "space-y-1.5" : "space-y-2"
                )}>
                  <label className={cn(
                    "font-medium text-gray-700",
                    isMobile ? "text-xs" : "text-sm"
                  )}>Notes</label>
                  <Select onValueChange={handleNotesFilter}>
                    <SelectTrigger className={cn(
                      isMobile ? "h-10 text-sm" : ""
                    )}>
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

              <div className={cn(
                "flex",
                isMobile ? "justify-center" : "justify-end"
              )}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                  className={isMobile ? "w-full" : ""}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className={cn(
        "flex items-center justify-between text-gray-600",
        isMobile ? "text-xs px-2" : "text-sm"
      )}>
        <span>
          Showing {filteredEntries.length} of {moodEntries.length} entries
        </span>
      </div>

      {/* Entries List */}
      <div className={cn(
        isMobile ? "space-y-3" : "space-y-4"
      )}>
        {filteredEntries.length === 0 ? (
          <Card>
            <CardContent className={cn(
              "text-center",
              isMobile ? "p-6" : "p-8"
            )}>
              <div className={cn(
                "mb-4",
                isMobile ? "text-3xl" : "text-4xl"
              )}>🔍</div>
              <h3 className={cn(
                "font-medium text-gray-700 mb-2",
                isMobile ? "text-base" : "text-lg"
              )}>No entries found</h3>
              <p className={cn(
                "text-gray-600",
                isMobile ? "text-sm" : "text-base"
              )}>
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
                  <CardContent className={cn(
                    isMobile ? "p-4" : "p-6"
                  )}>
                    {/* Mobile Layout */}
                    <div className={isMobile ? "block" : "hidden"}>
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-3xl">{entry.emoji}</div>
                            <div>
                              <Badge variant="secondary" className="bg-hc-tertiary/20 text-hc-primary text-xs">
                                {moodConfig?.label} ({entry.moodLevel}/5)
                              </Badge>
                            </div>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0">
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
                        
                        {/* Date/Time */}
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {format(new Date(entry.timestamp), "MMM d, yyyy 'at' h:mm a")}
                        </div>
                        
                        {/* Notes */}
                        {entry.notes && (
                          <div className="space-y-1">
                            <div className="flex items-center text-xs text-gray-700">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Notes
                            </div>
                            <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                              {entry.notes}
                            </p>
                          </div>
                        )}
                        
                        {/* Activities */}
                        {entry.activities && entry.activities.length > 0 && (
                          <div className="space-y-1">
                            <div className="flex items-center text-xs text-gray-700">
                              <Activity className="h-3 w-3 mr-1" />
                              Activities
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {entry.activities.map((activity, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="bg-hc-accent/10 text-hc-accent border-hc-accent/20 text-xs px-2 py-0.5"
                                >
                                  {activity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Reflection Prompts */}
                        {entry.reflectionPrompts && entry.reflectionPrompts.length > 0 && (
                          <div className="space-y-1">
                            <div className="flex items-center text-xs text-gray-700">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Reflections
                            </div>
                            <div className="space-y-1">
                              {entry.reflectionPrompts.map((prompt, index) => (
                                <p key={index} className="text-xs text-gray-600 pl-3 border-l-2 border-hc-tertiary/30">
                                  {prompt}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Desktop Layout */}
                    <div className={isMobile ? "hidden" : "block"}>
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