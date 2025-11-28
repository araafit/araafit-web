import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import "./date-picker-style.css"

interface DatePickerProps {
  label: string;
  value?: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export const DatePicker = ({ 
  label, 
  value, 
  onChange, 
  placeholder = 'Select date',
  className = ''
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`flex-1 space-y-2 ${className}`}>
      <label className="font-inter font-light text-[16px] text-[#1C1C1C]">
        {label}
      </label>
      
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <button
            className="w-full border border-[#D0D5DD] px-3 py-2 rounded-lg text-sm flex items-center justify-between text-left hover:border-gray-400 transition"
          >
            <span className={value ? 'text-black' : 'text-gray-400'}>
              {value ? format(value, 'MMM dd, yyyy') : placeholder}
            </span>
            <Calendar className="h-4 w-4 text-gray-400" />
          </button>
        </Popover.Trigger>
        
        <Popover.Portal>
          <Popover.Content
            className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50"
            sideOffset={5}
            align="start"
          >
            <DayPicker
              mode="single"
              selected={value}
              onSelect={(date) => {
                onChange(date);
                setIsOpen(false);
              }}
              className="rdp"
            />
            <Popover.Arrow className="fill-white" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};