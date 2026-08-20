import {
  MdAirlineSeatReclineNormal,
  MdArrowForward,
  MdBlock,
  MdBolt,
  MdCalendarMonth,
  MdCall,
  MdCancel,
  MdCheck,
  MdCheckCircle,
  MdChevronLeft,
  MdChevronRight,
  MdClose,
  MdCreditCard,
  MdDirectionsCar,
  MdEditCalendar,
  MdError,
  MdEventAvailable,
  MdEventBusy,
  MdExpandMore,
  MdFavorite,
  MdFavoriteBorder,
  MdHelpOutline,
  MdHourglassTop,
  MdLocalGasStation,
  MdLocalShipping,
  MdLocationOn,
  MdLock,
  MdLogout,
  MdMenu,
  MdPalette,
  MdPayments,
  MdPerson,
  MdPublic,
  MdReceiptLong,
  MdRoute,
  MdSchedule,
  MdSearch,
  MdSend,
  MdSensorDoor,
  MdSettings,
  MdShare,
  MdSpeed,
  MdStar,
  MdStarBorder,
  MdStraighten,
  MdSupportAgent,
  MdSwapVert,
  MdSyncAlt,
  MdTimer,
  MdVerified,
} from 'react-icons/md';

/** Map previous Material Symbols names → react-icons (Material Design). */
const ICONS = {
  airline_seat_recline_normal: MdAirlineSeatReclineNormal,
  airline_seat_recline_extra: MdAirlineSeatReclineNormal,
  arrow_forward: MdArrowForward,
  block: MdBlock,
  bolt: MdBolt,
  calendar_month: MdCalendarMonth,
  call: MdCall,
  cancel: MdCancel,
  check: MdCheck,
  check_circle: MdCheckCircle,
  chevron_left: MdChevronLeft,
  chevron_right: MdChevronRight,
  close: MdClose,
  credit_card: MdCreditCard,
  directions_car: MdDirectionsCar,
  edit_calendar: MdEditCalendar,
  error: MdError,
  event_available: MdEventAvailable,
  event_busy: MdEventBusy,
  expand_more: MdExpandMore,
  favorite: MdFavorite,
  favorite_border: MdFavoriteBorder,
  hourglass_top: MdHourglassTop,
  local_gas_station: MdLocalGasStation,
  local_shipping: MdLocalShipping,
  location_on: MdLocationOn,
  lock: MdLock,
  logout: MdLogout,
  menu: MdMenu,
  palette: MdPalette,
  payments: MdPayments,
  person: MdPerson,
  public: MdPublic,
  receipt_long: MdReceiptLong,
  route: MdRoute,
  schedule: MdSchedule,
  search: MdSearch,
  send: MdSend,
  sensor_door: MdSensorDoor,
  settings: MdSettings,
  share: MdShare,
  speed: MdSpeed,
  star: MdStarBorder,
  straighten: MdStraighten,
  support_agent: MdSupportAgent,
  swap_vert: MdSwapVert,
  sync_alt: MdSyncAlt,
  terrain: MdVerified,
  timer: MdTimer,
  verified: MdVerified,
};

const FILLED = {
  star: MdStar,
};

/**
 * Drop-in icon component (same API as the old Material Symbols wrapper).
 * Uses react-icons/md under the hood.
 */
export default function MaterialIcon({ name, filled = false, className = '', size, ...rest }) {
  const Icon = (filled && FILLED[name]) || ICONS[name] || MdHelpOutline;

  return (
    <Icon
      className={`gre-icon ${className}`.trim()}
      size={size}
      aria-hidden={rest['aria-hidden'] ?? true}
      focusable="false"
      {...rest}
    />
  );
}
