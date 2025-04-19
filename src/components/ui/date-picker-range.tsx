"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils"; // update path if needed
import { type DateRange } from "react-day-picker";

interface DateRangePickerProps {
  date: DateRange | undefined;
  setDate: (range: DateRange | undefined) => void;
}

export function DateRangePicker({ date, setDate }: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            // variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto border-0 bg-transparent p-0"
          align="start"
        >
          <Calendar
            initialFocus
            mode="range"
            className="bg-[#e0ecfc]"
            numberOfMonths={2}
            selected={date}
            onSelect={setDate}
          />
          <div className="border-border flex justify-between border-t px-3 py-2">
            <Button size="sm" onClick={() => setDate(undefined)}>
              Clear
            </Button>
            <Button
              size="sm"
              onClick={() => setDate({ from: new Date(), to: new Date() })}
            >
              Today
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
