import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';
import { createPortal } from 'react-dom';

interface GamingDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  minDate?: Date;
  maxDate?: Date;
  isClearable?: boolean;
  showTimeSelect?: boolean;
  dateFormat?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  onBlur?: () => void;
}

const GamingDatePicker: React.FC<GamingDatePickerProps> = ({
  selected,
  onChange,
  placeholderText = "Seleccionar fecha...",
  minDate,
  maxDate,
  isClearable = true,
  showTimeSelect = false,
  dateFormat = "dd/MM/yyyy",
  className = "",
  disabled = false,
  required = false,
  name,
  onBlur
}) => {
  return (
    <div className="relative">
      <DatePicker
        selected={selected}
        onChange={onChange}
        placeholderText={placeholderText}
        minDate={minDate}
        maxDate={maxDate}
        isClearable={isClearable}
        showTimeSelect={showTimeSelect}
        dateFormat={dateFormat}
        disabled={disabled}
        name={name}
        onBlur={onBlur}
        className={`w-full px-4 py-3 rounded-lg border-2 bg-white/10 backdrop-blur-sm text-white border-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${className}`}
        popperClassName="gaming-datepicker-popper"
        popperPlacement="bottom-start"
        portalId="datepicker-portal"

        dayClassName={(date) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const selectedDate = new Date(date);
          selectedDate.setHours(0, 0, 0, 0);
          
          if (selectedDate.getTime() === today.getTime()) {
            return 'gaming-today';
          }
          return '';
        }}
        calendarClassName="gaming-calendar"
        wrapperClassName="w-full"
      />
    </div>
  );
};

export default GamingDatePicker;
